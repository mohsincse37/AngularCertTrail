using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Infrastructure
{
    public class DbFactory : Disposable, IDbFactory
    {
        CerDumpMgtContext dbContext;
        private readonly IConfiguration _configuration;
        public DbFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public CerDumpMgtContext Init()
        {
            var optionBuilder = new DbContextOptionsBuilder<CerDumpMgtContext>();
            optionBuilder.UseSqlServer(this._configuration.GetConnectionString("CRUDCS"));
            var context = new CerDumpMgtContext(optionBuilder.Options);
            return dbContext ?? (dbContext = new CerDumpMgtContext(optionBuilder.Options));
        }

        protected override void DisposeCore()
        {
            dbContext.Dispose();
        }
    }
}
