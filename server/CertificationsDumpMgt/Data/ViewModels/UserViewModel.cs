using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.ViewModels
{
    public class UserViewModel
    {
        public int ID { get; set; }      
        public string? UserName { get; set; }       
        public required string UserPass { get; set; }
        public int? Age { get; set; }
        public int? MobileNo { get; set; }       
        public string? Email { get; set; }        
        public string? Address { get; set; }
        public int? PaymentCompleted { get; set; }
        public string? LoginMsg { get; set; }
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? ConfirmPassword { get; set; }
    }
}
