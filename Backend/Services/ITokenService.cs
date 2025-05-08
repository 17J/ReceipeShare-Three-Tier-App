
using Share4Recipe.Api.Models;

namespace Share4Recipe.Api.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
