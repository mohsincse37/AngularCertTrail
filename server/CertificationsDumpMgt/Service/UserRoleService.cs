using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IUserRoleService
    {
        Task<IEnumerable<UserRole>> GetUserRolesAsync();
        Task CreateUserRoleAsync(UserRole userRole);
        Task DeleteUserRoleAsync(int userRoleID);
        Task SaveUserRoleAsync();

    }
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository userRoleRepository;
        private readonly IUnitOfWork unitOfWork;

        public UserRoleService(IUserRoleRepository userRoleRepository, IUnitOfWork unitOfWork)
        {
            this.userRoleRepository = userRoleRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public async Task<IEnumerable<UserRole>> GetUserRolesAsync()
        {
            return await userRoleRepository.GetAllAsync();

        }
        public async Task CreateUserRoleAsync(UserRole userRole)
        {
            userRoleRepository.Add(userRole);
            await SaveUserRoleAsync();
        }
        public async Task DeleteUserRoleAsync(int userRoleID)
        {
            UserRole userRole = await userRoleRepository.GetByIdAsync(userRoleID);
            userRoleRepository.Delete(userRole);
            await SaveUserRoleAsync();
        }
        public async Task SaveUserRoleAsync()
        {
            await unitOfWork.CommitAsync();
        }
        #endregion
    }
}
