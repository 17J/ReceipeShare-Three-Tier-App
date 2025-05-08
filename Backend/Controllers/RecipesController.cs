
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Share4Recipe.Api.DTOs;
using Share4Recipe.Api.Services;
using System.Security.Claims;

namespace Share4Recipe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly IRecipeService _recipeService;

        public RecipesController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        [HttpGet]
        public async Task<ActionResult<List<RecipeDto>>> GetAllRecipes()
        {
            try
            {
                var recipes = await _recipeService.GetAllRecipesAsync();
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeDto>> GetRecipeById(Guid id)
        {
            try
            {
                var recipe = await _recipeService.GetRecipeByIdAsync(id);
                return Ok(recipe);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<List<RecipeDto>>> GetUserRecipes()
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty);
                var recipes = await _recipeService.GetUserRecipesAsync(userId);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<RecipeDto>> CreateRecipe(CreateRecipeDto createRecipeDto)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty);
                var recipe = await _recipeService.CreateRecipeAsync(createRecipeDto, userId);
                return CreatedAtAction(nameof(GetRecipeById), new { id = recipe.Id }, recipe);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<RecipeDto>> UpdateRecipe(Guid id, UpdateRecipeDto updateRecipeDto)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty);
                var recipe = await _recipeService.UpdateRecipeAsync(id, updateRecipeDto, userId);
                return Ok(recipe);
            }
            catch (Exception ex)
            {
                if (ex.Message == "Recipe not found")
                {
                    return NotFound(new { message = ex.Message });
                }
                if (ex.Message == "You are not authorized to update this recipe")
                {
                    return Forbid();
                }
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<bool>> DeleteRecipe(Guid id)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty);
                var result = await _recipeService.DeleteRecipeAsync(id, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                if (ex.Message == "Recipe not found")
                {
                    return NotFound(new { message = ex.Message });
                }
                if (ex.Message == "You are not authorized to delete this recipe")
                {
                    return Forbid();
                }
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
