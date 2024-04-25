import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Sidebar from "./component/Sidebar";
import Profile from "./pages/Profile";
import TweetDetails from "./pages/TweetDetails";
import { useDispatch } from "react-redux";
import "./App.css";

function MainContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [zindex,setZindex] = useState()
  
  const hideSidebar =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: "LOGIN_ERROR" });
    }
  }, [dispatch, navigate]);

  return (
    <div className="container-fluid">
      <div className="row">
        {!hideSidebar && (
          <div className="col-2 col-sm-2 col-md-2 col-lg-3">
            <Sidebar setZindex={setZindex}/>
          </div>
        )}
        <div
          className={`col-10 col-sm-10 col-md-10 col-lg-9 ${
            hideSidebar ? "mx-auto" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<Home zindex={zindex}/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tweet/:id" element={<TweetDetails zindex={zindex}/>} />
            <Route path="/user/:id" element={<Profile />} />
            <Route path="/home/user/:id" element={<Profile />} />
            <Route path="/tweet/:id/user/:id" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
