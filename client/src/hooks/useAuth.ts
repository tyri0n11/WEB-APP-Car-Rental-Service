import { useAuth as useAuthContext } from "../contexts/AuthContext";

const useAuthHook = (): ReturnType<typeof useAuthContext> => {
  const context = useAuthContext();
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export { useAuthHook as useAuth };
