import './App.css'
import { Routes, Route } from "react-router";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//import Home from './components/Customer/home';
import Home from './components/Staff/home';
//import Login from './components/login';
import EmailVerify from './components/EmailVerify';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* All paths lead to Home for now */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        
        {/* Redirect everything else to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;