using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IQuestionCorrectOptionsService
    {
        IEnumerable<QuestionCorrectOptionMapping> GetQuestionCorrectOptions();
        QuestionCorrectOptionMapping GetQuestionCorrectOption(int optionID);
        void CreateQuestionCorrectOptions(QuestionCorrectOptionMapping questionCorrectOptions);
       
        void SaveQuestionCorrectOptions();
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

        public IEnumerable<QuestionCorrectOptionMapping> GetQuestionCorrectOptions()
        {
            return questionCorrOptionsRepository.GetAll();
        }
        public QuestionCorrectOptionMapping GetQuestionCorrectOption(int optionID)
        {
            return questionCorrOptionsRepository.GetById(optionID);

        }
        public void CreateQuestionCorrectOptions(QuestionCorrectOptionMapping questionCorrectOptions)
        {
            questionCorrOptionsRepository.Add(questionCorrectOptions);
            SaveQuestionCorrectOptions();
        }       
        public void SaveQuestionCorrectOptions()
        {
            unitOfWork.Commit();
        }

        #endregion
    }
}
