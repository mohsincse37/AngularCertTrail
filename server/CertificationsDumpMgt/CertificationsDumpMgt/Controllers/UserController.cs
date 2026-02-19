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
        public async Task<List<User>> GetUsers()
        {
            var users = await _userService.GetUsersAsync();
            return users.ToList();
        }
        [HttpGet]
        [Route("GetUser/{id}")]
        public async Task<User> GetUser(int id)
        {          
            return await _userService.GetUserAsync(id);           
        }

        [HttpPost]
        [Route("AddUser")]
        public async Task<int> AddUser(User objUser)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled)) 
                {
                    var users = await _userService.GetUsersAsync();
                    var userOld = users.FirstOrDefault(u => u.Email == objUser.Email);
                    if (userOld != null) return 2;
                    userOld = users.FirstOrDefault(u => u.MobileNo == objUser.MobileNo);
                    if (userOld != null) return 3;

                    // Hash password before storing
                    objUser.UserPass = BCrypt.Net.BCrypt.HashPassword(objUser.UserPass);
                    await _userService.CreateUserAsync(objUser);

                    var userRole = new UserRole();
                    userRole.Role_ID = 2; // common role id
                    userRole.User_ID = objUser.ID;
                    await _userRoleService.CreateUserRoleAsync(userRole);
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
        public async Task<int> UpdateUser(int id, User objUser)
        {
            try
            {
                await _userService.UpdateUserAsync(objUser);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteUser/{id}")]
        public async Task<int> DeleteUser(int id)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled)) //transaction should be placed upon using context always
                {
                    var userRoles = await _userRoleService.GetUserRolesAsync();
                    var userRoleList = userRoles.Where(a => a.User_ID == id).ToList();
                    foreach (var item in userRoleList)
                    {
                        await _userRoleService.DeleteUserRoleAsync(item.ID);
                    }                   
                    await _userService.DeleteUserReferencesAsync(id);
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
        public async Task<List<UserMenuViewModel>> GetUserMenus()
        {
            string loginId = SessionHelper.getString("loginID");
            
            // Fallback to JWT identity if session is empty
            if (string.IsNullOrEmpty(loginId) || loginId == "undefined")
            {
                // 1. Try middleware identity
                loginId = User.Identity?.Name 
                          ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                          ?? User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                          ?? User.FindFirst("email")?.Value
                          ?? "";

                // 2. Failsafe: Manual JWT decoding if middleware failed but header is present
                if (string.IsNullOrEmpty(loginId))
                {
                    var authHeader = Request.Headers["Authorization"].ToString();
                    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                    {
                        try
                        {
                            var token = authHeader.Substring(7);
                            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                            if (handler.CanReadToken(token))
                            {
                                var jwtToken = handler.ReadJwtToken(token);
                                loginId = jwtToken.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email)?.Value 
                                          ?? jwtToken.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
                                          ?? jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value
                                          ?? "";
                            }
                        }
                        catch { /* Silently fail and keep loginId as empty */ }
                    }
                }
            }

            List<UserMenuViewModel> mainResult = new();
            List<UserMenuViewModel> subList = new();
            List<UserMenuViewModel> menuList = new();
            List<UserMenuViewModel> allList = new();
            if (!string.IsNullOrEmpty(loginId) && loginId != "undefined")
            {
                var userMenulist = new List<UserMenuViewModel>();
                var users = await _userService.GetUsersAsync();
                var user = users.Where(u => u.Email == loginId).FirstOrDefault();
                var menu = (await _menuService.GetMenusAsync()).ToList();
                var role = (await _roleService.GetRolesAsync()).ToList();
                var roleMenu = (await _roleMenuService.GetRoleMenusAsync()).ToList();
                var userRoles = await _userRoleService.GetUserRolesAsync();
                var userRole = userRoles.Where(ur => ur.User_ID == user.ID).ToList();

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
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled))
                {
                    string loginId = SessionHelper.getString("loginID");
                    var users = await _userService.GetUsersAsync();
                    var user = users.Where(u => u.Email == loginId).FirstOrDefault();
                    user.HasPayment = 1;
                    await _userService.UpdateUserAsync(user);

                    var userTopics = await _userTopicMappingService.GetUserTopicsAsync();
                    foreach (var item in arrayList)
                    {
                        var userTopicMappingOld = userTopics.Where(a => a.UserID == loginId && a.TopicID == item.TopicID && a.ToDate >= DateTime.Today).FirstOrDefault();
                        if (userTopicMappingOld == null)
                        {
                            var userTopicMapping = new UserTopicMapping();
                            userTopicMapping.TopicID = item.TopicID;
                            userTopicMapping.UserID = loginId;
                            userTopicMapping.FromDate = DateTime.Today;
                            userTopicMapping.ToDate = DateTime.Today.AddMonths(item.AccessDuration);
                            userTopicMapping.Amount = item.Amount;
                            userTopicMapping.EntryDate = DateTime.Now;
                            await _userTopicMappingService.CreateUserTopicMappingAsync(userTopicMapping);
                        }
                    }
                    for (global::System.Int32 i = 0; i < 2; i++)
                    {
                        await SendMail(user.Email,user.UserName,i);
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
        public async Task<int> ChangePassword(int id, UserViewModel userInfo)
        {
            try
            {
                var users = await _userService.GetUsersAsync();
                var oldUser = users.SingleOrDefault(q => q.Email == userInfo.Email);
                // Verify old password against stored hash
                if (!BCrypt.Net.BCrypt.Verify(userInfo.OldPassword, oldUser.UserPass)) return 1;

                // Hash new password before storing
                oldUser.UserPass = BCrypt.Net.BCrypt.HashPassword(userInfo.ConfirmPassword);
                await _userService.UpdateUserAsync(oldUser);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }
        [HttpGet]
        [Route("GetUserWiseSubscriptionList/{topicID}")]
        public async Task<List<UserTopicMappingViewModel>> GetUserWiseSubscriptionList(int topicID)
        {
            var userWiseTopicList = new List<UserTopicMappingViewModel>();
            var topics = await _topicService.GetTopicsAsync();
            var topicList = topics.Where(t => t.ID == topicID).ToList();
            var userTopics = await _userTopicMappingService.GetUserTopicsAsync();
            var userTopicList = userTopics.Where(ut => ut.TopicID == topicID).ToList();

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
