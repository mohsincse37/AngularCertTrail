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
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(IDbFactory dbFactory)
            : base(dbFactory) { }

       

        public void DeleteCategoryReference(int cataId)
        {
            var param = new SqlParameter("@cataId", cataId);
            this.DbContext.Database.ExecuteSqlRaw("exec spDeletecategoryRef @cataId", param);
        }
    }

    public interface IUserRepository : IRepository<User>
    {       
        void DeleteCategoryReference(int cataId);
    }
}

