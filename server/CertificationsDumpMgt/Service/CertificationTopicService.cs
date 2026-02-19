using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface ICertificationTopicService
    {
        Task<IEnumerable<CertificationTopic>> GetTopicsAsync();
        Task<CertificationTopic> GetCertificationTopicAsync(int topicID);
        Task CreateCertificationTopicAsync(CertificationTopic certificationTopic);
        Task UpdateCertificationTopicAsync(CertificationTopic certificationTopic);
        Task DeleteCertificationTopicReferencesAsync(int topicID);
        Task SaveCertificationTopicAsync();
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

        public async Task<IEnumerable<CertificationTopic>> GetTopicsAsync()
        {
            return await certificationTopicRepository.GetAllAsync();

        }
        public async Task<CertificationTopic> GetCertificationTopicAsync(int topicID)
        {
            return await certificationTopicRepository.GetByIdAsync(topicID);

        }
        public async Task CreateCertificationTopicAsync(CertificationTopic certificationTopic)
        {
            certificationTopicRepository.Add(certificationTopic);
            await SaveCertificationTopicAsync();
        }
        public async Task UpdateCertificationTopicAsync(CertificationTopic certificationTopic)
        {
            certificationTopicRepository.Update(certificationTopic);
            await SaveCertificationTopicAsync();
        }
        public async Task DeleteCertificationTopicReferencesAsync(int topicID)
        {
            CertificationTopic topic = await certificationTopicRepository.GetByIdAsync(topicID);
            certificationTopicRepository.Delete(topic);
            await SaveCertificationTopicAsync();
        }
        public async Task SaveCertificationTopicAsync()
        {
            await unitOfWork.CommitAsync();
        }
        #endregion
    }
}
