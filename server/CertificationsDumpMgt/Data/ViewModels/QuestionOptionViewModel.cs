using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.ViewModels
{
    public class QuestionOptionViewModel
    {
        public int ID { get; set; }       
        public string? OptionTitle { get; set; }
        public int? OrderNo { get; set; }
        public int QuestionID { get; set; }
        public int TopicID { get; set; }
        public string? QuestionTitle { get; set; }       
        public string? OptionImgPath { get; set; }
        public IFormFile? file { get; set; }
    }
}
