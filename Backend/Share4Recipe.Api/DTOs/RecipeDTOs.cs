
namespace Share4Recipe.Api.DTOs
{
    public class RecipeDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<string> Ingredients { get; set; } = new List<string>();
        public List<string> Instructions { get; set; } = new List<string>();
        public int? CookingTime { get; set; }
        public int? Servings { get; set; }
        public string? ImageUrl { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    
    public class CreateRecipeDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<string> Ingredients { get; set; } = new List<string>();
        public List<string> Instructions { get; set; } = new List<string>();
        public int? CookingTime { get; set; }
        public int? Servings { get; set; }
        public string? ImageUrl { get; set; }
    }
    
    public class UpdateRecipeDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public List<string>? Ingredients { get; set; }
        public List<string>? Instructions { get; set; }
        public int? CookingTime { get; set; }
        public int? Servings { get; set; }
        public string? ImageUrl { get; set; }
    }
}
