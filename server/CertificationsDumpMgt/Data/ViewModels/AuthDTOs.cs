using System.ComponentModel.DataAnnotations;

namespace Data.ViewModels
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }

    public class AuthResult
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public string? Email { get; set; }
        public bool Success { get; set; }
        public List<string>? Errors { get; set; }
    }

    public class TokenRequest
    {
        [Required]
        public required string Token { get; set; }

        [Required]
        public required string RefreshToken { get; set; }
    }

    public class RegistrationRequest
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string UserName { get; set; }
    }
}
