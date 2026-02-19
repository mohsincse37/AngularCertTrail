import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { API_URL } from "../components/API_URL";
import { Link } from "react-router-dom";
import '../styles/common.css';
import '../styles/login.css';

const Login = () => {
  const [userID, setUserId] = useState('');
  const [password, setPassWord] = useState('');
  const [errorMsg, setError] = useState('');
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") { // Use e.key for better compatibility
        handleSubmit();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [userID, password]); // Add dependencies to ensure latest state

  const renderEyesPassword = () => {
    if (!password) return null;
    return isHiddenPassword ? (
      <AiFillEye
        onClick={() => setIsHiddenPassword((prev) => !prev)}
        className="iconEyes"
      />
    ) : (
      <AiFillEyeInvisible
        onClick={() => setIsHiddenPassword((prev) => !prev)}
        className="iconEyes"
      />
    );
  };

  const handleUserIDChange = (e) => {
    const value = e.target.value;
    setUserId(value); // Store raw value, trim only on submit
    if (value.trim()) setError(''); // Clear error if non-empty after trim
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassWord(value); // Store raw value, trim only on submit
    if (value.trim()) setError(''); // Clear error if non-empty after trim
  };

  const handleSubmit = () => {
    const trimmedUserID = userID.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUserID) {
      setError('Email is required.');
      return;
    }
    if (!trimmedPassword) {
      setError('Password is required.');
      return;
    }

    const url = API_URL + 'api/Login/LoginUser';
    const data = {
      email: trimmedUserID,
      userPass: trimmedPassword
    };
    axios.post(url, data)
      .then((result) => {
        if (result.data.loginMsg === 'isValidLogin') {
          navigate("/Home");
        } else {
          setError(result.data.loginMsg);
        }
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred during login.");
      });
  };

  return (
    <Fragment>
      <ToastContainer />
      <div
        className="login-page d-flex align-items-center justify-content-center min-vh-100"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-75"></div>
        <div className="addUser position-relative z-10">
          <div className="text-center">
            <Link className="navbar-brand text-2xl font-bold" to="/">
              <img
                className="logo h-10 w-auto transition-transform duration-300 hover:scale-105 mb-4"
                src="./logo.png"
                alt="Logo"
              />
            </Link>
            <h3 className="text-uppercase fw-bold mb-4">Sign In</h3>
          </div>
          <form className="addUserForm">
            <div className="inputGroup">
              <div className="form-group">
                <label htmlFor="userID" className="">Email:</label>
                <input
                  type="email"
                  id="userID"
                  name="userID"
                  autoComplete="off"
                  placeholder="Enter your Email"
                  value={userID}
                  onChange={handleUserIDChange}
                  className="form-control rounded"
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="password" className="">Password:</label>
                <div className="relative inputGroup">
                  <input
                    type={isHiddenPassword ? "password" : "text"}
                    id="password"
                    name="password"
                    autoComplete="off"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="form-control rounded"
                  />
                  {renderEyesPassword()}
                </div>
              </div>
            </div>
          </form>
          <div className="login mt-3">
            <button
              className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
              onClick={handleSubmit}
            >
              Sign In
            </button>
          </div>
          <div className="login mt-3">
            <p className="text-center mb-0">{errorMsg && <span className="text-danger">{errorMsg}</span>}</p>
          </div>
          <div className="login d-flex justify-content-center align-items-center gap-2 mt-3">
            <p className="mb-0">Don't have an account?</p>
            <Link
              to="/SignUp"
              className="txt-secondary py-2 rounded-pill fw-bold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;