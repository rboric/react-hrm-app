import SignupAdmin from "./auth-pages/SignupAdmin";
import SignupUser from "./auth-pages/SignupUser";
import LoginUser from "./auth-pages/LoginUser";
import LoginAdmin from "./auth-pages/LoginAdmin";
import Dashboard from "./admin-pages/Dashboard";
import UserDashboard from "./user-pages/UserDashboard";
import Overview from "./admin-pages/Overview";
import PrivateRoute from "./auth-pages/PrivateRoute"
import ForgotPassword from "./auth-pages/ForgotPassword"
import NavbarComp from "./components/NavbarComp";
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import "react-bootstrap"




function App() {
  
  return ( 
     <>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Admin Components */}
              <Route exact path="/signup-admin" element={<SignupAdmin/>}/>
              <Route exact path="/login-admin" element={<LoginAdmin/>}/>
              <Route exact path="/dashboard" element={<PrivateRoute><NavbarComp></NavbarComp><Dashboard></Dashboard></PrivateRoute>}/>
              <Route exact path="/overview" element={<PrivateRoute><NavbarComp></NavbarComp><Overview></Overview></PrivateRoute>}/>
              
              {/* User Components */}
              <Route exact path="/signup" element={<SignupUser/>}/>
              <Route exact path="/login" element={<LoginUser/>}/>
              <Route exact path="/user-dashboard" element={<PrivateRoute><NavbarComp></NavbarComp><UserDashboard></UserDashboard></PrivateRoute>}/>
              <Route exact path="/forgot-password" element={<ForgotPassword/>}/>
            </Routes>
          </AuthProvider>
        </Router>
     </>
    
  
)
}

export default App;
