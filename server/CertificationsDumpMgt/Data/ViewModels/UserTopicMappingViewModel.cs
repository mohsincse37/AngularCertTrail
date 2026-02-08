using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.ViewModels
{
    public class UserTopicMappingViewModel
    {
        public int TopicID { get; set; }
        public int AccessDuration { get; set; }
        public int Amount { get; set; }
        public string? UserID { get; set; }
        public string? TopicTitle { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
      

    }
}
