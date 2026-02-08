using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Models;
using Service;
using Data.ViewModels;
using System.Formats.Tar;
using System.Text.RegularExpressions;
using System.IO;
using System.Transactions;

namespace CertificationsDumpMgt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificationTopicController : ControllerBase
    {   string loginId = SessionHelper.getString("loginID");
        private readonly ICertificationTopicService _topicService;
        private readonly IUserTopicMappingService _userTopicService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CertificationTopicController(ICertificationTopicService _topicService , IUserTopicMappingService _userTopicService, IWebHostEnvironment webHostEnvironment)
        {            
            this._topicService = _topicService;
            this._userTopicService = _userTopicService;
            this._webHostEnvironment = webHostEnvironment;
        }      
        [HttpGet]
        [Route("GetCertificationTopics")]
        public List<CertificationTopic> GetCertificationTopics()
        {           
            var topicList = _topicService.GetTopics().OrderBy(t => t.ID).ToList();          
            return topicList;
        }
        [HttpGet]
        [Route("GetActiveNonFreeCertificationTopics")]
        public List<CertificationTopic> GetActiveNonFreeCertificationTopics()
        {
            var topicList = _topicService.GetTopics().Where(t => t.IsActive == 1 && t.IsPublicTopic != 1).OrderBy(t => t.ID).ToList();
            return topicList;
        }
        [HttpGet]
        [Route("GetActiveCertificationTopicsByUserID")]
        public List<CertificationTopic> GetActiveCertificationTopicsByUserID()
        {
            var userTopicAll = new List<CertificationTopic>();
            var topicList = _topicService.GetTopics().Where(a => a.IsActive == 1).OrderBy(t => t.ID).ToList();

            if (loginId == "" || loginId == "undefined")
            {
                userTopicAll = _topicService.GetTopics().Where(a => a.IsActive == 1 && a.IsPublicTopic == 1).OrderBy(t => t.ID).ToList();
            }
            else
            {
                topicList = _topicService.GetTopics().Where(a => a.IsActive == 1 && a.IsPublicTopic != 1).OrderBy(t => t.ID).ToList();
                var userTopicList = _userTopicService.GetUserTopics().Where(u => u.UserID == loginId).ToList();
                userTopicAll = (from t in topicList
                                join ut in userTopicList on t.ID equals ut.TopicID
                                where ut.FromDate <= DateTime.Today && ut.ToDate >= DateTime.Today
                                select new CertificationTopic()
                                {
                                    ID = t.ID,
                                    TopicTitle = t.TopicTitle,
                                    Detail = t.Detail,
                                    IsActive = t.IsActive,
                                    TopicImgPath = t.TopicImgPath,
                                    IsPublicTopic = t.IsPublicTopic

                                }).OrderBy(o => o.ID).ToList();
            }
            return userTopicAll;
        }
        [HttpGet]
        [Route("GetCertificationTopic/{id}")]
        public CertificationTopic GetCertificationTopic(int id)
        {            
            var topic = _topicService.GetCertificationTopic(id);
            return topic;
        }

        [HttpPost]
        [Route("AddCertificationTopic")]
        public async Task<IActionResult> AddCertificationTopic([FromForm] CertificationTopicViewModel objCertificationTopicViewModel)
        {
            try
            {
                var certificationTopic = new CertificationTopic();
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required)) //transaction should be placed upon using context always
                {
                    if (objCertificationTopicViewModel.file != null)
                    {
                        int maxTID = GetCertificationTopics().Max(q => q.ID);
                        maxTID = maxTID + 1;
                        var fName = maxTID.ToString();//Path.GetFileName(objCertificationTopicViewModel.file.FileName);
                        string extension = System.IO.Path.GetExtension(objCertificationTopicViewModel.file.FileName);
                        var path = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "Images/TopicImages", fName + extension);
                        // path = Path.Combine(@"D:\CerDumpsFiles\TopicFiles", fNameNoSC + extension); // for directory saving
                        using (Stream stream = new FileStream(path, FileMode.Create))
                        {
                            objCertificationTopicViewModel.file.CopyTo(stream);
                        }
                        certificationTopic.TopicImgPath = "/Images/TopicImages/" + fName + extension;
                    }

                    certificationTopic.TopicTitle = objCertificationTopicViewModel.TopicTitle;
                    certificationTopic.Detail = objCertificationTopicViewModel.Detail;
                    certificationTopic.IsActive = objCertificationTopicViewModel.IsActive;
                    certificationTopic.IsPublicTopic = objCertificationTopicViewModel.IsPublicTopic;
                    _topicService.CreateCertificationTopic(certificationTopic);
                    scope.Complete();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }    
       
        //private string RemoveSpecialChars(string input)
        //{
        //    return Regex.Replace(input, @"[^0-9a-zA-Z\._]", string.Empty);
        //}

        // public IFormFile file { get; set; }  //in the model class /view model
       

        [HttpPut]
        [Route("UpdateCertificationTopic/{id}")]
        public int UpdateCertificationTopic(int id, [FromForm] CertificationTopicViewModel objCertificationTopicViewModel)
        {
            try
            {
                var topicInfo = _topicService.GetCertificationTopic(id);              
                if (objCertificationTopicViewModel.file != null)
                {
                    if (System.IO.File.Exists(topicInfo.TopicImgPath))
                    {
                        System.IO.File.Delete(topicInfo.TopicImgPath);
                    }
                    var fName = id.ToString();
                    string extension = System.IO.Path.GetExtension(objCertificationTopicViewModel.file.FileName);
                    var path = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "Images/TopicImages", fName + extension);
                    using (Stream stream = new FileStream(path, FileMode.Create))
                    {
                        objCertificationTopicViewModel.file.CopyTo(stream);
                    }
                    topicInfo.TopicImgPath = "/Images/TopicImages/" + fName + extension; 
                }
                topicInfo.ID = objCertificationTopicViewModel.ID;
                topicInfo.TopicTitle = objCertificationTopicViewModel.TopicTitle;
                topicInfo.Detail = objCertificationTopicViewModel.Detail;
                topicInfo.IsActive = objCertificationTopicViewModel.IsActive;
                topicInfo.IsPublicTopic = objCertificationTopicViewModel.IsPublicTopic;
                _topicService.UpdateCertificationTopic(topicInfo);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteCertificationTopic/{id}")]
        public int DeleteCertificationTopic(int id)
        {
            try
            {
                var topicInfo = _topicService.GetCertificationTopic(id);
                if (System.IO.File.Exists(topicInfo.TopicImgPath))
                {
                    System.IO.File.Delete(topicInfo.TopicImgPath);
                }
                _topicService.DeleteCertificationTopicReferences(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;

        }
    }
}
