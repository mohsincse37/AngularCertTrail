using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IUserTopicMappingService
    {
        Task<IEnumerable<UserTopicMapping>> GetUserTopicsAsync();
        Task CreateUserTopicMappingAsync(UserTopicMapping userTopicMapping);       
        Task SaveUserTopicMappingAsync();

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

        public async Task<IEnumerable<UserTopicMapping>> GetUserTopicsAsync()
        {
            return await userTopicMappingRepository.GetAllAsync();

        }
        public async Task CreateUserTopicMappingAsync(UserTopicMapping userTopicMapping)
        {
            userTopicMappingRepository.Add(userTopicMapping);
            await SaveUserTopicMappingAsync();
        }
      
        public async Task SaveUserTopicMappingAsync()
        {
            await unitOfWork.CommitAsync();
        }
        #endregion
    }
}
