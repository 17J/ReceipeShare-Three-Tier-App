
import { Link } from "react-router-dom";
import { Recipe } from "../types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="recipe-card h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <h3 className="text-xl font-semibold text-recipe-dark line-clamp-1">
            {recipe.title}
          </h3>
        </CardHeader>
        <CardContent className="flex-grow">
          {recipe.description && (
            <p className="text-gray-600 line-clamp-2 text-sm">{recipe.description}</p>
          )}
        </CardContent>
        <CardFooter className="pt-2 text-sm text-gray-500 flex justify-between">
          {recipe.cookingTime && (
            <div>
              <span>⏱️ {recipe.cookingTime} mins</span>
            </div>
          )}
          {recipe.servings && (
            <div>
              <span>👥 {recipe.servings} servings</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecipeCard;
