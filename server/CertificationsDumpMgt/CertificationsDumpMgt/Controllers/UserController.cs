using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Models;
using Service;
using Data.ViewModels;
using System.Transactions;

namespace CertificationsDumpMgt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMenuService _menuService;
        private readonly IRoleService _roleService;
        private readonly IRoleMenuService _roleMenuService;
        private readonly IUserRoleService _userRoleService;
        private readonly IEmailService _emailService;
        private readonly ICertificationTopicService _topicService;
        private readonly IUserTopicMappingService _userTopicMappingService;
        public UserController(IUserService _userService, IMenuService _menuService, IRoleService _roleService, IRoleMenuService _roleMenuService, IUserRoleService _userRoleService, ICertificationTopicService _topicService, IUserTopicMappingService _userTopicMappingService, IEmailService _emailService)
        {
            this._userService = _userService;
            this._menuService = _menuService;
            this._roleService = _roleService;
            this._roleMenuService = _roleMenuService;
            this._userRoleService = _userRoleService;
            this._topicService = _topicService;
            this._userTopicMappingService = _userTopicMappingService;
            this._emailService = _emailService;
        }
        [HttpGet]
        [Route("GetUsers")]
        public List<User> GetUsers()
        {
            var userAll = new List<User>();
            userAll = _userService.GetUsers().ToList();
            return userAll;
        }
        [HttpGet]
        [Route("GetUser/{id}")]
        public User GetUser(int id)
        {          
            return _userService.GetUser(id);           
        }

        [HttpPost]
        [Route("AddUser")]
        public int AddUser(User objUser)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required)) 
                {
                    var userOld = _userService.GetUsers().FirstOrDefault(u => u.Email == objUser.Email);
                    if (userOld != null) return 2;
                    userOld = _userService.GetUsers().FirstOrDefault(u => u.MobileNo == objUser.MobileNo);
                    if (userOld != null) return 3;
                    _userService.CreateUser(objUser);

                    var userRole = new UserRole();
                    userRole.Role_ID = 2; // common role id
                    userRole.User_ID = objUser.ID;
                    _userRoleService.CreateUserRole(userRole);
                    scope.Complete();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpPut]
        [Route("UpdateUser/{id}")]
        public int UpdateUser(int id, User objUser)
        {
            try
            {
                _userService.UpdateUser(objUser);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteUser/{id}")]
        public int DeleteUser(int id)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required)) //transaction should be placed upon using context always
                {
                    var userRoleList = _userRoleService.GetUserRoles().Where(a => a.User_ID == id).ToList();
                    foreach (var item in userRoleList)
                    {
                        _userRoleService.DeleteUserRole(item.ID);
                    }                   
                    _userService.DeleteUserReferences(id);
                    scope.Complete();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;

        }

        [HttpGet]
        [Route("GetUserMenus")]
        public List<UserMenuViewModel> GetUserMenus()
        {
            string loginId = SessionHelper.getString("loginID");
            List<UserMenuViewModel> mainResult = new();
            List<UserMenuViewModel> subList = new();
            List<UserMenuViewModel> menuList = new();
            List<UserMenuViewModel> allList = new();
            if (loginId != "" && loginId != "undefined")
            {
                var userMenulist = new List<UserMenuViewModel>();
                var user = _userService.GetUsers().Where(u => u.Email == loginId).FirstOrDefault();
                var menu = _menuService.GetMenus().ToList();
                var role = _roleService.GetRoles().ToList();
                var roleMenu = _roleMenuService.GetRoleMenus().ToList();
                var userRole = _userRoleService.GetUserRoles().Where(ur => ur.User_ID == user.ID).ToList();

                userMenulist = (from m in menu
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

                                }).OrderBy(o => o.MenuOrder).ToList();


                menuList = userMenulist.Where(a => a.ParentID == 0).ToList();
                foreach (var item in menuList)
                {
                    allList = userMenulist.ToList();
                    subList = menuList.Where(x => x.MenuID == item.MenuID).Select(x => new UserMenuViewModel()
                    {
                        MenuID = x.MenuID,
                        Title = x.Title,
                        PageName = x.PageName,
                        ParentID = x.ParentID,
                        MenuOrder = x.MenuOrder,
                        Submenu = GetAllMenus(ref allList, x.MenuID)

                    }
                    ).ToList();

                    mainResult.AddRange(subList);
                }
            }

            return mainResult;
        }
        public static List<UserMenuViewModel> GetAllMenus(ref List<UserMenuViewModel> menus, int parentID)
        {
            List<UserMenuViewModel> innerCategories = menus;
            return menus.Where(x => x.ParentID == parentID).Select(m => new UserMenuViewModel()
            {
                MenuID = m.MenuID,
                Title = m.Title,
                PageName = m.PageName,
                ParentID = m.ParentID,
                MenuOrder = m.MenuOrder,
                Submenu = innerCategories.Where(x => x.ParentID == m.MenuID).Count() > 0 ? GetAllMenus(ref innerCategories, m.MenuID) : null
            }).ToList();
        }
        [HttpPost]
        [Route("AddUserTopicMapping")]
        public async Task<IActionResult> AddUserTopicMapping(List<UserTopicMappingViewModel> arrayList)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required))
                {
                    string loginId = SessionHelper.getString("loginID");
                    var user = _userService.GetUsers().Where(u => u.Email == loginId).FirstOrDefault();
                    user.HasPayment = 1;
                    _userService.UpdateUser(user);

                    foreach (var item in arrayList)
                    {
                        var userTopicMappingOld = _userTopicMappingService.GetUserTopics().Where(a => a.UserID == loginId && a.TopicID == item.TopicID && a.ToDate >= DateTime.Today).FirstOrDefault();
                        if (userTopicMappingOld == null)
                        {
                            var userTopicMapping = new UserTopicMapping();
                            userTopicMapping.TopicID = item.TopicID;
                            userTopicMapping.UserID = loginId;
                            userTopicMapping.FromDate = DateTime.Today;
                            userTopicMapping.ToDate = DateTime.Today.AddMonths(item.AccessDuration);
                            userTopicMapping.Amount = item.Amount;
                            userTopicMapping.EntryDate = DateTime.Now;
                            _userTopicMappingService.CreateUserTopicMapping(userTopicMapping);
                        }
                    }
                    for (global::System.Int32 i = 0; i < 2; i++)
                    {
                         SendMail(user.Email,user.UserName,i);
                    }
                  
                    scope.Complete();
                }

            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok(arrayList);
        }
        private async Task<IActionResult> SendMail(string mail,string userName, int isForOwner)
        {
            try
            {
                Mailrequest mailrequest = new Mailrequest();
                if (isForOwner == 1) mailrequest.ToEmail = "sayed.mohammad.rahman@gmail.com";
                else mailrequest.ToEmail = mail;

                mailrequest.Body = GetHtmlcontent(userName,isForOwner);
                mailrequest.Subject = "Certification Dumps Subscription";
                await _emailService.SendEmailAsync(mailrequest);
                return Ok();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private string GetHtmlcontent(string userName, int isForOwner)
        {
            string Response = "<div style=\"width:100%;background-color:lightblue;text-align:center;margin:10px\">";
            if (isForOwner == 1)
            {
                Response += "<h1>Subscription Added</h1>";
                Response += "A user named " + userName + " has recently done subscription";
            }
            else
            {
                Response += "<h1>Welcome to Certification Dupms Practice Website</h1>";
                Response += "Your subscription has been done successfully. You can now login with your email & password and do pratice.";
                // Response += "<img src=\"https://yt3.googleusercontent.com/v5hyLB4am6E0GZ3y-JXVCxT9g8157eSeNggTZKkWRSfq_B12sCCiZmRhZ4JmRop-nMA18D2IPw=s176-c-k-c0x00ffffff-no-rj\" />";
                Response += "<h2>Thanks for subscription</h2>";
                // Response += "<a href=\"https://www.youtube.com/channel/UCsbmVmB_or8sVLLEq4XhE_A/join\">Please join membership by click the link</a>";
                Response += "<div><h1> Contact us : sayed.mohammad.rahman@gmail.com</h1></div>";
            }
            Response += "</div>";
            return Response;
        }

        [HttpPut]
        [Route("ChangePassword/{id}")]
        public int ChangePassword(int id, UserViewModel userInfo)
        {
            try
            {
                var oldUser = _userService.GetUsers().SingleOrDefault(q => q.Email == userInfo.Email);
                if (oldUser.UserPass != userInfo.OldPassword) return 1;

                oldUser.UserPass = userInfo.ConfirmPassword;
                _userService.UpdateUser(oldUser);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }
        [HttpGet]
        [Route("GetUserWiseSubscriptionList/{topicID}")]
        public List<UserTopicMappingViewModel> GetUserWiseSubscriptionList(int topicID)
        {
            var userWiseTopicList = new List<UserTopicMappingViewModel>();
            var topicList = _topicService.GetTopics().Where(t => t.ID == topicID).ToList();
            var userTopicList = _userTopicMappingService.GetUserTopics().Where(ut => ut.TopicID == topicID).ToList();

            userWiseTopicList = (from t in topicList
                                 join ut in userTopicList on t.ID equals ut.TopicID

                                 select new UserTopicMappingViewModel()
                                 {
                                     TopicID = t.ID,
                                     TopicTitle = t.TopicTitle,
                                     UserID = ut.UserID,
                                     FromDate = ut.FromDate.ToString("yyyy-MM-dd"),
                                     ToDate = ut.ToDate.ToString("yyyy-MM-dd"),
                                     Amount = ut.Amount

                                 }).OrderBy(o => o.UserID).ToList();

            return userWiseTopicList;
        }
    }
}
