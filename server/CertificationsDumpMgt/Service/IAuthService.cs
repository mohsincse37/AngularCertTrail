using Data.Models;
using Data.ViewModels;

namespace Service
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginRequest loginRequest);
        Task<AuthResult> RegisterAsync(RegistrationRequest registrationRequest);
        Task<AuthResult> RefreshTokenAsync(TokenRequest tokenRequest);
    }
}
