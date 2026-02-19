using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUserAsync(int userID);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserReferencesAsync(int userID);
        Task SaveUserAsync();
    }
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        private readonly IUnitOfWork unitOfWork;

        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            this.userRepository = userRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await userRepository.GetAllAsync();

        }
        public async Task<User> GetUserAsync(int userID)
        {
            return await userRepository.GetByIdAsync(userID);

        }
        public async Task CreateUserAsync(User user)
        {
            userRepository.Add(user);
            await SaveUserAsync();
        }
        public async Task UpdateUserAsync(User user)
        {
            userRepository.Update(user);
            await SaveUserAsync();
        }
        public async Task DeleteUserReferencesAsync(int userID)
        {
            User user = await userRepository.GetByIdAsync(userID);
            userRepository.Delete(user);
            await SaveUserAsync();
        }
        public async Task SaveUserAsync()
        {
            await unitOfWork.CommitAsync();
        }
        #endregion
    }
}
