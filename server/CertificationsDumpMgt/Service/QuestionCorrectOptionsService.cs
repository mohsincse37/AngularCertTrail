using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IQuestionCorrectOptionsService
    {
        Task<IEnumerable<QuestionCorrectOptionMapping>> GetQuestionCorrectOptionsAsync();
        Task<QuestionCorrectOptionMapping> GetQuestionCorrectOptionAsync(int optionID);
        Task CreateQuestionCorrectOptionsAsync(QuestionCorrectOptionMapping questionCorrectOptions);
       
        Task SaveQuestionCorrectOptionsAsync();
    }
    public class QuestionCorrectOptionsService : IQuestionCorrectOptionsService
    {
        private readonly IQuestionCorrectOptionsRepository questionCorrOptionsRepository;
        private readonly IUnitOfWork unitOfWork;

        public QuestionCorrectOptionsService(IQuestionCorrectOptionsRepository questionCorrOptionsRepository, IUnitOfWork unitOfWork)
        {
            this.questionCorrOptionsRepository = questionCorrOptionsRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public async Task<IEnumerable<QuestionCorrectOptionMapping>> GetQuestionCorrectOptionsAsync()
        {
            return await questionCorrOptionsRepository.GetAllAsync();
        }
        public async Task<QuestionCorrectOptionMapping> GetQuestionCorrectOptionAsync(int optionID)
        {
            return await questionCorrOptionsRepository.GetByIdAsync(optionID);

        }
        public async Task CreateQuestionCorrectOptionsAsync(QuestionCorrectOptionMapping questionCorrectOptions)
        {
            questionCorrOptionsRepository.Add(questionCorrectOptions);
            await SaveQuestionCorrectOptionsAsync();
        }       
        public async Task SaveQuestionCorrectOptionsAsync()
        {
            await unitOfWork.CommitAsync();
        }

        #endregion
    }
}
