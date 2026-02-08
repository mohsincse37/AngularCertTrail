using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.ViewModels
{
    public class QuestionCorrectOptionMappingViewModel
    {
        public int ID { get; set; }
        public int QuestionID { get; set; }
        public string? CorrectOptionID { get; set; }
        public string? AnsDescription { get; set; }        
    }
}
