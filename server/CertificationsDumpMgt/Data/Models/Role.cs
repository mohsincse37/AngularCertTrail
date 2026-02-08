using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class Role
    {
        public int ID { get; set; }

        [MaxLength(150)]
        public string? RoleName { get; set; }
    }
}
