using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface ICertificationSchemeService
    {
        IEnumerable<CertificationScheme> GetCertificationSchemes();
        CertificationScheme GetCertificationScheme(int schemeID);
        void AddCertificationScheme(CertificationScheme certificationScheme);
        void UpdateCertificationScheme(CertificationScheme certificationScheme);
        void DeleteCertificationScheme(int schemeID);
        void SaveCertificationScheme();
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

        public IEnumerable<CertificationScheme> GetCertificationSchemes()
        {
            return certificationSchemeRepository.GetAll();

        }
        public CertificationScheme GetCertificationScheme(int schemeID)
        {
            return certificationSchemeRepository.GetById(schemeID);

        }
        public void AddCertificationScheme(CertificationScheme certificationScheme)
        {
            certificationSchemeRepository.Add(certificationScheme);
            SaveCertificationScheme();
        }
        public void UpdateCertificationScheme(CertificationScheme certificationScheme)
        {
            certificationSchemeRepository.Update(certificationScheme);
            SaveCertificationScheme();
        }
        public void DeleteCertificationScheme(int schemeID)
        {
            CertificationScheme question = certificationSchemeRepository.GetById(schemeID);
            certificationSchemeRepository.Delete(question);
            SaveCertificationScheme();
        }
        public void SaveCertificationScheme()
        {
            unitOfWork.Commit();
        }
        #endregion
    }
}
