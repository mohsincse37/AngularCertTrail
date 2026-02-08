using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IQuestionService
    {
        IEnumerable<CertificationQuestion> GetQuestions();
        CertificationQuestion GetCertificationQuestion(int questionID);
        void CreateQuestion(CertificationQuestion certificationQuestion);
        void UpdateQuestion(CertificationQuestion certificationQuestion);
        void DeleteQuestionReferences(int questionID);
        void SaveQuestion();
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

        public IEnumerable<CertificationQuestion> GetQuestions()
        {
            return questionRepository.GetAll();

        }
        public CertificationQuestion GetCertificationQuestion(int questionID)
        {
            return questionRepository.GetById(questionID);

        }
        public void CreateQuestion(CertificationQuestion certificationQuestion)
        {
            questionRepository.Add(certificationQuestion);
            SaveQuestion();
        }
        public void UpdateQuestion(CertificationQuestion certificationQuestion)
        {
            questionRepository.Update(certificationQuestion);
            SaveQuestion();
        }
        public void DeleteQuestionReferences(int questionID)
        {
            CertificationQuestion question = questionRepository.GetById(questionID);
            questionRepository.Delete(question);
            SaveQuestion();
        }
        public void SaveQuestion()
        {
            unitOfWork.Commit();
        }

        #endregion
    }
}
