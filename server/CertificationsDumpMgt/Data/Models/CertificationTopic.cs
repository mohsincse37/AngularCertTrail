using System.ComponentModel.DataAnnotations;
namespace Data.Models
{
    public class CertificationTopic
    {
        public int ID { get; set; }

        [MaxLength(150)]
        public string? TopicTitle { get; set; }

        [MaxLength(300)]
        public string? Detail { get; set; }        
        public int IsActive { get; set; }        
        public string? TopicImgPath { get; set; }
        public int? IsPublicTopic { get; set; }
    }
}
