
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { api } from "../services/api";

const AddRecipe = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: [""],
    cookingTime: "",
    servings: "",
    imageUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients.length > 1) {
      const newIngredients = [...recipe.ingredients];
      newIngredients.splice(index, 1);
      setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }));
  };

  const removeInstruction = (index: number) => {
    if (recipe.instructions.length > 1) {
      const newInstructions = [...recipe.instructions];
      newInstructions.splice(index, 1);
      setRecipe(prev => ({ ...prev, instructions: newInstructions }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Filter out empty ingredients and instructions
      const filteredIngredients = recipe.ingredients.filter(item => item.trim() !== "");
      const filteredInstructions = recipe.instructions.filter(item => item.trim() !== "");

      if (!recipe.title) {
        throw new Error("Recipe title is required");
      }

      if (filteredIngredients.length === 0) {
        throw new Error("At least one ingredient is required");
      }

      if (filteredInstructions.length === 0) {
        throw new Error("At least one instruction is required");
      }

      // Create the recipe
      await api.createRecipe({
        title: recipe.title,
        description: recipe.description,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        cookingTime: recipe.cookingTime ? parseInt(recipe.cookingTime) : undefined,
        servings: recipe.servings ? parseInt(recipe.servings) : undefined,
        imageUrl: recipe.imageUrl || undefined,
        userId: user.id,
      });

      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to create recipe");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="recipe-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-recipe-dark mb-6">Add New Recipe</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-recipe-dark">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Recipe Title*</Label>
                    <Input
                      id="title"
                      name="title"
                      value={recipe.title}
                      onChange={handleChange}
                      placeholder="e.g., Homemade Pizza"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={recipe.description}
                      onChange={handleChange}
                      placeholder="Brief description of your recipe"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                      <Input
                        id="cookingTime"
                        name="cookingTime"
                        type="number"
                        value={recipe.cookingTime}
                        onChange={handleChange}
                        placeholder="e.g., 30"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="servings">Servings</Label>
                      <Input
                        id="servings"
                        name="servings"
                        type="number"
                        value={recipe.servings}
                        onChange={handleChange}
                        placeholder="e.g., 4"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={recipe.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
              
              {/* Ingredients */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-recipe-dark">Ingredients</h2>
                
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        disabled={recipe.ingredients.length === 1}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIngredient}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
              
              {/* Instructions */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-recipe-dark">Instructions</h2>
                
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-shrink-0 mt-2">
                        <div className="bg-recipe-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <Textarea
                          value={instruction}
                          onChange={(e) => handleInstructionChange(index, e.target.value)}
                          placeholder={`Step ${index + 1}`}
                          rows={2}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                        disabled={recipe.instructions.length === 1}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInstruction}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-recipe-primary hover:bg-recipe-primary/80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Recipe"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
