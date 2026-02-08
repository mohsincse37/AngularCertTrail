using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface ICertificationTopicService
    {
        IEnumerable<CertificationTopic> GetTopics();
        CertificationTopic GetCertificationTopic(int topicID);
        void CreateCertificationTopic(CertificationTopic certificationTopic);
        void UpdateCertificationTopic(CertificationTopic certificationTopic);
        void DeleteCertificationTopicReferences(int topicID);
        void SaveCertificationTopic();
    }
    public class CertificationTopicService : ICertificationTopicService
    {
        private readonly ICertificationTopicRepository certificationTopicRepository;
        private readonly IUnitOfWork unitOfWork;

        public CertificationTopicService(ICertificationTopicRepository certificationTopicRepository, IUnitOfWork unitOfWork)
        {
            this.certificationTopicRepository = certificationTopicRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public IEnumerable<CertificationTopic> GetTopics()
        {
            return certificationTopicRepository.GetAll();

        }
        public CertificationTopic GetCertificationTopic(int topicID)
        {
            return certificationTopicRepository.GetById(topicID);

        }
        public void CreateCertificationTopic(CertificationTopic certificationTopic)
        {
            certificationTopicRepository.Add(certificationTopic);
            SaveCertificationTopic();
        }
        public void UpdateCertificationTopic(CertificationTopic certificationTopic)
        {
            certificationTopicRepository.Update(certificationTopic);
            SaveCertificationTopic();
        }
        public void DeleteCertificationTopicReferences(int topicID)
        {
            CertificationTopic question = certificationTopicRepository.GetById(topicID);
            certificationTopicRepository.Delete(question);
            SaveCertificationTopic();
        }
        public void SaveCertificationTopic()
        {
            unitOfWork.Commit();
        }
        #endregion
    }
}
