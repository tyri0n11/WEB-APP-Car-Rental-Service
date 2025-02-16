import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return <h1>{user ? user.email : "Guest"}</h1>;
};

export default Profile;
