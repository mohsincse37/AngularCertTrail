using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IQuestionOptionService
    {
        IEnumerable<QuestionOption> GetQuestionOptions();
        QuestionOption GetQuestionOption(int optionID);
        void CreateQuestionOption(QuestionOption questionOption);
        void UpdateQuestionOption(QuestionOption questionOption);
        void DeleteQuestionOptionReferences(int optionID);
        void SaveQuestionOption();
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

        public IEnumerable<QuestionOption> GetQuestionOptions()
        {
            return questionOptionRepository.GetAll();

        }
        public QuestionOption GetQuestionOption(int optionID)
        {
            return questionOptionRepository.GetById(optionID);

        }
        public void CreateQuestionOption(QuestionOption questionOption)
        {
            questionOptionRepository.Add(questionOption);
            SaveQuestionOption();
        }
        public void UpdateQuestionOption(QuestionOption questionOption)
        {
            questionOptionRepository.Update(questionOption);
            SaveQuestionOption();
        }
        public void DeleteQuestionOptionReferences(int optionID)
        {
            QuestionOption questionOption = questionOptionRepository.GetById(optionID);
            questionOptionRepository.Delete(questionOption);
            SaveQuestionOption();
        }
        public void SaveQuestionOption()
        {
            unitOfWork.Commit();
        }
        #endregion
    }
}
