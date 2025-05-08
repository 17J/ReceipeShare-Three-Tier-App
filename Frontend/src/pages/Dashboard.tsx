
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Recipe } from "../types";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchRecipes = async () => {
      try {
        // Get recipes for the current user only
        if (user) {
          const data = await api.getUserRecipes(user.id);
          setRecipes(data);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        toast({
          title: "Error",
          description: "Failed to load your recipes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [isAuthenticated, navigate, user, toast]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="recipe-container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-recipe-dark">My Recipes</h1>
              {user && (
                <p className="text-gray-600 mt-1">Welcome back, {user.username}!</p>
              )}
            </div>
            
            <Link to="/add-recipe" className="mt-4 sm:mt-0">
              <Button className="bg-recipe-primary hover:bg-recipe-primary/80 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Recipe
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading your recipes...</div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-600 mb-4">You haven't added any recipes yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your favorite recipe</p>
              <Link to="/add-recipe">
                <Button className="bg-recipe-primary hover:bg-recipe-primary/80 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Recipe
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
