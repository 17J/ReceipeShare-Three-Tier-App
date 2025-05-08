
using Share4Recipe.Api.DTOs;
using Share4Recipe.Api.Models;

namespace Share4Recipe.Api.Services
{
    public interface IUserService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto> GetUserByIdAsync(Guid userId);
        Task<bool> UserExistsAsync(Guid userId);
        Task<User> GetUserEntityByIdAsync(Guid userId);
    }
}
