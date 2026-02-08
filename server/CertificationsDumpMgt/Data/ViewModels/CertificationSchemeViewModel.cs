using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.ViewModels
{
    public class CertificationSchemeViewModel
    {
        public int ID { get; set; }
        public int TopicID { get; set; }
        public string? TopicTitle { get; set; }
        public string? TopicDetail{ get; set; }
        public string? TopicImgPath { get; set; }
        public int AccessType { get; set; }
        public string? AccessTypeText { get; set; }
        public int AccessDuration { get; set; }        
        public int DurationUnit { get; set; }
        public string? DurationUnitText { get; set; }
        public int Amount { get; set; }       
        public string? AmountUnit { get; set; }
        public string? AmounText { get; set; }
    }
}
