using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IRoleService
    {
        IEnumerable<Role> GetRoles();
       
    }
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository roleRepository;
        private readonly IUnitOfWork unitOfWork;

        public RoleService(IRoleRepository roleRepository, IUnitOfWork unitOfWork)
        {
            this.roleRepository = roleRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public IEnumerable<Role> GetRoles()
        {
            return roleRepository.GetAll();

        }
        
        #endregion
    }
}
