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
        public List<QuestionViewModel> GetCertificationQuestions()
        {
            var questionAll = new List<QuestionViewModel>();
            var questionList = _questionService.GetQuestions().ToList();
            var topicList = _topicService.GetTopics().ToList();
 
           
            for (int i = 0; i < questionList.Count; i++)
            {
                string optionAll = string.Empty;
                var corrOptionList = _qCorrOptionService.GetQuestionCorrectOptions().Where(a=>a.QuestionID == questionList[i].ID).OrderBy(a=>a.CorrectionOptionID).ToList();
                for (int j = 0; j < corrOptionList.Count; j++)
                {
                    var questionOption = _questionOptionService.GetQuestionOption(corrOptionList[j].CorrectionOptionID);
                    optionAll += questionOption.OptionTitle + ",";                
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
        public List<CertificationQuestion> GetQuestionDataByTopicID(int topicID)
        {            
            var questionAll = _questionService.GetQuestions().Where(q => q.TopicID == topicID).OrderBy(o => o.ID).ToList();
            return questionAll;            
        }
        [HttpGet]
        [Route("GetCertificationQuestion/{id}")]
        public CertificationQuestion GetCertificationQuestion(int id)
        {            
            var question = _questionService.GetCertificationQuestion(id);
            return question;
        }

        [HttpPost]
        [Route("AddCertificationQuestion")]
        public int AddCertificationQuestion([FromForm] QuestionViewModel objQuestionViewModel)
        {
            try
            {
                var question = new CertificationQuestion();
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required)) //transaction should be placed upon using context always
                {
                    if (objQuestionViewModel.file != null)
                    {
                        int maxQID = GetCertificationQuestions().Max(q => q.ID);
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
                    _questionService.CreateQuestion(question);
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
        public int UpdateCertificationQuestion(int id, [FromForm] QuestionViewModel objQuestionViewModel)
        {            
            try
            {
                var questionInfo = _questionService.GetCertificationQuestion(id);
                
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

                _questionService.UpdateQuestion(questionInfo);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteCertificationQuestion/{id}")]
        public int DeleteCertificationQuestion(int id)
        {
            try
            {
                var questionInfo = _questionService.GetCertificationQuestion(id);
                if (System.IO.File.Exists(questionInfo.QuestionImgPath))
                {
                    System.IO.File.Delete(questionInfo.QuestionImgPath);
                }
                _questionService.DeleteQuestionReferences(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;

        }
        [HttpGet]
        [Route("GetMaxQuestionNo/{topicID}")]
        public CertificationQuestion GetMaxQuestionNo(int topicID)
        {
            var question = _questionService.GetQuestions().Where(q => q.TopicID == topicID).OrderByDescending(q=>q.QuestionNo).FirstOrDefault();
            return question;
        }
    }
}
