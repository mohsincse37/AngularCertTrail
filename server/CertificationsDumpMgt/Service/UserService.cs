using Data.Infrastructure;
using Data.Models;
using Data.Repositories;

namespace Service
{
    public interface IUserService
    {
        IEnumerable<User> GetUsers();
        User GetUser(int userID);
        void CreateUser(User user);
        void UpdateUser(User user);
        void DeleteUserReferences(int userID);
        void SaveUser();
    }
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        private readonly IUnitOfWork unitOfWork;

        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            this.userRepository = userRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICategoryService Members

        public IEnumerable<User> GetUsers()
        {
            return userRepository.GetAll();

        }
        public User GetUser(int userID)
        {
            return userRepository.GetById(userID);

        }
        public void CreateUser(User user)
        {
            userRepository.Add(user);
            SaveUser();
        }
        public void UpdateUser(User user)
        {
            userRepository.Update(user);
            SaveUser();
        }
        public void DeleteUserReferences(int userID)
        {
            User user = userRepository.GetById(userID);
            userRepository.Delete(user);
            SaveUser();
        }
        public void SaveUser()
        {
            unitOfWork.Commit();
        }
        #endregion
    }
}
