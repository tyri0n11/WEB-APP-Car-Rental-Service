import React, { createContext, useEffect, useReducer } from "react";

const API_AUTHEN_URL = "http://localhost:3000/auth";
const API_BASE_URL = "http://localhost:3000";

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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => Promise<void>;
  logout: () => void;
  updateUserDetails: (userId: string, updateData: any) => Promise<User>;
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

      if (!response.ok) throw new Error("Signup failed");

      const result = await response.json();
      const access = result?.data?.accessToken;
      const refresh = result?.data?.refreshToken;
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

  const updateUserDetails = async (userId: string, updateData: any): Promise<User> => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No authentication token available. Please log in.");
    }

    console.log("Updating user details with token:", accessToken.substring(0, 10) + "...");
    console.log("Update data:", updateData);

    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh the token
        const newTokens = await refreshToken();
        if (newTokens) {
          localStorage.setItem("access_token", newTokens.accessToken);
          dispatch({ type: "SET_TOKEN", payload: newTokens.accessToken });
          
          // Retry the request with the new token
          const retryResponse = await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${newTokens.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          });
          
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json();
            throw new Error(errorData.message || "Failed to update user details after token refresh");
          }
          
          const result = await retryResponse.json();
          if (!result?.data) {
            throw new Error("Invalid response format from update request");
          }
          
          return result.data;
        } else {
          throw new Error("Authentication token expired. Please log in again.");
        }
      }
      
      // Try to get more detailed error information
      let errorMessage = "Failed to update user details";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error("Server error details:", errorData);
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Check if the response has the expected structure
    if (!result?.data) {
      throw new Error("Invalid response format from update request");
    }
    
    // Update the user in the context
    dispatch({ type: "SET_USER", payload: result.data });
    
    return result.data;
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, signup, logout: handleLogout, updateUserDetails }}
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
