using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class UserRole
    {
        public int ID { get; set; }
        public int? User_ID { get; set; }
        public int? Role_ID { get; set; }
       
    }
}
