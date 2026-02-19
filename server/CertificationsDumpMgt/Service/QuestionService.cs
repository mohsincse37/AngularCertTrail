using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IQuestionService
    {
        Task<IEnumerable<CertificationQuestion>> GetQuestionsAsync();
        Task<CertificationQuestion> GetCertificationQuestionAsync(int questionID);
        Task CreateQuestionAsync(CertificationQuestion certificationQuestion);
        Task UpdateQuestionAsync(CertificationQuestion certificationQuestion);
        Task DeleteQuestionReferencesAsync(int questionID);
        Task SaveQuestionAsync();
    }
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository questionRepository;
        private readonly IUnitOfWork unitOfWork;

        public QuestionService(IQuestionRepository questionRepository, IUnitOfWork unitOfWork)
        {
            this.questionRepository = questionRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public async Task<IEnumerable<CertificationQuestion>> GetQuestionsAsync()
        {
            return await questionRepository.GetAllAsync();

        }
        public async Task<CertificationQuestion> GetCertificationQuestionAsync(int questionID)
        {
            return await questionRepository.GetByIdAsync(questionID);

        }
        public async Task CreateQuestionAsync(CertificationQuestion certificationQuestion)
        {
            questionRepository.Add(certificationQuestion);
            await SaveQuestionAsync();
        }
        public async Task UpdateQuestionAsync(CertificationQuestion certificationQuestion)
        {
            questionRepository.Update(certificationQuestion);
            await SaveQuestionAsync();
        }
        public async Task DeleteQuestionReferencesAsync(int questionID)
        {
            CertificationQuestion question = await questionRepository.GetByIdAsync(questionID);
            questionRepository.Delete(question);
            await SaveQuestionAsync();
        }
        public async Task SaveQuestionAsync()
        {
            await unitOfWork.CommitAsync();
        }

        #endregion
    }
}
