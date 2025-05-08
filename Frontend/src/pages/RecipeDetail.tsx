
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { Recipe } from "../types";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if the recipe belongs to the current user
  const isUserRecipe = user && recipe && user.id === recipe.userId;

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        const recipeData = await api.getRecipeById(id);
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        setError("Failed to fetch recipe details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!recipe) return;
    
    try {
      setIsDeleting(true);
      await api.deleteRecipe(recipe.id);
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete recipe",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p>{error || "Recipe not found"}</p>
          <Link to="/dashboard" className="mt-4">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="recipe-container">
          {/* Back button and actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recipes
              </Button>
            </Link>

            {isUserRecipe && (
              <div className="flex space-x-2 mt-4 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this recipe? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete} 
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Recipe header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-recipe-dark mb-2">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-gray-600">{recipe.description}</p>
            )}
          </div>

          {/* Recipe image and info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              {recipe.imageUrl ? (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title} 
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col justify-center bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-recipe-dark">Recipe Details</h2>
              
              <div className="space-y-3">
                {recipe.cookingTime && (
                  <div className="flex items-center">
                    <span className="text-recipe-primary mr-2">⏱️</span>
                    <div>
                      <p className="font-medium">Cooking Time</p>
                      <p className="text-gray-600">{recipe.cookingTime} minutes</p>
                    </div>
                  </div>
                )}
                
                {recipe.servings && (
                  <div className="flex items-center">
                    <span className="text-recipe-primary mr-2">👥</span>
                    <div>
                      <p className="font-medium">Servings</p>
                      <p className="text-gray-600">{recipe.servings} servings</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className="text-recipe-primary mr-2">📅</span>
                  <div>
                    <p className="font-medium">Added on</p>
                    <p className="text-gray-600">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ingredients and Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-recipe-dark">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-recipe-primary mr-2">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-recipe-dark">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="bg-recipe-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <div>{instruction}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
