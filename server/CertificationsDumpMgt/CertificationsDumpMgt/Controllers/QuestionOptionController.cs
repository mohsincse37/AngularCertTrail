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
        public List<QuestionOptionViewModel> GetQuestionOption()
        {
            var questionOptionAll = new List<QuestionOptionViewModel>();
            var questionList = _questionService.GetQuestions().ToList();
            var optionList = _questionOptionService.GetQuestionOptions().ToList();
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
        public List<QuestionWithOption> GetQuestionWithOptionByTopicID(int topicID)
        {
            var questionAll = new List<QuestionViewModel>();
            var questionList = _questionService.GetQuestions().Where(q => q.TopicID == topicID).ToList();              
            
            for (int i = 0; i < questionList.Count; i++)
            {
                string optionTitleAll = string.Empty;
                string optionIDAll = string.Empty;
                var corrOptionList = _qCorrOptionService.GetQuestionCorrectOptions().Where(a => a.QuestionID == questionList[i].ID).OrderBy(a=>a.CorrectionOptionID).ToList();
                for (int j = 0; j < corrOptionList.Count; j++)
                {
                    var questionOption = _questionOptionService.GetQuestionOption(corrOptionList[j].CorrectionOptionID);
                    optionTitleAll += questionOption.OptionTitle + ","; 
                    optionIDAll += questionOption.ID + ",";
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
                var options = _questionOptionService.GetQuestionOptions().Where(o => o.QuestionID == questionAll[i].ID).OrderBy(o => o.OrderNo).ToList();
              
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
        public List<MultiSelectOption> GetOptionDataByQuestionID(int questionID)
        {
            var mulOption = new List<MultiSelectOption>();
            var options = _questionOptionService.GetQuestionOptions().Where(o => o.QuestionID == questionID).OrderBy(o => o.OrderNo).ToList();

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
        public QuestionOption GetQuestionOption(int id)
        {           
            var questionOption = _questionOptionService.GetQuestionOption(id);
            return questionOption;
        }
        [HttpGet]
        [Route("GetQuestionWithTopicWithOption/{id}")]
        public QuestionOptionViewModel GetQuestionWithTopicWithOption(int id)
        {
            var questionOptionWithQuesWithTo = GetQuestionOption().FirstOrDefault(o => o.ID == id);
            return questionOptionWithQuesWithTo;
        }
        [HttpPost]
        [Route("AddQuestionOption")]
        public int AddQuestionOption([FromForm] QuestionOptionViewModel objQuestionOptionViewModel)
        {
            try
            {
                var objQuestionOption = new QuestionOption();

                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required)) //transaction should be placed upon using context always
                {
                    if (objQuestionOptionViewModel.file != null)
                    {
                        int maxOID = GetQuestionOption().Max(o => o.ID);
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
                    _questionOptionService.CreateQuestionOption(objQuestionOption);
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
        public int UpdateQuestionOption(int id, [FromForm] QuestionOptionViewModel objQuestionOptionViewModel)
        {
            try
            {
                var objQuestionOption = _questionOptionService.GetQuestionOption(id);
                
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
               
                _questionOptionService.UpdateQuestionOption(objQuestionOption);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteQuestionOption/{id}")]
        public int DeleteQuestionOption(int id)
        {
            try
            {
                var objQuestionOption = _questionOptionService.GetQuestionOption(id);
                if (System.IO.File.Exists(objQuestionOption.OptionImgPath))
                {
                    System.IO.File.Delete(objQuestionOption.OptionImgPath);
                }
                _questionOptionService.DeleteQuestionOptionReferences(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;

        }
    }
}
