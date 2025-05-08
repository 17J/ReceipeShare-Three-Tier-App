
using Microsoft.EntityFrameworkCore;
using Share4Recipe.Api.Data;
using Share4Recipe.Api.DTOs;
using Share4Recipe.Api.Models;

namespace Share4Recipe.Api.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly AppDbContext _context;
        private readonly IUserService _userService;

        public RecipeService(AppDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<RecipeDto> CreateRecipeAsync(CreateRecipeDto createRecipeDto, Guid userId)
        {
            // Check if user exists
            var user = await _userService.GetUserEntityByIdAsync(userId);

            var recipe = new Recipe
            {
                Id = Guid.NewGuid(),
                Title = createRecipeDto.Title,
                Description = createRecipeDto.Description,
                CookingTime = createRecipeDto.CookingTime,
                Servings = createRecipeDto.Servings,
                ImageUrl = createRecipeDto.ImageUrl,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Set ingredients and instructions using helper methods
            recipe.SetIngredientsList(createRecipeDto.Ingredients);
            recipe.SetInstructionsList(createRecipeDto.Instructions);

            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();

            return new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.GetIngredientsList(),
                Instructions = recipe.GetInstructionsList(),
                CookingTime = recipe.CookingTime,
                Servings = recipe.Servings,
                ImageUrl = recipe.ImageUrl,
                UserId = recipe.UserId,
                Username = user.Username,
                CreatedAt = recipe.CreatedAt,
                UpdatedAt = recipe.UpdatedAt
            };
        }

        public async Task<RecipeDto> UpdateRecipeAsync(Guid recipeId, UpdateRecipeDto updateRecipeDto, Guid userId)
        {
            var recipe = await _context.Recipes
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                throw new Exception("Recipe not found");
            }

            if (recipe.UserId != userId)
            {
                throw new Exception("You are not authorized to update this recipe");
            }

            // Update recipe properties if provided
            if (updateRecipeDto.Title != null)
            {
                recipe.Title = updateRecipeDto.Title;
            }

            if (updateRecipeDto.Description != null)
            {
                recipe.Description = updateRecipeDto.Description;
            }

            if (updateRecipeDto.CookingTime.HasValue)
            {
                recipe.CookingTime = updateRecipeDto.CookingTime;
            }

            if (updateRecipeDto.Servings.HasValue)
            {
                recipe.Servings = updateRecipeDto.Servings;
            }

            if (updateRecipeDto.ImageUrl != null)
            {
                recipe.ImageUrl = updateRecipeDto.ImageUrl;
            }

            if (updateRecipeDto.Ingredients != null)
            {
                recipe.SetIngredientsList(updateRecipeDto.Ingredients);
            }

            if (updateRecipeDto.Instructions != null)
            {
                recipe.SetInstructionsList(updateRecipeDto.Instructions);
            }

            recipe.UpdatedAt = DateTime.UtcNow;

            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();

            return new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.GetIngredientsList(),
                Instructions = recipe.GetInstructionsList(),
                CookingTime = recipe.CookingTime,
                Servings = recipe.Servings,
                ImageUrl = recipe.ImageUrl,
                UserId = recipe.UserId,
                Username = recipe.User?.Username ?? string.Empty,
                CreatedAt = recipe.CreatedAt,
                UpdatedAt = recipe.UpdatedAt
            };
        }

        public async Task<bool> DeleteRecipeAsync(Guid recipeId, Guid userId)
        {
            var recipe = await _context.Recipes.FindAsync(recipeId);

            if (recipe == null)
            {
                throw new Exception("Recipe not found");
            }

            if (recipe.UserId != userId)
            {
                throw new Exception("You are not authorized to delete this recipe");
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<RecipeDto> GetRecipeByIdAsync(Guid recipeId)
        {
            var recipe = await _context.Recipes
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                throw new Exception("Recipe not found");
            }

            return new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.GetIngredientsList(),
                Instructions = recipe.GetInstructionsList(),
                CookingTime = recipe.CookingTime,
                Servings = recipe.Servings,
                ImageUrl = recipe.ImageUrl,
                UserId = recipe.UserId,
                Username = recipe.User?.Username ?? string.Empty,
                CreatedAt = recipe.CreatedAt,
                UpdatedAt = recipe.UpdatedAt
            };
        }

        public async Task<List<RecipeDto>> GetAllRecipesAsync()
        {
            var recipes = await _context.Recipes
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return recipes.Select(recipe => new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.GetIngredientsList(),
                Instructions = recipe.GetInstructionsList(),
                CookingTime = recipe.CookingTime,
                Servings = recipe.Servings,
                ImageUrl = recipe.ImageUrl,
                UserId = recipe.UserId,
                Username = recipe.User?.Username ?? string.Empty,
                CreatedAt = recipe.CreatedAt,
                UpdatedAt = recipe.UpdatedAt
            }).ToList();
        }

        public async Task<List<RecipeDto>> GetUserRecipesAsync(Guid userId)
        {
            // Check if user exists
            await _userService.GetUserByIdAsync(userId);

            var recipes = await _context.Recipes
                .Include(r => r.User)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return recipes.Select(recipe => new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.GetIngredientsList(),
                Instructions = recipe.GetInstructionsList(),
                CookingTime = recipe.CookingTime,
                Servings = recipe.Servings,
                ImageUrl = recipe.ImageUrl,
                UserId = recipe.UserId,
                Username = recipe.User?.Username ?? string.Empty,
                CreatedAt = recipe.CreatedAt,
                UpdatedAt = recipe.UpdatedAt
            }).ToList();
        }
    }
}
