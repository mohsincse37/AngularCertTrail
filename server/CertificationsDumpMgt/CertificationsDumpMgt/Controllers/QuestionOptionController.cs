using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Models;
using Service;
using Data.ViewModels;
using System.Text.RegularExpressions;
using System.Transactions;

namespace CertificationsDumpMgt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionOptionController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        private readonly IQuestionOptionService _questionOptionService;
        private readonly IQuestionCorrectOptionsService _qCorrOptionService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public QuestionOptionController(IQuestionService _questionService, IQuestionOptionService _questionOptionService, IQuestionCorrectOptionsService _qCorrOptionService, IWebHostEnvironment webHostEnvironment)
        {
            this._questionService = _questionService;
            this._questionOptionService = _questionOptionService;
            this._qCorrOptionService = _qCorrOptionService;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        [Route("GetQuestionOption")]
        public async Task<List<QuestionOptionViewModel>> GetQuestionOption()
        {
            var questionOptionAll = new List<QuestionOptionViewModel>();
            var questionList = (await _questionService.GetQuestionsAsync()).ToList();
            var optionList = (await _questionOptionService.GetQuestionOptionsAsync()).ToList();
            questionOptionAll = (from q in questionList
                           join o in optionList on q.ID equals o.QuestionID

                           select new QuestionOptionViewModel()
                           {
                               ID = o.ID,
                               OptionTitle= o.OptionTitle,
                               OrderNo=o.OrderNo,
                               QuestionID=q.ID,
                               QuestionTitle = q.QuestionTitle,
                               OptionImgPath = o.OptionImgPath,
                               TopicID = q.TopicID                             

                           }).OrderBy(o=>o.QuestionID).ToList();
            return questionOptionAll;
        }
        [HttpGet]
        [Route("GetQuestionWithOptionByTopicID/{topicID}")]
        public async Task<List<QuestionWithOption>> GetQuestionWithOptionByTopicID(int topicID)
        {
            var questionAll = new List<QuestionViewModel>();
            var allQuestions = await _questionService.GetQuestionsAsync();
            var questionList = allQuestions.Where(q => q.TopicID == topicID).ToList();
            var corrOptionAllList = (await _qCorrOptionService.GetQuestionCorrectOptionsAsync()).ToList();
            var questionOptionAllList = (await _questionOptionService.GetQuestionOptionsAsync()).ToList();
            
            for (int i = 0; i < questionList.Count; i++)
            {
                string optionTitleAll = string.Empty;
                string optionIDAll = string.Empty;
                var currentQuestionID = questionList[i].ID;
                var corrOptionList = corrOptionAllList.Where(a => a.QuestionID == currentQuestionID).OrderBy(a => a.CorrectionOptionID).ToList();
                for (int j = 0; j < corrOptionList.Count; j++)
                {
                    var questionOption = questionOptionAllList.FirstOrDefault(o => o.ID == corrOptionList[j].CorrectionOptionID);
                    if (questionOption != null)
                    {
                        optionTitleAll += questionOption.OptionTitle + ",";
                        optionIDAll += questionOption.ID + ",";
                    }
                }
                optionTitleAll = optionTitleAll.TrimEnd(',');
                optionIDAll = optionIDAll.TrimEnd(',');

                questionAll.Add(new QuestionViewModel()
                {
                    ID = questionList[i].ID,
                    QuestionNo = questionList[i].QuestionNo,
                    QuestionTitle = questionList[i].QuestionTitle,
                    CorrectOptionID = optionIDAll,
                    CorrectOptionTitle = optionTitleAll,
                    AnsDescription = questionList[i].AnsDescription,
                    QuestionImgPath = questionList[i].QuestionImgPath,
                    OptionType = questionList[i].OptionType,
                    IsActive = questionList[i].IsActive,
                    TopicID = questionList[i].TopicID
                });
            }           

            var questionWithOptionAll = new List<QuestionWithOption>();
            for (int i = 0; i < questionAll.Count; i++)
            {
                var options = questionOptionAllList.Where(o => o.QuestionID == questionAll[i].ID).OrderBy(o => o.OrderNo).ToList();
              
                questionWithOptionAll.Add(new QuestionWithOption()
                {
                    QuestionID = questionAll[i].ID,
                    QuestionNo = questionAll[i].QuestionNo,
                    QuestionTitle = questionAll[i].QuestionTitle,
                    CorrectOptionTitle = questionAll[i].CorrectOptionTitle,
                    CorrectOptionID = questionAll[i].CorrectOptionID,
                    AnsDescription = questionAll[i].AnsDescription,
                    QuestionImgPath = questionAll[i].QuestionImgPath,
                    OptionType = questionAll[i].OptionType,
                    QOption = options
                });
            }
            return questionWithOptionAll;
        }
        [HttpGet]
        [Route("GetOptionDataByQuestionID/{questionID}")]
        public async Task<List<MultiSelectOption>> GetOptionDataByQuestionID(int questionID)
        {
            var mulOption = new List<MultiSelectOption>();
            var allOptions = await _questionOptionService.GetQuestionOptionsAsync();
            var options = allOptions.Where(o => o.QuestionID == questionID).OrderBy(o => o.OrderNo).ToList();

            mulOption = (from o in options
                         select new MultiSelectOption()
                         {
                             value = o.ID.ToString(),
                             label =o.OptionTitle
                         }).ToList();
            return mulOption;
        }
        [HttpGet]
        [Route("GetQuestionOption/{id}")]
        public async Task<QuestionOption> GetQuestionOption(int id)
        {           
            var questionOption = await _questionOptionService.GetQuestionOptionAsync(id);
            return questionOption;
        }
        [HttpGet]
        [Route("GetQuestionWithTopicWithOption/{id}")]
        public async Task<QuestionOptionViewModel> GetQuestionWithTopicWithOption(int id)
        {
            var options = await GetQuestionOption();
            var questionOptionWithQuesWithTo = options.FirstOrDefault(o => o.ID == id);
            return questionOptionWithQuesWithTo;
        }
        [HttpPost]
        [Route("AddQuestionOption")]
        public async Task<int> AddQuestionOption([FromForm] QuestionOptionViewModel objQuestionOptionViewModel)
        {
            try
            {
                var objQuestionOption = new QuestionOption();

                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled)) //transaction should be placed upon using context always
                {
                    if (objQuestionOptionViewModel.file != null)
                    {
                        var options = await GetQuestionOption();
                        int maxOID = options.Max(o => o.ID);
                        maxOID = maxOID + 1;

                        var fName = maxOID.ToString();
                        string extension = System.IO.Path.GetExtension(objQuestionOptionViewModel.file.FileName);
                        //path = Path.Combine(@"D:\CerDumpsFiles\QuestionFiles", maxQID + extension);//for directory saving
                        var path = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "Images/OptionImages", fName + extension);
                        using (Stream stream = new FileStream(path, FileMode.Create))
                        {
                            objQuestionOptionViewModel.file.CopyTo(stream);
                        }
                        objQuestionOption.OptionImgPath = "/Images/OptionImages/" + fName + extension; ;
                    }
                    objQuestionOption.OptionTitle = objQuestionOptionViewModel.OptionTitle;
                    objQuestionOption.OrderNo = objQuestionOptionViewModel.OrderNo;
                    objQuestionOption.QuestionID = objQuestionOptionViewModel.QuestionID;
                    await _questionOptionService.CreateQuestionOptionAsync(objQuestionOption);
                    scope.Complete();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }
       
        [HttpPut]
        [Route("UpdateQuestionOption/{id}")]
        public async Task<int> UpdateQuestionOption(int id, [FromForm] QuestionOptionViewModel objQuestionOptionViewModel)
        {
            try
            {
                var objQuestionOption = await _questionOptionService.GetQuestionOptionAsync(id);
                
                if (objQuestionOptionViewModel.file != null)
                {
                    if (System.IO.File.Exists(objQuestionOption.OptionImgPath))
                    {
                        System.IO.File.Delete(objQuestionOption.OptionImgPath);
                    }                  
                    var fName = id.ToString();
                    string extension = System.IO.Path.GetExtension(objQuestionOptionViewModel.file.FileName);
                    //path = Path.Combine(@"D:\CerDumpsFiles\QuestionFiles", maxQID + extension);//for directory saving
                    var path = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "Images/OptionImages", fName + extension);
                    using (Stream stream = new FileStream(path, FileMode.Create))
                    {
                        objQuestionOptionViewModel.file.CopyTo(stream);
                    }
                    objQuestionOption.OptionImgPath = "/Images/OptionImages/" + fName + extension; ;
                }
                objQuestionOption.ID = objQuestionOptionViewModel.ID;
                objQuestionOption.OptionTitle = objQuestionOptionViewModel.OptionTitle;
                objQuestionOption.OrderNo = objQuestionOptionViewModel.OrderNo;
                objQuestionOption.QuestionID = objQuestionOptionViewModel.QuestionID;
               
                await _questionOptionService.UpdateQuestionOptionAsync(objQuestionOption);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteQuestionOption/{id}")]
        public async Task<int> DeleteQuestionOption(int id)
        {
            try
            {
                var objQuestionOption = await _questionOptionService.GetQuestionOptionAsync(id);
                if (System.IO.File.Exists(objQuestionOption.OptionImgPath))
                {
                    System.IO.File.Delete(objQuestionOption.OptionImgPath);
                }
                await _questionOptionService.DeleteQuestionOptionReferencesAsync(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;

        }
    }
}
