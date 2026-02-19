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
        public async Task<List<CertificationTopic>> GetCertificationTopics()
        {           
            var topics = await _topicService.GetTopicsAsync();
            var topicList = topics.OrderBy(t => t.ID).ToList();          
            return topicList;
        }
        [HttpGet]
        [Route("GetActiveNonFreeCertificationTopics")]
        public async Task<List<CertificationTopic>> GetActiveNonFreeCertificationTopics()
        {
            var topics = await _topicService.GetTopicsAsync();
            var topicList = topics.Where(t => t.IsActive == 1 && t.IsPublicTopic != 1).OrderBy(t => t.ID).ToList();
            return topicList;
        }
        [HttpGet]
        [Route("GetActiveCertificationTopicsByUserID")]
        public async Task<List<CertificationTopic>> GetActiveCertificationTopicsByUserID()
        {
            var userTopicAll = new List<CertificationTopic>();
            var allTopics = await _topicService.GetTopicsAsync();
            var topicList = allTopics.Where(a => a.IsActive == 1).OrderBy(t => t.ID).ToList();

            if (loginId == "" || loginId == "undefined")
            {
                userTopicAll = allTopics.Where(a => a.IsActive == 1 && a.IsPublicTopic == 1).OrderBy(t => t.ID).ToList();
            }
            else
            {
                topicList = allTopics.Where(a => a.IsActive == 1 && a.IsPublicTopic != 1).OrderBy(t => t.ID).ToList();
                var userTopics = await _userTopicService.GetUserTopicsAsync();
                var userTopicList = userTopics.Where(u => u.UserID == loginId).ToList();
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
        public async Task<CertificationTopic> GetCertificationTopic(int id)
        {            
            var topic = await _topicService.GetCertificationTopicAsync(id);
            return topic;
        }

        [HttpPost]
        [Route("AddCertificationTopic")]
        public async Task<IActionResult> AddCertificationTopic([FromForm] CertificationTopicViewModel objCertificationTopicViewModel)
        {
            try
            {
                var certificationTopic = new CertificationTopic();
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled)) //transaction should be placed upon using context always
                {
                    if (objCertificationTopicViewModel.file != null)
                    {
                        var topics = await GetCertificationTopics();
                        int maxTID = topics.Max(q => q.ID);
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
                    await _topicService.CreateCertificationTopicAsync(certificationTopic);
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
        public async Task<int> UpdateCertificationTopic(int id, [FromForm] CertificationTopicViewModel objCertificationTopicViewModel)
        {
            try
            {
                var topicInfo = await _topicService.GetCertificationTopicAsync(id);              
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
                await _topicService.UpdateCertificationTopicAsync(topicInfo);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteCertificationTopic/{id}")]
        public async Task<int> DeleteCertificationTopic(int id)
        {
            try
            {
                var topicInfo = await _topicService.GetCertificationTopicAsync(id);
                if (System.IO.File.Exists(topicInfo.TopicImgPath))
                {
                    System.IO.File.Delete(topicInfo.TopicImgPath);
                }
                await _topicService.DeleteCertificationTopicReferencesAsync(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;

        }
    }
}
