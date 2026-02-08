using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IMenuService
    {
        IEnumerable<Menu> GetMenus();
       
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

        public IEnumerable<Menu> GetMenus()
        {
            return menuRepository.GetAll();

        }
        
        #endregion
    }
}
