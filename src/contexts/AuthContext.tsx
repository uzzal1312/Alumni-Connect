import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface User {
  id: number;
  email: string;
  full_name: string;
  fullName?: string; // For backwards compatibility
  role: "student" | "alumni" | "admin";
  profile_picture?: string;
  profilePicture?: string; // For backwards compatibility
  is_verified?: boolean;
  created_at?: string;
  profile?: any;
  workHistory?: any[];
  reviews?: any[];
  avgRating?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  registerStudent: (data: any) => Promise<void>;
  registerAlumniStep1: (data: any) => Promise<void>;
  registerAlumniStep2: (data: any) => Promise<void>;
  registerAlumniStep3: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  alumniRegistrationData: any;
  setAlumniRegistrationData: (data: any) => void;
  fetchUserProfile: (userId: number) => Promise<User>;
  API_BASE: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "http://localhost:5000/api";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [alumniRegistrationData, setAlumniRegistrationData] = useState<any>(() => {
    const saved = localStorage.getItem("alumniRegistration");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, [token]);

  const saveAuthData = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    saveAuthData(data.token, data.user);
  };

  const registerStudent = async (data: any) => {
    const response = await fetch(`${API_BASE}/auth/register/student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Registration failed");
    saveAuthData(result.token, result.user);
  };

  const registerAlumniStep1 = async (data: any) => {
    const response = await fetch(`${API_BASE}/auth/register/alumni/step1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Step 1 failed");
    const newData = { ...alumniRegistrationData, ...data, email: data.email };
    setAlumniRegistrationData(newData);
    localStorage.setItem("alumniRegistration", JSON.stringify(newData));
  };

  const registerAlumniStep2 = async (data: any) => {
    const fullData = { ...data, email: alumniRegistrationData.email };
    const response = await fetch(`${API_BASE}/auth/register/alumni/step2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Step 2 failed");
    const newData = { ...alumniRegistrationData, ...data };
    setAlumniRegistrationData(newData);
    localStorage.setItem("alumniRegistration", JSON.stringify(newData));
  };

  const registerAlumniStep3 = async (data: any) => {
    const fullData = { ...data, email: alumniRegistrationData.email };
    const response = await fetch(`${API_BASE}/auth/register/alumni/step3`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Step 3 failed");
    localStorage.removeItem("alumniRegistration");
    setAlumniRegistrationData({});
  };

  const logout = (navigate?: (path: string) => void) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    if (navigate) {
      navigate('/'); // Redirect to landing page
    }
  };

  const fetchUserProfile = useCallback(async (userId: number): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch user profile");
    // Update the global user state and localStorage with fresh data!
    const freshUser = data.user;
    localStorage.setItem("user", JSON.stringify(freshUser));
    setUser(freshUser);
    return freshUser;
  }, [API_BASE]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        registerStudent,
        registerAlumniStep1,
        registerAlumniStep2,
        registerAlumniStep3,
        logout,
        loading,
        alumniRegistrationData,
        setAlumniRegistrationData,
        fetchUserProfile,
        API_BASE,
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
