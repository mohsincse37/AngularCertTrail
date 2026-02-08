using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;

namespace Data.ViewModels
{
    public class QuestionWithOption
    {
        public int QuestionID { get; set; }
        public int? QuestionNo { get; set; }
        public string? QuestionTitle { get; set; }        
        public string? CorrectOptionTitle { get; set; }
        public string? CorrectOptionID { get; set; }
        public string? AnsDescription { get; set; }
        public string? QuestionImgPath { get; set; }
        public int? OptionType { get; set; }
        public IList<QuestionOption> QOption { get; set; }

    }
}
