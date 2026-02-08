using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IRoleMenuService
    {
        IEnumerable<RoleMenu> GetRoleMenus();
       
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

        public IEnumerable<RoleMenu> GetRoleMenus()
        {
            return roleMenuRepository.GetAll();

        }
        
        #endregion
    }
}
