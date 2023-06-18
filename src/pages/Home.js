import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to HRM App</h1>
      <p>Manage your human resources efficiently and effectively.</p>
      <Table>
        <tr>
          <td>
            <Link to="/login">Login</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to="/signup">Signup</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to="/signup-admin">Signup Admin</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to="/register-firm">Register Firm</Link>
          </td>
        </tr>
      </Table>
    </div>
  );
}
