using System.ComponentModel.DataAnnotations;

namespace Data.Models
{
    public class User
    {
        public int ID { get; set; }

        [MaxLength(150)]
        public string? UserName { get; set; }

        [MaxLength(200)]       
        public required string UserPass { get; set; }

        public int? Age { get; set; }
       
        public int? MobileNo { get; set; }

        [MaxLength(50)]
        public string? Email { get; set; }

        [MaxLength(300)]
        public string? Address { get; set; }
        public int? HasPayment { get; set; }
    }
}
