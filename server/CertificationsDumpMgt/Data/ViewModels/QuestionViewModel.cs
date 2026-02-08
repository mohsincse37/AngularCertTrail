using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Data.ViewModels
{
    public class QuestionViewModel
    {
        public int ID { get; set; }
        public int? QuestionNo { get; set; }
        public string? QuestionTitle { get; set; }
        public int IsActive { get; set; }
        public DateTime EntryDate { get; set; }
        public int TopicID { get; set; }
        public string? TopicTitle { get; set; }
        public string? CorrectOptionTitle { get; set; }            
        public string? QuestionImgPath { get; set; }
        public int? OptionType { get; set; }
        public string? OptionTypeText { get; set; }
        public string? CorrectOptionID { get; set; }
        public string? AnsDescription { get; set; }
        public IFormFile? file { get; set; }
    }
}
