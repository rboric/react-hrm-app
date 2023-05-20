import { BrowserRouter as Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="home">
      <h1>Welcome to HRM App</h1>
      <p>Manage your human resources efficiently and effectively.</p>
      <Link to="/login" className="btn">
        Go to login
      </Link>
    </div>
  );
}
