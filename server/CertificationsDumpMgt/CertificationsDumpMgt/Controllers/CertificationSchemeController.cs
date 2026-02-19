using Data.Models;
using Data.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service;

namespace CertificationsDumpMgt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificationSchemeController : ControllerBase
    {
        private readonly ICertificationSchemeService _certificationSchemeService;
        private readonly ICertificationTopicService _topicService;
        public CertificationSchemeController(ICertificationSchemeService _certificationSchemeService, ICertificationTopicService _topicService)
        {
            this._certificationSchemeService = _certificationSchemeService;
            this._topicService = _topicService;
        }
        [HttpGet]
        [Route("GetCertificationSchemes")]
        public async Task<List<CertificationSchemeViewModel>> GetCertificationSchemes()
        {
            var cerSchemeAll = new List<CertificationSchemeViewModel>();
            var cerSchemeList = (await _certificationSchemeService.GetCertificationSchemesAsync()).ToList();
            var topicList = (await _topicService.GetTopicsAsync()).ToList();
            cerSchemeAll = (from s in cerSchemeList
                            join t in topicList on s.TopicID equals t.ID

                            select new CertificationSchemeViewModel()
                            {
                                ID = s.ID,
                                TopicID = s.TopicID,
                                TopicTitle = t.TopicTitle,
                                AccessType = s.AccessType,
                                AccessTypeText = (s.AccessType == 1 ? "Online practice + Download pdf" : "Online practice"),
                                AccessDuration = s.AccessDuration,
                                DurationUnitText = (s.DurationUnit == 1 ? "Months" : "Years"),
                                Amount = s.Amount,
                                AmountUnit = s.AmountUnit

                            }).OrderBy(t => t.TopicTitle).ThenBy(n => n.AccessType).ToList();
            return cerSchemeAll;
        }
        [HttpGet]
        [Route("GetCertificationTopicsWithSchemes/{accessType}/{accessDuration}")]
        public async Task<List<CertificationSchemeViewModel>> GetCertificationTopicsWithSchemes(int accessType, int accessDuration)
        {
            var cerSchemeAll = new List<CertificationSchemeViewModel>();
            var cerSchemeList = (await _certificationSchemeService.GetCertificationSchemesAsync()).ToList();
            var topicList = (await _topicService.GetTopicsAsync()).ToList();
            cerSchemeAll = (from s in cerSchemeList
                            join t in topicList on s.TopicID equals t.ID
                            where s.AccessType == accessType && s.AccessDuration == accessDuration

                            select new CertificationSchemeViewModel()
                            {
                                ID = s.ID,
                                TopicID = t.ID,
                                TopicTitle = t.TopicTitle,
                                TopicDetail = t.Detail,
                                TopicImgPath = t.TopicImgPath,
                                AccessType = s.AccessType,
                                AccessTypeText = (s.AccessType == 1 ? "Online practice + Download pdf" : "Online practice"),
                                AccessDuration = s.AccessDuration,
                                DurationUnitText = (s.DurationUnit == 1 ? "Months" : "Years"),
                                Amount = s.Amount,
                                AmountUnit = s.AmountUnit

                            }).OrderBy(t => t.TopicTitle).ThenBy(n => n.AccessType).ToList();
            return cerSchemeAll;
        }
        [HttpGet]
        [Route("GetChosenScheme/{topicID}/{accessType}/{accDuration}")]
        public async Task<List<CertificationSchemeViewModel>> GetChosenScheme(int topicID, int accessType, int accDuration)
        {
            var cerSchemeAll = new List<CertificationSchemeViewModel>();
            var cerSchemeList = (await _certificationSchemeService.GetCertificationSchemesAsync()).ToList();
            var topicList = (await _topicService.GetTopicsAsync()).ToList();
            var cerSchemeChosen = (from s in cerSchemeList
                            join t in topicList on s.TopicID equals t.ID
                            where s.TopicID == topicID && s.AccessType == accessType && s.AccessDuration == accDuration

                            select new CertificationSchemeViewModel()
                            {
                                ID = s.ID,
                                TopicID = s.TopicID,
                                TopicTitle = t.TopicTitle,
                                TopicDetail = t.Detail,
                                TopicImgPath = t.TopicImgPath,
                                AccessType = s.AccessType,
                                AccessTypeText = (s.AccessType == 1 ? "Online practice + Download pdf" : "Online practice"),
                                AccessDuration = s.AccessDuration,
                                DurationUnitText = (s.DurationUnit == 1 ? "Months" : "Years"),
                                Amount = s.Amount,
                                AmountUnit = s.AmountUnit
                            }).ToList();

           var cerSchemeInitial = (from s in cerSchemeList
                            join t in topicList on s.TopicID equals t.ID
                            where s.TopicID != topicID && s.AccessType == 1 && s.AccessDuration == 3

                            select new CertificationSchemeViewModel()
                            {
                                ID = s.ID,
                                TopicID = s.TopicID,
                                TopicTitle = t.TopicTitle,
                                TopicDetail = t.Detail,
                                TopicImgPath = t.TopicImgPath,
                                AccessType = s.AccessType,
                                AccessTypeText = (s.AccessType == 1 ? "Online practice + Download pdf" : "Online practice"),
                                AccessDuration = s.AccessDuration,
                                DurationUnitText = (s.DurationUnit == 1 ? "Months" : "Years"),
                                Amount = s.Amount,
                                AmountUnit = s.AmountUnit
                            }).ToList();

            cerSchemeAll= cerSchemeChosen.Concat(cerSchemeInitial).OrderBy(t => t.TopicTitle).ThenBy(n => n.AccessType).ToList();
            return cerSchemeAll;
        }
        [HttpGet]
        [Route("GetAccessTypes/{topicID}")]
        public async Task<List<CertificationSchemeViewModel>> GetAccessTypes(int topicID)
        {
            var cerSchemeAll = new List<CertificationSchemeViewModel>();
            var cerSchemeList = (await _certificationSchemeService.GetCertificationSchemesAsync()).ToList();
            var topicList = (await _topicService.GetTopicsAsync()).ToList();
            cerSchemeAll = (from s in cerSchemeList
                            join t in topicList on s.TopicID equals t.ID
                            where s.TopicID == topicID

                            select new CertificationSchemeViewModel()
                            {
                                ID = s.ID,
                                AccessType = s.AccessType,
                                AccessTypeText = (s.AccessType == 1 ? "Online practice + Download pdf" : "Online practice")

                            }).OrderBy(t => t.AccessType).DistinctBy(g => g.AccessType).ToList();
            return cerSchemeAll;
        }
        [HttpGet]
        [Route("GetDurationtypes/{topicID}")]
        public async Task<List<CertificationSchemeViewModel>> GetDurationtypes(int topicID)
        {
            var cerSchemeAll = new List<CertificationSchemeViewModel>();
            var cerSchemeList = (await _certificationSchemeService.GetCertificationSchemesAsync()).ToList();
            var topicList = (await _topicService.GetTopicsAsync()).ToList();
            cerSchemeAll = (from s in cerSchemeList
                            join t in topicList on s.TopicID equals t.ID
                            where s.TopicID == topicID

                            select new CertificationSchemeViewModel()
                            {
                                ID = s.ID,
                                AccessDuration = s.AccessDuration,
                                DurationUnitText = (s.DurationUnit == 1 ? "Months" : "Years")
                            }).OrderBy(t => t.AccessDuration).DistinctBy(g => g.AccessDuration).ToList();
            return cerSchemeAll;
        }
        [HttpGet]
        [Route("GetSchemeAmount/{topicID}/{accessType}/{durationType}")]
        public async Task<List<CertificationSchemeViewModel>> GetSchemeAmount(int topicID, int accessType, int durationType)
        {
            var cerSchemeAll = new List<CertificationSchemeViewModel>();
            var cerSchemeList = (await _certificationSchemeService.GetCertificationSchemesAsync()).ToList();
            var topicList = (await _topicService.GetTopicsAsync()).ToList();
            cerSchemeAll = (from s in cerSchemeList
                            join t in topicList on s.TopicID equals t.ID
                            where s.TopicID == topicID && s.AccessType == accessType && s.AccessDuration == durationType

                            select new CertificationSchemeViewModel()
                            {
                                Amount = s.Amount,
                                AmountUnit = s.AmountUnit,
                                AmounText = s.Amount + s.AmountUnit
                            }).ToList();
            return cerSchemeAll;
        }
        [HttpGet]
        [Route("GetCertificationScheme/{id}")]
        public async Task<CertificationScheme> GetCertificationScheme(int id)
        {
            return await _certificationSchemeService.GetCertificationSchemeAsync(id);
        }

        [HttpPost]
        [Route("AddCertificationScheme")]
        public async Task<int> AddCertificationScheme(CertificationScheme objCertificationScheme)
        {
            try
            {
                await _certificationSchemeService.AddCertificationSchemeAsync(objCertificationScheme);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpPut]
        [Route("UpdateCertificationScheme/{id}")]
        public async Task<int> UpdateCertificationScheme(int id, CertificationScheme objCertificationScheme)
        {
            try
            {
                await _certificationSchemeService.UpdateCertificationSchemeAsync(objCertificationScheme);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;
        }

        [HttpDelete]
        [Route("DeleteCertificationScheme/{id}")]
        public async Task<int> DeleteCertificationScheme(int id)
        {
            try
            {
                await _certificationSchemeService.DeleteCertificationSchemeAsync(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 0;

        }
    }
}
