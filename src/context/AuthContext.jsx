import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current user on load (optional, based on your backend route)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me",  {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Signup function
  const signup = async (userData) => {
    try {
      const res = await axios.post("/auth/signup", userData);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      throw err.response?.data?.message || "Signup failed";
    }
  };

  // Login function
  const login = async (userData) => {
    try {
      const res = await axios.post("/auth/login", userData);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      throw err.response?.data?.message || "Login failed";
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/auth/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
