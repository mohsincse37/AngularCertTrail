using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class QuestionCorrectOptionMapping
    {
        public int ID { get; set; }
        public int QuestionID { get; set; }
        public int CorrectionOptionID { get; set; }
    }
}
