using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class UserTopicMapping
    {
        public int ID { get; set; }

        [MaxLength(50)]
        public string? UserID { get; set; }
        public int TopicID { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Amount { get; set; }
        public DateTime EntryDate { get; set; }

    }
}
