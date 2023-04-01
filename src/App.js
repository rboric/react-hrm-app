import RegisterFirm from "./auth-pages/RegisterFirm";
import SignupAdmin from "./auth-pages/SignupAdmin";
import SignupUser from "./auth-pages/SignupUser";
import Login from "./auth-pages/Login";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import Archive from "./pages/Archive";
import ForgotPassword from "./auth-pages/ForgotPassword";
import NavbarComp from "./components/NavbarComp";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-bootstrap";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/register-firm" element={<RegisterFirm />} />
            <Route path="/signup-admin" element={<SignupAdmin />} />
            <Route path="/signup" element={<SignupUser />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <NavbarComp />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/overview"
              element={
                <>
                  <NavbarComp />
                  <Overview />
                </>
              }
            />
            <Route
              path="/archive"
              element={
                <>
                  <NavbarComp />
                  <Archive />
                </>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
