import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import NavbarComp from "./NavbarComp";
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import "react-bootstrap"




function App() {
  
  return (
     <>
        <Router>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<PrivateRoute><NavbarComp></NavbarComp><Dashboard></Dashboard></PrivateRoute>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/forgot-password" element={<ForgotPassword/>}/>
            </Routes>
          </AuthProvider>
        </Router>
     </>
    
  
)
}

export default App;
