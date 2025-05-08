
using System.Text.Json;

namespace Share4Recipe.Api.Models
{
    public class Recipe
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Ingredients { get; set; } = "[]"; // Stored as JSON string
        public string Instructions { get; set; } = "[]"; // Stored as JSON string
        public int? CookingTime { get; set; }
        public int? Servings { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign key
        public Guid UserId { get; set; }
        
        // Navigation property
        public virtual User? User { get; set; }
        
        // Helper methods for JSON conversion
        public List<string> GetIngredientsList() => 
            JsonSerializer.Deserialize<List<string>>(Ingredients) ?? new List<string>();
        
        public void SetIngredientsList(IEnumerable<string> ingredients) => 
            Ingredients = JsonSerializer.Serialize(ingredients);
        
        public List<string> GetInstructionsList() => 
            JsonSerializer.Deserialize<List<string>>(Instructions) ?? new List<string>();
        
        public void SetInstructionsList(IEnumerable<string> instructions) => 
            Instructions = JsonSerializer.Serialize(instructions);
    }
}
