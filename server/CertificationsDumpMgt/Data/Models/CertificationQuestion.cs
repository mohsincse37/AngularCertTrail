using System.ComponentModel.DataAnnotations;
namespace Data.Models
{
    public class CertificationQuestion
    {
        public int ID { get; set; }
        public int? QuestionNo { get; set; }

        [MaxLength(500)]
        public string? QuestionTitle { get; set; }
        public int IsActive { get; set; }        
        public DateTime EntryDate { get; set; }
        public int TopicID { get; set; }       

        [MaxLength(150)]
        public string? QuestionImgPath { get; set; }
        public int? OptionType { get; set; }       
        public string? AnsDescription { get; set; }
    }
}
