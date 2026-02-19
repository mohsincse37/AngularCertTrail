import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../components/API_URL";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import '../styles/CustomCss.css';
import '../styles/common.css';
import '../styles/login.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [password, setPassWord] = useState('');
  const [age, setAge] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setError] = useState('');

  useEffect(() => {
    // getData();
  }, []);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (value) setError('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassWord(value);
    if (value) {
      if (value.length < 8) {
        setError('Password length must be 8 Characters');
      } else {
        setError('');
      }
    }
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    setAge(value);
    if (value) setError('');
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value.trim());
    if (value) setError('');
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobileNo(value);
    if (value) setError('');
  };

  const handleSave = () => {
    if (!name) {
      setError('User Name is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password length must be 8 Characters');
      return;
    }
    if (!age) {
      setError('Age is required.');
      return;
    }
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setError('Invalid email address');
      return;
    }
    if (!mobileNo) {
      setError('Mobile No is required.');
      return;
    }

    const url = API_URL + 'api/User/AddUser';
    const data = {
      userName: name,
      userPass: password,
      age: age,
      mobileNo: mobileNo,
      email: email,
      address: address,
      paymentCompleted: 0
    };
    axios.post(url, data)
      .then((result) => {
        if (result.data === "2") {
          toast.error("Duplicate Email found");
        } else if (result.data === "3") {
          toast.error("Duplicate Mobile No found");
        } else {
          toast.success("Registration Successful");
          clear();
        }
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred during registration.");
      });
  };

  const clear = () => {
    setName('');
    setPassWord('');
    setAge('');
    setMobileNo('');
    setEmail('');
    setAddress('');
    setError('');
  };

  return (
    <Fragment>
      <ToastContainer />
      <Header />
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
            <Link className="navbar-brand  text-2xl font-bold" to="/">
              <img
                className="logo h-10 w-auto transition-transform duration-300 hover:scale-105 mb-4"
                src="./logo.png"
                alt="Logo"
              />
            </Link>
            <h3 className="text-uppercase fw-bold mb-4 ">Sign Up</h3>
          </div>
          <form className="addUserForm">
            <div className="inputGroup">
              <div className="form-group">
                <label htmlFor="name" className="">User Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="off"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={handleNameChange}
                  className="form-control rounded"
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="password" className="">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="off"
                  placeholder="Enter Password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="form-control rounded"
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="age" className="">Age:</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  autoComplete="off"
                  placeholder="Enter Age"
                  value={age}
                  onChange={handleAgeChange}
                  className="form-control rounded"
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="mobileNo" className="">Mobile No:</label>
                <input
                  type="tel"
                  id="mobileNo"
                  name="mobileNo"
                  autoComplete="off"
                  placeholder="Enter Mobile No"
                  value={mobileNo}
                  onChange={handleMobileChange}
                  className="form-control rounded"
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="email" className="">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  placeholder="Enter Email"
                  value={email}
                  onChange={handleEmailChange}
                  className="form-control rounded"
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="address" className="">Address:</label>
                <textarea
                  rows="3"
                  id="address"
                  name="address"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control rounded"
                />
              </div>
            </div>
            <div className="login mt-3">
              <p className=" text-center mb-0">{errorMsg && <span className="text-danger">{errorMsg}</span>}</p>
            </div>
            <div className="login mt-3 text-center">
              <button
                className="btn btn-primary fw-bold px-4 py-2 rounded-pill"
                onClick={handleSave}
              >
                Sign Up
              </button>
            </div>
            <div className="login d-flex justify-content-center align-items-center gap-2 mt-3">
              <p className=" mb-0">Already have an account?</p>
              <Link
                to="/Login"
                className="txt-secondary py-2 rounded-pill fw-bold"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default SignUp;