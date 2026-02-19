import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../components/API_URL";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/CustomCss.css';
import '../styles/common.css';
import '../styles/login.css';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassWord] = useState('');
  const [newPassword, setNewPassWord] = useState('');
  const [confirmPassword, setConfirmPassWord] = useState('');
  const [errorMsg, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // pageAuthorization(); // Commented out as in both versions
  }, []);

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassWord(value);
    if (value) {
      if (value.length < 8) {
        setError('Password length must be 8 Characters');
      } else {
        setError('');
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassWord(value);
  };

  const handleUpdatePassword = () => {
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!oldPassword) {
      setError('Old Password is required.');
      return;
    }
    if (!newPassword) {
      setError('New Password is required.');
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("Confirm Password doesn't match with new password.");
      return;
    }

    const url = API_URL + 'api/User/ChangePassword/100'; // Note: Hardcoded ID, consider dynamic user ID
    const data = {
      id: 100, // Note: Hardcoded, consider dynamic user ID
      email: email.trim(),
      oldPassword: oldPassword.trim(),
      newPassword: newPassword.trim(),
      confirmPassword: confirmPassword.trim()
    };

    axios.put(url, data)
      .then((result) => {
        if (result.data === 1) {
          toast.error("Old password is incorrect");
        } else {
          toast.success("Password has been changed");
          clear();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setEmail('');
    setOldPassWord('');
    setNewPassWord('');
    setConfirmPassWord('');
    setError('');
  };

  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <div className="login-page d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Container className="dumps-practice-section py-5">
          <div className="addUser position-relative z-10">
            <h3 className="text-uppercase fw-bold mb-4 text-center text-green-600">Change Password</h3>
            <form className="addUserForm">
              <div className="inputGroup">
                <div className="form-group">
                  <label htmlFor="email" className="text-dark">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="off"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control rounded"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="oldPassword" className="text-dark">Old Password:</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    autoComplete="off"
                    placeholder="Enter Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassWord(e.target.value)}
                    className="form-control rounded"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="newPassword" className="text-dark">New Password:</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    autoComplete="off"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    className="form-control rounded"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="confirmPassword" className="text-dark">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="off"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="form-control rounded"
                  />
                </div>
              </div>
              <div className="login mt-3">
                <p className="text-dark text-center mb-0">{errorMsg && <span className="text-danger">{errorMsg}</span>}</p>
              </div>
              <div className="login mt-3 text-center">
                <button
                  className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-pill"
                  onClick={handleUpdatePassword}
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>
      <Footer />
    </Fragment>
  );
};

export default ChangePassword;