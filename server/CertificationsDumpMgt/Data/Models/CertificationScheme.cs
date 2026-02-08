using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class CertificationScheme
    {
        public int ID { get; set; }
        public int TopicID { get; set; }       
        public int AccessType { get; set; }
        public int AccessDuration { get; set; }       
        public int DurationUnit { get; set; }
        public int Amount { get; set; }

        [MaxLength(30)]
        public string? AmountUnit { get; set; }
    }
}
