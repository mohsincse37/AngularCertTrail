using Data.Infrastructure;
using Data.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repositories
{
    public class UserTopicMappingRepository : RepositoryBase<UserTopicMapping>, IUserTopicMappingRepository
    {
        public UserTopicMappingRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IUserTopicMappingRepository : IRepository<UserTopicMapping>
    {       
      
    }
}

