
using Share4Recipe.Api.DTOs;

namespace Share4Recipe.Api.Services
{
    public interface IRecipeService
    {
        Task<RecipeDto> CreateRecipeAsync(CreateRecipeDto createRecipeDto, Guid userId);
        Task<RecipeDto> UpdateRecipeAsync(Guid recipeId, UpdateRecipeDto updateRecipeDto, Guid userId);
        Task<bool> DeleteRecipeAsync(Guid recipeId, Guid userId);
        Task<RecipeDto> GetRecipeByIdAsync(Guid recipeId);
        Task<List<RecipeDto>> GetAllRecipesAsync();
        Task<List<RecipeDto>> GetUserRecipesAsync(Guid userId);
    }
}
