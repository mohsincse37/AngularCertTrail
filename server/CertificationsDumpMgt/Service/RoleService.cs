using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetRolesAsync();
       
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

        public async Task<IEnumerable<Role>> GetRolesAsync()
        {
            return await roleRepository.GetAllAsync();

        }
        
        #endregion
    }
}
