using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IUserRoleService
    {
        IEnumerable<UserRole> GetUserRoles();
        void CreateUserRole(UserRole userRole);
        void DeleteUserRole(int userRoleID);
        void SaveUserRole();

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

        public IEnumerable<UserRole> GetUserRoles()
        {
            return userRoleRepository.GetAll();

        }
        public void CreateUserRole(UserRole userRole)
        {
            userRoleRepository.Add(userRole);
            SaveUserRole();
        }
        public void DeleteUserRole(int userRoleID)
        {
            UserRole userRole = userRoleRepository.GetById(userRoleID);
            userRoleRepository.Delete(userRole);
            SaveUserRole();
        }
        public void SaveUserRole()
        {
            unitOfWork.Commit();
        }
        #endregion
    }
}
