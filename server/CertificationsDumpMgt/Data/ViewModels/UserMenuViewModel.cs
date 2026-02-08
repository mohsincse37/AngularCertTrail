using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.ViewModels
{
    public class UserMenuViewModel
    {       
        public int MenuID { get; set; }
        public string? Title { get; set; }
        public string? PageName { get; set; }
        public int? ParentID { get; set; }
        public int? MenuOrder { get; set; }
        public List<UserMenuViewModel> Submenu { get; set; }       
    }
}
