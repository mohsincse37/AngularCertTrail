using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface ICertificationSchemeService
    {
        Task<IEnumerable<CertificationScheme>> GetCertificationSchemesAsync();
        Task<CertificationScheme> GetCertificationSchemeAsync(int schemeID);
        Task AddCertificationSchemeAsync(CertificationScheme certificationScheme);
        Task UpdateCertificationSchemeAsync(CertificationScheme certificationScheme);
        Task DeleteCertificationSchemeAsync(int schemeID);
        Task SaveCertificationSchemeAsync();
    }
    public class CertificationSchemeService : ICertificationSchemeService
    {
        private readonly ICertificationSchemeRepository certificationSchemeRepository;
        private readonly IUnitOfWork unitOfWork;

        public CertificationSchemeService(ICertificationSchemeRepository certificationSchemeRepository, IUnitOfWork unitOfWork)
        {
            this.certificationSchemeRepository = certificationSchemeRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public async Task<IEnumerable<CertificationScheme>> GetCertificationSchemesAsync()
        {
            return await certificationSchemeRepository.GetAllAsync();

        }
        public async Task<CertificationScheme> GetCertificationSchemeAsync(int schemeID)
        {
            return await certificationSchemeRepository.GetByIdAsync(schemeID);

        }
        public async Task AddCertificationSchemeAsync(CertificationScheme certificationScheme)
        {
            certificationSchemeRepository.Add(certificationScheme);
            await SaveCertificationSchemeAsync();
        }
        public async Task UpdateCertificationSchemeAsync(CertificationScheme certificationScheme)
        {
            certificationSchemeRepository.Update(certificationScheme);
            await SaveCertificationSchemeAsync();
        }
        public async Task DeleteCertificationSchemeAsync(int schemeID)
        {
            CertificationScheme scheme = await certificationSchemeRepository.GetByIdAsync(schemeID);
            certificationSchemeRepository.Delete(scheme);
            await SaveCertificationSchemeAsync();
        }
        public async Task SaveCertificationSchemeAsync()
        {
            await unitOfWork.CommitAsync();
        }
        #endregion
    }
}
