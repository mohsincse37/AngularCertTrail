using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IMenuService
    {
        Task<IEnumerable<Menu>> GetMenusAsync();
       
    }
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository menuRepository;
        private readonly IUnitOfWork unitOfWork;

        public MenuService(IMenuRepository menuRepository, IUnitOfWork unitOfWork)
        {
            this.menuRepository = menuRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public async Task<IEnumerable<Menu>> GetMenusAsync()
        {
            return await menuRepository.GetAllAsync();

        }
        
        #endregion
    }
}
