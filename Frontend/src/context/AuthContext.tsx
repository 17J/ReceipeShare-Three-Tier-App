
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState, LoginCredentials, RegisterCredentials } from "../types";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        localStorage.removeItem("user");
        setState({ ...state, loading: false });
      }
    } else {
      setState({ ...state, loading: false });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState({ ...state, loading: true, error: null });
    
    try {
      // This would normally call an API, but for now we'll mock it
      // Mock user data
      const mockUser: User = {
        id: "1",
        username: "demouser",
        email: credentials.email,
      };
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      setState({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Login error", error);
      setState({
        ...state,
        loading: false,
        error: "Failed to log in. Please check your credentials.",
      });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setState({ ...state, loading: true, error: null });
    
    try {
      // This would normally call an API, but for now we'll mock it
      // Mock user creation
      const mockUser: User = {
        id: "1",
        username: credentials.username,
        email: credentials.email,
      };
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      setState({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Registration error", error);
      setState({
        ...state,
        loading: false,
        error: "Failed to register. Please try again.",
      });
    }
  };

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem("user");
    
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
