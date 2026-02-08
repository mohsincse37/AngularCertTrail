using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class Menu
    {
        public int ID { get; set; }

        [MaxLength(150)]
        public string? MenuName { get; set; }

        [MaxLength(150)]
        public string? PageName { get; set; }
        public int? ParentID { get; set; }
        public int? MenuOrder { get; set; }

    }
}
