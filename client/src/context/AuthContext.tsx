import React, { createContext, useContext, useEffect, useReducer } from "react";

const API_AUTHEN_URL = "http://localhost:3000/auth";

interface User {
  role: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isVerified: boolean;
  drivingLicenceId: string;
}
interface AuthState {
  user: User | null;
  accessToken: string | null;
}
interface AuthContextType extends AuthState {
  login: (email: string, password: string ) => Promise<void>;
  signup: (data: {
          email: string;
          password: string;
          firstName: string;
          lastName: string;
          phoneNumber: string;
  }) => Promise<void>;
  logout: () => void;
}
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: { type: string; payload?: any }): AuthState => {
  switch (action.type) {
      case "LOGIN":
          return { user: action.payload.user, accessToken: action.payload.accessToken };
      case "LOGOUT":
          return { user: null, accessToken: null };
      case "SET_USER":
          return { ...state, user: action.payload };
      case "SET_TOKEN":
          return { ...state, accessToken: action.payload };
      default:
          return state;
  }
};

const fetchUser = async (accessToken: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_AUTHEN_URL}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    return await response.json();
  }catch (error) {
      console.error(error);
      return null;
  }
}
const refreshToken = async (): Promise<{ access_token: string } | null> => {
  try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return null;

      const response = await fetch(`${API_AUTHEN_URL}/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return null;
      return await response.json();
  } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, {
      user: null,
      accessToken: localStorage.getItem("access_token") || null,
  });

  useEffect(() => {
      const initializeAuth = async () => {
          if (state.accessToken) {
              const user = await fetchUser(state.accessToken);
              if (user) {
                  dispatch({ type: "SET_USER", payload: user });
              } else {
                  const newTokens = await refreshToken();
                  if (newTokens) {
                      localStorage.setItem("access_token", newTokens.access_token);
                      dispatch({ type: "SET_TOKEN", payload: newTokens.access_token });
                      const newUser = await fetchUser(newTokens.access_token);
                      dispatch({ type: "SET_USER", payload: newUser });
                  } else {
                      handleLogout();
                  }
              }
          }
      };
      initializeAuth();
  }, [state.accessToken]);
  const signup = async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
  }): Promise<void> => {
      try {
          const response = await fetch(`${API_AUTHEN_URL}/signup`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error("Signup failed");

          const user = await response.json();
          dispatch({ type: "LOGIN", payload: { user, accessToken: localStorage.getItem("access_token") } });
      } catch (error) {
          console.error("Signup error:", error);
      }
  }

  const login = async (email: string, password: string): Promise<void> => {
      try {
          const response = await fetch(`${API_AUTHEN_URL}/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
          });

          if (!response.ok) throw new Error("Login failed");

          const data = await response.json();
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);

          const user = await fetchUser(data.access_token);
          dispatch({ type: "LOGIN", payload: { user, accessToken: data.access_token } });

      } catch (error) {
          console.error("Login error:", error);
      }
  };

  const handleLogout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      dispatch({ type: "LOGOUT" });
  };

  return (
      <AuthContext.Provider value={{ ...state, login, signup, logout: handleLogout }}>
          {children}
      </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
