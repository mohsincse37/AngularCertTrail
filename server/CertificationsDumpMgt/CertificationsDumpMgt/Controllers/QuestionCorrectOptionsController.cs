using Data.Models;
using Data.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service;
using System.Transactions;

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
        public async Task<List<QuestionCorrectOptionMapping>> GetQuestionCorrectOptions()
        {
            var qCorrOptionsAll = new List<QuestionCorrectOptionMapping>();
            qCorrOptionsAll = (await _qCorrOptionService.GetQuestionCorrectOptionsAsync()).ToList();
            return qCorrOptionsAll;
        }
        [HttpGet]
        [Route("GetQuestionCorrectOption/{id}")]
        public async Task<QuestionCorrectOptionMapping> GetQuestionCorrectOption(int id)
        {
            var corrOption = await _qCorrOptionService.GetQuestionCorrectOptionAsync(id);
            return corrOption;
        }
        [HttpPost]
        [Route("CreateQuestionCorrectOptions")]
        public async Task<int> CreateQuestionCorrectOptions(QuestionCorrectOptionMappingViewModel objQCorrOptions)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled))
                {
                    var oldQuestion = await _questionService.GetCertificationQuestionAsync(objQCorrOptions.QuestionID);
                    oldQuestion.AnsDescription = objQCorrOptions.AnsDescription;
                    await _questionService.UpdateQuestionAsync(oldQuestion);

                    int[] optionArray = Array.ConvertAll(objQCorrOptions.CorrectOptionID.Split(','), int.Parse);
                    foreach (var item in optionArray)
                    {
                        var questionCorrOption = new QuestionCorrectOptionMapping();
                        questionCorrOption.QuestionID = objQCorrOptions.QuestionID;
                        questionCorrOption.CorrectionOptionID = item;
                        await _qCorrOptionService.CreateQuestionCorrectOptionsAsync(questionCorrOption);
                    }
                    scope.Complete();
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
