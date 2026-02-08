using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IUserTopicMappingService
    {
        IEnumerable<UserTopicMapping> GetUserTopics();
        void CreateUserTopicMapping(UserTopicMapping userTopicMapping);       
        void SaveUserTopicMapping();

    }
    public class UserTopicMappingService : IUserTopicMappingService
    {
        private readonly IUserTopicMappingRepository userTopicMappingRepository;
        private readonly IUnitOfWork unitOfWork;

        public UserTopicMappingService(IUserTopicMappingRepository userTopicMappingRepository, IUnitOfWork unitOfWork)
        {
            this.userTopicMappingRepository = userTopicMappingRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public IEnumerable<UserTopicMapping> GetUserTopics()
        {
            return userTopicMappingRepository.GetAll();

        }
        public void CreateUserTopicMapping(UserTopicMapping userTopicMapping)
        {
            userTopicMappingRepository.Add(userTopicMapping);
            SaveUserTopicMapping();
        }
      
        public void SaveUserTopicMapping()
        {
            unitOfWork.Commit();
        }
        #endregion
    }
}
