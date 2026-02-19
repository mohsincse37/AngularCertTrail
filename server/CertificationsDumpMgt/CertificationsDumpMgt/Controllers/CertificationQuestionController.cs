using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Models;
using Service;
using Data.ViewModels;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System.Transactions;

namespace CertificationsDumpMgt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificationQuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        private readonly ICertificationTopicService _topicService;
        private readonly IQuestionOptionService _questionOptionService;
        private readonly IQuestionCorrectOptionsService _qCorrOptionService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CertificationQuestionController(IQuestionService _questionService, ICertificationTopicService _topicService, IQuestionOptionService _questionOptionService, IQuestionCorrectOptionsService _qCorrOptionService, IWebHostEnvironment webHostEnvironment)
        {
            this._questionService = _questionService;
            this._topicService = _topicService;
            this._questionOptionService = _questionOptionService;
            this._qCorrOptionService = _qCorrOptionService;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        [Route("GetCertificationQuestion")]
        public async Task<List<QuestionViewModel>> GetCertificationQuestions()
        {
            var questionAll = new List<QuestionViewModel>();
            var questionList = (await _questionService.GetQuestionsAsync()).ToList();
            var topicList = (await _topicService.GetTopicsAsync()).ToList();
            var corrOptionAllList = (await _qCorrOptionService.GetQuestionCorrectOptionsAsync()).ToList();
            var questionOptionAllList = (await _questionOptionService.GetQuestionOptionsAsync()).ToList();
 
           
            for (int i = 0; i < questionList.Count; i++)
            {
                string optionAll = string.Empty;
                var currentQuestionID = questionList[i].ID;
                var corrOptionList = corrOptionAllList.Where(a => a.QuestionID == currentQuestionID).OrderBy(a => a.CorrectionOptionID).ToList();
                for (int j = 0; j < corrOptionList.Count; j++)
                {
                    var questionOption = questionOptionAllList.FirstOrDefault(o => o.ID == corrOptionList[j].CorrectionOptionID);
                    if (questionOption != null)
                    {
                        optionAll += questionOption.OptionTitle + ",";
                    }
                }
                optionAll = optionAll.TrimEnd(',');
            
                questionAll.Add(new QuestionViewModel()
                {
                    ID = questionList[i].ID,
                    QuestionTitle = questionList[i].QuestionTitle,
                    CorrectOptionTitle = optionAll,
                    AnsDescription = questionList[i].AnsDescription,
                    QuestionImgPath = questionList[i].QuestionImgPath,
                    OptionType = questionList[i].OptionType,    
                    IsActive = questionList[i].IsActive,
                    TopicID= questionList[i].TopicID
                });
            }
            
            questionAll = (from q in questionAll
                           join t in topicList on q.TopicID equals t.ID                          

                           select new QuestionViewModel()
                           {
                               ID = q.ID,
                               QuestionTitle = q.QuestionTitle,                              
                               IsActive = q.IsActive,
                               TopicID = q.TopicID,
                               TopicTitle = t.TopicTitle,
                               QuestionImgPath = q.QuestionImgPath,                              
                               OptionTypeText = (q.OptionType == 1 ? "Radio": "CheckBox"),
                               CorrectOptionTitle = q.CorrectOptionTitle
                           }).OrderBy(q => q.TopicID).ToList();
            return questionAll;
        }
        [HttpGet]
        [Route("GetQuestionDataByTopicID/{topicID}")]
        public async Task<List<CertificationQuestion>> GetQuestionDataByTopicID(int topicID)
        {            
            var questions = await _questionService.GetQuestionsAsync();
            var questionAll = questions.Where(q => q.TopicID == topicID).OrderBy(o => o.ID).ToList();
            return questionAll;            
        }
        [HttpGet]
        [Route("GetCertificationQuestion/{id}")]
        public async Task<CertificationQuestion> GetCertificationQuestion(int id)
        {            
            var question = await _questionService.GetCertificationQuestionAsync(id);
            return question;
        }

        [HttpPost]
        [Route("AddCertificationQuestion")]
        public async Task<int> AddCertificationQuestion([FromForm] QuestionViewModel objQuestionViewModel)
        {
            try
            {
                var question = new CertificationQuestion();
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled)) //transaction should be placed upon using context always
                {
                    if (objQuestionViewModel.file != null)
                    {
                        var questions = await GetCertificationQuestions();
                        int maxQID = questions.Max(q => q.ID);
                        maxQID = maxQID + 1;

                        var fName = maxQID.ToString();
                        string extension = System.IO.Path.GetExtension(objQuestionViewModel.file.FileName);
                        //path = Path.Combine(@"D:\CerDumpsFiles\QuestionFiles", maxQID + extension);//for directory saving
                        var path = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "Images/QuestionImages", fName + extension);
                        using (Stream stream = new FileStream(path, FileMode.Create))
                        {
                            objQuestionViewModel.file.CopyTo(stream);
                        }
                        question.QuestionImgPath = "/Images/QuestionImages/" + fName + extension; ;
                    }
                    question.QuestionTitle = objQuestionViewModel.QuestionTitle;
                    question.TopicID = objQuestionViewModel.TopicID;
                    question.IsActive = objQuestionViewModel.IsActive;
                    question.OptionType = objQuestionViewModel.OptionType;

                    question.EntryDate = DateTime.Now;
                    await _questionService.CreateQuestionAsync(question);
                    scope.Complete();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
            //return CreatedAtAction(nameof(GetCertificationQuestion), new { id = objCertificationQuestion.ID, objCertificationQuestion });           
        }
       
        [HttpPut]
        [Route("UpdateCertificationQuestion/{id}")]
        public async Task<int> UpdateCertificationQuestion(int id, [FromForm] QuestionViewModel objQuestionViewModel)
        {            
            try
            {
                var questionInfo = await _questionService.GetCertificationQuestionAsync(id);
                
                if (objQuestionViewModel.file != null)
                {
                    if (System.IO.File.Exists(questionInfo.QuestionImgPath))
                    {
                        System.IO.File.Delete(questionInfo.QuestionImgPath);
                    }                    
                    var fName = id.ToString();
                    string extension = System.IO.Path.GetExtension(objQuestionViewModel.file.FileName);
                    //path = Path.Combine(@"D:\CerDumpsFiles\QuestionFiles", maxQID + extension);    //for directory saving
                    var path = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "Images/QuestionImages", fName + extension);
                    using (Stream stream = new FileStream(path, FileMode.Create))
                    {
                        objQuestionViewModel.file.CopyTo(stream);
                    }
                    questionInfo.QuestionImgPath = "/Images/QuestionImages/" + fName + extension; ;
                }
                questionInfo.ID = objQuestionViewModel.ID;
                questionInfo.QuestionTitle = objQuestionViewModel.QuestionTitle;
                questionInfo.TopicID = objQuestionViewModel.TopicID;
                questionInfo.IsActive = objQuestionViewModel.IsActive;
                questionInfo.OptionType = objQuestionViewModel.OptionType;
                if (questionInfo.OptionType == null) questionInfo.OptionType = 1;

                await _questionService.UpdateQuestionAsync(questionInfo);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteCertificationQuestion/{id}")]
        public async Task<int> DeleteCertificationQuestion(int id)
        {
            try
            {
                var questionInfo = await _questionService.GetCertificationQuestionAsync(id);
                if (System.IO.File.Exists(questionInfo.QuestionImgPath))
                {
                    System.IO.File.Delete(questionInfo.QuestionImgPath);
                }
                await _questionService.DeleteQuestionReferencesAsync(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;

        }
        [HttpGet]
        [Route("GetMaxQuestionNo/{topicID}")]
        public async Task<CertificationQuestion> GetMaxQuestionNo(int topicID)
        {
            var questions = await _questionService.GetQuestionsAsync();
            var question = questions.Where(q => q.TopicID == topicID).OrderByDescending(q=>q.QuestionNo).FirstOrDefault();
            return question;
        }
    }
}
