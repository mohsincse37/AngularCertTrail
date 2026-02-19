using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IRoleMenuService
    {
        Task<IEnumerable<RoleMenu>> GetRoleMenusAsync();
       
    }
    public class RoleMenuService : IRoleMenuService
    {
        private readonly IRoleMenuRepository roleMenuRepository;
        private readonly IUnitOfWork unitOfWork;

        public RoleMenuService(IRoleMenuRepository roleMenuRepository, IUnitOfWork unitOfWork)
        {
            this.roleMenuRepository = roleMenuRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public async Task<IEnumerable<RoleMenu>> GetRoleMenusAsync()
        {
            return await roleMenuRepository.GetAllAsync();

        }
        
        #endregion
    }
}
