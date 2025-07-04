import { BrowserRouter as Router ,Routes,Route,Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";



function App() {
  

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar/>
        <div className="conatiner mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/Login"/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/Signup" element={<Signup/>}/>
            <Route path="/transactions" element={<div>Transactions Placeholder</div>}/>

          </Routes>
          
        </div>
      </div>
    </Router>
  )
}

export default App
