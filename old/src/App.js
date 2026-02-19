import React, { useState, useEffect, Fragment } from "react";
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import UserSubscription from './pages/UserSubscription';
import CertificationTopic from './pages/CertificationTopic';
import CertificationQuestion from './pages/CertificationQuestion';
import QuestionOption from './pages/QuestionOption';
import RightOptionSetting from './pages/RightOptionSetting';
import TopicSubscription from './pages/TopicSubscription';
import CertificationScheme from './pages/CertificationScheme';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import ChangePassword from './pages/ChangePassword';
import UserWiseTopic from "./pages/UserWiseTopic";
import { API_URL } from "./components/API_URL";

function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(true);
  const onUpdateActivity = () => {
    if (loggedIn) {
      const session = Date.now() + 900000;
      localStorage.setItem("exTime", session.toString());
    }
  }
  const onCheckInActivity = () => {
    const exTime = localStorage.getItem('exTime');
    if (Number(exTime) < Date.now()) {
      setLoggedIn(false);
      navigator.sendBeacon(API_URL + 'api/Login/LogOutUser');
      navigate("/");
    }
  }

  useEffect(() => {
    const interval = setInterval(() => { onCheckInActivity(); }, 1000)
    return () => {
      clearInterval(interval);
    }
  }, [])

  useEffect(() => {
    window.addEventListener('click', onUpdateActivity);
    window.addEventListener('scroll', onUpdateActivity);
    window.addEventListener('keypress', onUpdateActivity);
    window.addEventListener('mousemove', onUpdateActivity);
    return () => {
      window.addEventListener('click', onUpdateActivity);
      window.addEventListener('scroll', onUpdateActivity);
      window.addEventListener('keypress', onUpdateActivity);
      window.addEventListener('mousemove', onUpdateActivity);
    }
  }, [])

  return (
    <div className="App">

      <Routes>
        <Route path="*" element={<TopicSubscription />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/userSubscription" element={<UserSubscription />} />
        <Route path="/certificationTopic" element={<CertificationTopic />} />
        <Route path="/certificationQuestion" element={<CertificationQuestion />} />
        <Route path="/questionOption" element={<QuestionOption />} />
        <Route path="/rightOptionSetting" element={<RightOptionSetting />} />
        <Route path="/certificationScheme" element={<CertificationScheme />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/userWiseTopic" element={<UserWiseTopic />} />
      </Routes>

    </div>
  );
}

export default App;



