import React, { createContext, useEffect, useReducer } from "react";

const API_AUTHEN_URL = "http://localhost:3000/auth";
const API_BASE_URL = "http://localhost:3000";

export interface User {
  role: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isVerified: boolean;
  drivingLicenceId: DrivingLicence;
}
interface DrivingLicence {
  licenceNumber: string;
  drivingLicenseImages: string[];
  expiryDate: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const authReducer = (
  state: AuthState,
  action: { type: string; payload?: any }
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
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
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user");

    const result = await response.json();
    if (result?.statusCode === 200 && result?.data) {
      const user: User = {
        role: result.data.role,
        id: result.data.id,
        email: result.data.email,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        phoneNumber: result.data.phoneNumber,
        isVerified: result.data.isVerified,
        drivingLicenceId: result.data.drivingLicenceId ?? "Not validate yet",
      };
      return user;
    } else {
      throw new Error("Invalid user data structure");
    }
  } catch (error) {
    console.error("Fetch user error:", error);
    return null;
  }
};

const refreshToken = async (): Promise<{ accessToken: string } | null> => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    const response = await fetch(`${API_AUTHEN_URL}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
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
  const initializeAuth = async () => {
    if (state.accessToken) {
      const user = await fetchUser(state.accessToken);
      if (user) {
        console.log("User fetched:", user);
        dispatch({ type: "SET_USER", payload: user });
      } else {
        const newTokens = await refreshToken();
        if (newTokens) {
          localStorage.setItem("access_token", newTokens.accessToken);
          dispatch({ type: "SET_TOKEN", payload: newTokens.accessToken });
          const newUser = await fetchUser(newTokens.accessToken);
          dispatch({ type: "SET_USER", payload: newUser });
        } else {
          handleLogout();
        }
      }
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

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
      if (!response.ok) {
        throw new Error("Signup failed");
      }
    } catch (error) {
      throw new Error("Signup error");
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_AUTHEN_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");

      }

      const data = await response.json();
      const access = data?.data?.accessToken;
      const refresh = data?.data?.refreshToken;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      const user = await fetchUser(access);
      if (!user) {
        throw new Error("Failed to fetch user");
      }
      dispatch({
        type: "LOGIN",
        payload: { user, accessToken: access },
      });
      return true;
    } catch (error) {
      throw new Error("Login error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, signup, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
