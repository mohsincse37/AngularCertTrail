using Data.Models;
using Data.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service;
using System.Transactions;

namespace CertificationsDumpMgt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PageAuthorizationController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMenuService _menuService;
        private readonly IRoleService _roleService;
        private readonly IRoleMenuService _roleMenuService;
        private readonly IUserRoleService _userRoleService;
        private readonly IUserTopicMappingService _userTopicMappingService;
        public PageAuthorizationController(IUserService _userService, IMenuService _menuService, IRoleService _roleService, IRoleMenuService _roleMenuService, IUserRoleService _userRoleService, IUserTopicMappingService _userTopicMappingService)
        {
            this._userService = _userService;
            this._menuService = _menuService;
            this._roleService = _roleService;
            this._roleMenuService = _roleMenuService;
            this._userRoleService = _userRoleService;
            this._userTopicMappingService = _userTopicMappingService;
        }
        [HttpPost]
        [Route("CheckingAuthority")]
        public async Task<AuthorityViewModel> CheckingAuthority(AuthorityViewModel objAuthor)
        {
            objAuthor.AuthorityMsg = "";          
            string loginId = SessionHelper.getString("loginID");
            if (loginId == "" || loginId == "undefined")
            {               
                return objAuthor;
            }

            var users = await _userService.GetUsersAsync();
            var user = users.Where(u => u.Email == loginId).FirstOrDefault();
            if (user == null)
            {
                return objAuthor;
            }

            var userRole = (await _userRoleService.GetUserRolesAsync()).Where(ur => ur.User_ID == user.ID).ToList();
            var menu = (await _menuService.GetMenusAsync()).Where(m => m.PageName == objAuthor.PageName).ToList();
            var role = (await _roleService.GetRolesAsync()).ToList();
            var roleMenu = (await _roleMenuService.GetRoleMenusAsync()).ToList();


            var userMenu = new UserMenuViewModel();
            userMenu = (from m in menu
                            join rm in roleMenu on m.ID equals rm.Menu_ID
                            join r in role on rm.Role_ID equals r.ID
                            join ur in userRole on rm.Role_ID equals ur.Role_ID

                            select new UserMenuViewModel()
                            {
                                MenuID = m.ID,
                                Title = m.MenuName,
                                PageName = m.PageName,
                                ParentID = m.ParentID,
                                MenuOrder = m.MenuOrder

                            }).FirstOrDefault();

            if(userMenu != null)
            {
                objAuthor.AuthorityMsg = "isValidAuthor";
            }          
            return objAuthor;
        }
    }
}
