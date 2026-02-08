using System.ComponentModel.DataAnnotations;
namespace Data.Models
{
    public class QuestionOption
    {
        public int ID { get; set; }       

        [MaxLength(300)]
        public string? OptionTitle { get; set; }
        public int? OrderNo { get; set; }

        [MaxLength(150)]
        public string? OptionImgPath { get; set; }
        public int QuestionID { get; set; }
    }
}
