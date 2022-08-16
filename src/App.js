import SignupAdmin from "./auth-pages/SignupAdmin";
import SignupUser from "./auth-pages/SignupUser";
import LoginUser from "./auth-pages/LoginUser";
import LoginAdmin from "./auth-pages/LoginAdmin";
import Dashboard from "./admin-pages/Dashboard";
import UserDashboard from "./user-pages/UserDashboard";
import Overview from "./admin-pages/Overview";
import PrivateRouteAdmin from "./auth-pages/PrivateRouteAdmin"
import PrivateRouteUser from "./auth-pages/PrivateRouteUser"
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
              <Route path="/signup-admin" element={<SignupAdmin/>}/>
              <Route path="/login-admin" element={<LoginAdmin/>}/>
              <Route path="/dashboard" element={<PrivateRouteAdmin><NavbarComp></NavbarComp><Dashboard></Dashboard></PrivateRouteAdmin>}/>
              <Route path="/overview" element={<PrivateRouteAdmin><NavbarComp></NavbarComp><Overview></Overview></PrivateRouteAdmin>}/>
              
              {/* User Components */}
              <Route path="/signup" element={<SignupUser/>}/>
              <Route path="/login" element={<LoginUser/>}/>
              <Route path="/user-dashboard" element={<PrivateRouteUser><NavbarComp></NavbarComp><UserDashboard></UserDashboard></PrivateRouteUser>}/>
              <Route path="/forgot-password" element={<ForgotPassword/>}/>
            </Routes>
          </AuthProvider>
        </Router>
     </>
    
  
)
}

export default App;
