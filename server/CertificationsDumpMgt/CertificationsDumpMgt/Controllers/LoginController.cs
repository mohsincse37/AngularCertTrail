using Data;
using Data.Models;
using Data.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CertificationsDumpMgt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly CerDumpMgtContext _dumpontext;

        public LoginController(CerDumpMgtContext LoginContext)
        {
            _dumpontext = LoginContext;
        }
        [HttpPost]
        [Route("LoginUser")]
        public UserViewModel LoginUser(UserViewModel objUser)
        {
            var userInfo = new List<UserViewModel>();
            string msg = "isValidLogin";
            var user = new User() { UserPass = "12345" };
            user = _dumpontext.Users.FirstOrDefault(u => u.Email == objUser.Email && u.UserPass == objUser.UserPass);
            if (user == null)
            {
                msg = "Incorrect Email or Password";
            }
            else
            {
                objUser.UserName = user.UserName;
                objUser.Email = user.Email;
                objUser.MobileNo = user.MobileNo;
                objUser.Address = user.Address;
                SessionHelper.setString("loginID", user.Email);
            }
            //else
            //{
            //    user = _dumpontext.Users.FirstOrDefault(u => u.FromDate <= DateTime.Now && u.ToDate >= DateTime.Now);
            //    if (user == null)
            //    {
            //        msg = "Subscription period expired";
            //    }
            //}           

            objUser.LoginMsg = msg;
            return objUser;
        }
        [HttpPost]
        [Route("LogOutUser")]
        public int LogOutUser()
        {
            SessionHelper.setString("loginID", "");
            return 0;
        }
    }
}
