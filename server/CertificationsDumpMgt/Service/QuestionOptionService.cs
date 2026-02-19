using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IQuestionOptionService
    {
        Task<IEnumerable<QuestionOption>> GetQuestionOptionsAsync();
        Task<QuestionOption> GetQuestionOptionAsync(int optionID);
        Task CreateQuestionOptionAsync(QuestionOption questionOption);
        Task UpdateQuestionOptionAsync(QuestionOption questionOption);
        Task DeleteQuestionOptionReferencesAsync(int optionID);
        Task SaveQuestionOptionAsync();
    }
    public class QuestionOptionService : IQuestionOptionService
    {
        private readonly IQuestionOptionRepository questionOptionRepository;
        private readonly IUnitOfWork unitOfWork;

        public QuestionOptionService(IQuestionOptionRepository questionOptionRepository, IUnitOfWork unitOfWork)
        {
            this.questionOptionRepository = questionOptionRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public async Task<IEnumerable<QuestionOption>> GetQuestionOptionsAsync()
        {
            return await questionOptionRepository.GetAllAsync();

        }
        public async Task<QuestionOption> GetQuestionOptionAsync(int optionID)
        {
            return await questionOptionRepository.GetByIdAsync(optionID);

        }
        public async Task CreateQuestionOptionAsync(QuestionOption questionOption)
        {
            questionOptionRepository.Add(questionOption);
            await SaveQuestionOptionAsync();
        }
        public async Task UpdateQuestionOptionAsync(QuestionOption questionOption)
        {
            questionOptionRepository.Update(questionOption);
            await SaveQuestionOptionAsync();
        }
        public async Task DeleteQuestionOptionReferencesAsync(int optionID)
        {
            QuestionOption questionOption = await questionOptionRepository.GetByIdAsync(optionID);
            questionOptionRepository.Delete(questionOption);
            await SaveQuestionOptionAsync();
        }
        public async Task SaveQuestionOptionAsync()
        {
            await unitOfWork.CommitAsync();
        }
        #endregion
    }
}
