import SignupAdmin from "./auth-pages/SignupAdmin";
import Dashboard from "./admin-pages/Dashboard";
import Overview from "./admin-pages/Overview";
import LoginAdmin from "./auth-pages/LoginAdmin";
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
              <Route path="/dashboard" element={<PrivateRoute><NavbarComp></NavbarComp><Dashboard></Dashboard></PrivateRoute>}/>
              <Route path="/overview" element={<PrivateRoute><NavbarComp></NavbarComp><Overview></Overview></PrivateRoute>}/>
              <Route path="/signup-admin" element={<SignupAdmin/>}/>
              <Route path="/login-admin" element={<LoginAdmin/>}/>
              <Route path="/forgot-password" element={<ForgotPassword/>}/>
            </Routes>
          </AuthProvider>
        </Router>
     </>
    
  
)
}

export default App;
