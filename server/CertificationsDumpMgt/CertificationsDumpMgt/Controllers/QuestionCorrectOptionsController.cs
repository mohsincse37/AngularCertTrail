using Data.Models;
using Data.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service;

namespace CertificationsDumpMgt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionCorrectOptionsController : ControllerBase
    {
        private readonly IQuestionCorrectOptionsService _qCorrOptionService;
        private readonly IQuestionService _questionService;
        public QuestionCorrectOptionsController(IQuestionCorrectOptionsService _qCorrOptionService, IQuestionService _questionService)
        {
            this._qCorrOptionService = _qCorrOptionService;
            this._questionService = _questionService;
        }
        [HttpGet]
        [Route("GetQuestionCorrectOptions")]
        public List<QuestionCorrectOptionMapping> GetQuestionCorrectOptions()
        {
            var qCorrOptionsAll = new List<QuestionCorrectOptionMapping>();
            qCorrOptionsAll = _qCorrOptionService.GetQuestionCorrectOptions().ToList();
            return qCorrOptionsAll;
        }
        [HttpGet]
        [Route("GetQuestionCorrectOption/{id}")]
        public QuestionCorrectOptionMapping GetQuestionCorrectOption(int id)
        {
            var corrOption = _qCorrOptionService.GetQuestionCorrectOption(id);
            return corrOption;
        }
        [HttpPost]
        [Route("CreateQuestionCorrectOptions")]
        public int CreateQuestionCorrectOptions(QuestionCorrectOptionMappingViewModel objQCorrOptions)
        {
            try
            {
                var oldQuestion = _questionService.GetQuestions().SingleOrDefault(q => q.ID == objQCorrOptions.QuestionID);                
                oldQuestion.AnsDescription = objQCorrOptions.AnsDescription;
                _questionService.UpdateQuestion(oldQuestion);
                          
                int[] optionArray = Array.ConvertAll(objQCorrOptions.CorrectOptionID.Split(','), int.Parse);
                foreach (var item in optionArray)
                {
                    var questionCorrOption = new QuestionCorrectOptionMapping();
                    questionCorrOption.QuestionID = objQCorrOptions.QuestionID;
                    questionCorrOption.CorrectionOptionID = item;
                    _qCorrOptionService.CreateQuestionCorrectOptions(questionCorrOption);
                }
                
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }
    }
}
