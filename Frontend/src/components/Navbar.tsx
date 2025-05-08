
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, LogIn, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="recipe-container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-recipe-primary text-2xl font-bold">Share4Recipe</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-recipe-primary flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-recipe-primary">
                  My Recipes
                </Link>
                <Button 
                  variant="outline"
                  className="border-recipe-primary text-recipe-primary hover:bg-recipe-primary hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                className="border-recipe-primary text-recipe-primary hover:bg-recipe-primary hover:text-white"
                onClick={() => navigate("/login")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-3">
            <Link 
              to="/"
              className="block px-4 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard"
                  className="block px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Recipes
                </Link>
                <Button 
                  variant="outline"
                  className="w-full justify-start border-recipe-primary text-recipe-primary hover:bg-recipe-primary hover:text-white"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                className="w-full justify-start border-recipe-primary text-recipe-primary hover:bg-recipe-primary hover:text-white"
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
