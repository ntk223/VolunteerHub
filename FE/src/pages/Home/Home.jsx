import { useAuth } from "../../contexts/AuthContext";
const Home = () => {
    const {logout, user} = useAuth();
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>User Email: {user.email}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Home;