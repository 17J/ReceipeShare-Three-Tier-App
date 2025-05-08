
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Recipe } from "../types";
import { api } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await api.getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-recipe-light py-16">
        <div className="recipe-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-recipe-dark mb-4">
              Share Your Culinary Creations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Save, organize, and share your favorite recipes with friends and family.
            </p>
            
            {isAuthenticated ? (
              <Link to="/add-recipe">
                <Button className="bg-recipe-primary hover:bg-recipe-primary/80 text-white py-3 px-8">
                  Add Your Recipe
                </Button>
              </Link>
            ) : (
              <div className="space-y-4 md:space-y-0 md:space-x-4">
                <Link to="/register">
                  <Button className="bg-recipe-primary hover:bg-recipe-primary/80 text-white py-3 px-8">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="border-recipe-primary text-recipe-primary hover:bg-recipe-primary hover:text-white py-3 px-8">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="recipe-container">
          <h2 className="text-3xl font-bold text-recipe-dark text-center mb-8">
            Featured Recipes
          </h2>
          
          {loading ? (
            <div className="text-center py-8">Loading recipes...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <section className="py-12 bg-recipe-light">
        <div className="recipe-container text-center">
          <h2 className="text-3xl font-bold text-recipe-dark mb-4">
            Start Your Recipe Collection Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of food enthusiasts. Create an account to save your 
            favorite recipes and share your culinary masterpieces.
          </p>
          
          {!isAuthenticated && (
            <Link to="/register">
              <Button className="bg-recipe-primary hover:bg-recipe-primary/80 text-white py-3 px-8">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
