
import { Recipe } from "../types";

// Mock data
const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Homemade Pizza",
    description: "Delicious pizza with a crispy crust and your favorite toppings.",
    ingredients: [
      "2 1/2 cups all-purpose flour", 
      "1 tsp salt", 
      "1 tsp sugar", 
      "1 tbsp active dry yeast", 
      "1 cup warm water", 
      "2 tbsp olive oil",
      "1/2 cup pizza sauce",
      "2 cups shredded mozzarella cheese",
      "Your favorite toppings"
    ],
    instructions: [
      "In a large mixing bowl, combine flour, salt, sugar, and yeast.",
      "Add warm water and olive oil, then mix until a dough forms.",
      "Knead the dough on a floured surface for about 5 minutes.",
      "Cover and let rise for 30 minutes.",
      "Preheat oven to 450°F (230°C).",
      "Roll out the dough on a floured surface.",
      "Transfer to a baking sheet and top with sauce, cheese, and toppings.",
      "Bake for 12-15 minutes or until crust is golden and cheese is bubbly."
    ],
    cookingTime: 30,
    servings: 4,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    userId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Classic Chocolate Chip Cookies",
    description: "Soft and chewy chocolate chip cookies that are perfect with a glass of milk.",
    ingredients: [
      "2 1/4 cups all-purpose flour", 
      "1 tsp baking soda", 
      "1 tsp salt", 
      "1 cup unsalted butter, softened", 
      "3/4 cup granulated sugar", 
      "3/4 cup brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups semi-sweet chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a small bowl, mix flour, baking soda, and salt.",
      "In a large bowl, beat butter, granulated sugar, and brown sugar until creamy.",
      "Beat in eggs one at a time, then stir in vanilla.",
      "Gradually blend in the flour mixture.",
      "Stir in chocolate chips.",
      "Drop by rounded tablespoons onto ungreased baking sheets.",
      "Bake for 9 to 11 minutes or until golden brown.",
      "Cool on baking sheets for 2 minutes, then remove to wire racks."
    ],
    cookingTime: 20,
    servings: 24,
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
    userId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// In-memory storage for user recipes (simulating a database)
let recipes = [...mockRecipes];

export const api = {
  // User related endpoints
  login: async (email: string, password: string) => {
    // This would normally make an API call
    console.log("Login attempt with", email);
    return { success: true };
  },
  
  register: async (username: string, email: string, password: string) => {
    // This would normally make an API call
    console.log("Register attempt with", email);
    return { success: true };
  },
  
  // Recipe related endpoints
  getRecipes: async (): Promise<Recipe[]> => {
    // This would normally make an API call
    return recipes;
  },
  
  getUserRecipes: async (userId: string): Promise<Recipe[]> => {
    // This would normally make an API call filtering by user ID
    return recipes.filter(recipe => recipe.userId === userId);
  },
  
  getRecipeById: async (id: string): Promise<Recipe | undefined> => {
    // This would normally make an API call
    return recipes.find(recipe => recipe.id === id);
  },
  
  createRecipe: async (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">): Promise<Recipe> => {
    // This would normally make an API call
    const newRecipe: Recipe = {
      ...recipe,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    recipes.push(newRecipe);
    console.log("Recipe created:", newRecipe);
    return newRecipe;
  },

  updateRecipe: async (id: string, recipeData: Partial<Recipe>): Promise<Recipe> => {
    // This would normally make an API call
    const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
    
    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }
    
    // Update the recipe
    const updatedRecipe = {
      ...recipes[recipeIndex],
      ...recipeData,
      updatedAt: new Date().toISOString()
    };
    
    recipes[recipeIndex] = updatedRecipe;
    console.log("Recipe updated:", updatedRecipe);
    return updatedRecipe;
  },

  deleteRecipe: async (id: string): Promise<boolean> => {
    // This would normally make an API call
    const initialLength = recipes.length;
    recipes = recipes.filter(recipe => recipe.id !== id);
    
    const deleted = recipes.length < initialLength;
    if (deleted) {
      console.log("Recipe deleted:", id);
    }
    return deleted;
  }
};
