
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, LogIn } from "lucide-react";

interface AuthFormProps {
  type: "login" | "register";
  onSuccess: () => void;
}

const AuthForm = ({ type, onSuccess }: AuthFormProps) => {
  const { login, register, error } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (type === "register" && formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      if (type === "login") {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Auth error", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === "register" && (
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              className="pl-10"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            className="pl-10"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {type === "register" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      )}

      {(formError || error) && (
        <div className="text-red-500 text-sm">
          {formError || error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-recipe-primary hover:bg-recipe-primary/80"
      >
        {type === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
};

export default AuthForm;
