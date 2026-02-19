using Microsoft.EntityFrameworkCore;
using Data.Models;

namespace Data
{
    public class CerDumpMgtContext:DbContext
    {       
        public CerDumpMgtContext(DbContextOptions<CerDumpMgtContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<CertificationTopic> CertificationTopics { get; set; }
        public DbSet<CertificationQuestion> CertificationQuestions { get; set; }
        public DbSet<QuestionOption> QuestionOptions { get; set; }
        public DbSet<UserQuestionAnswer> UserQuestionAnswers { get; set; }
        public DbSet<QuestionCorrectOptionMapping> QuestionCorrectOptionMappings { get; set; }
        public DbSet<UserTopicMapping> UserTopicMappings { get; set; }
        public DbSet<CertificationScheme> CertificationSchemes { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RoleMenu> RoleMenus { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public virtual void Commit()
        {
            base.SaveChanges();
        }
        public virtual async Task CommitAsync()
        {
            await base.SaveChangesAsync();
        }
    }
}
