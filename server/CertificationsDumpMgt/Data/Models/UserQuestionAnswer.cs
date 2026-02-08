using System.ComponentModel.DataAnnotations;
namespace Data.Models
{
    public class UserQuestionAnswer
    {
        public int ID { get; set; }       
        public string? UserID { get; set; }
        public int? QuestionID { get; set; }
        public int? OptionID { get; set; }    
        
    }
}
