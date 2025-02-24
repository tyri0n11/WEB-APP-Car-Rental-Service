import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return <h1>This is dashboard, {user ? user.email : "Guest"}!</h1>;
};

export default Dashboard;
