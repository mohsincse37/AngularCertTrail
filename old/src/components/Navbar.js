import React, { useState, useEffect, Fragment } from "react";
import { Nav } from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../components/API_URL";
import '../styles/CustomCss.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const userProfileDataArray = [
  {
    title: (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
        </svg>
      </>
    ),
    submenu: [
      { title: 'SignIn/SignUp', pageName: '/Login' },
      { title: 'Change Password', pageName: '/ChangePassword' },
      { title: 'LogOut', pageName: 'logOut' },
    ],
  },
];

// const dummyMenuDataArray = [
//   {
//     title: 'Home',
//     pageName: '/',
//   },
//   {
//     title: 'Courses',
//     submenu: [
//       { title: 'Web Development', pageName: '/courses/web-development' },
//       { title: 'Data Science', pageName: '/courses/data-science' },
//       {
//         title: 'Programming',
//         childmenu: [
//           { title: 'Python', pageName: '/courses/programming/python' },
//           { title: 'JavaScript', pageName: '/courses/programming/javascript' },
//           { title: 'Java', pageName: '/courses/programming/java' },
//         ],
//       },
//     ],
//   },
//   {
//     title: 'About',
//     pageName: '/about',
//   },
//   {
//     title: 'Contact',
//     pageName: '/contact',
//   },
// ];

const Navbar = ({ list }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const [menuItemsDataArray, setMenuItemsDataArray] = useState(dummyMenuDataArray);
  const [menuItemsDataArray, setMenuItemsDataArray] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [errorMsg, setError] = useState('');
  const [listFinal, setListFinal] = useState(list || []);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Sync listFinal with list prop when it changes
  useEffect(() => {
    setListFinal(list || []);
  }, [list]);

  useEffect(() => {
    getUserRoleMenus();
  }, []);

  // const getUserRoleMenus = () => {
  //   // Set dummy data
  //   setMenuItemsDataArray(dummyMenuDataArray);
  // };
  const getUserRoleMenus = () => {
        axios.get(API_URL + 'api/User/GetUserMenus/')

            .then((result) => {
                setMenuItemsDataArray(result.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

  const handleUserIDChange = (e) => {
    const value = e.target.value;
    setEmail(value.trim());
    if (value) setError('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassWord(value);
    if (value) setError('');
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleDelete = (topicID) => {
    const newList = listFinal.filter((item) => item.topicID !== topicID);
    setListFinal(newList);
    toast.success('Item removed from cart', {
      toastId: `remove-${topicID}`,
      autoClose: 3000,
    });
  };

  const handleCheckOut = () => {
    handleShow();
  };

  const handleSignIn = () => {
        if (!email) {
            setError('Email is required.');
            return;
        }
        if (!password) {
            setError('Password is required.');
            return;
        }
        const url = API_URL + 'api/Login/LoginUser';
        const data = {
            "email": email.trim(),
            "userPass": password.trim()
        }
        axios.post(url, data)
            .then((result) => {
                if (result.data.loginMsg == 'isValidLogin') {
                    navigate("/Cart/", {
                        state: { param1: listFinal, param2: result.data },
                    });
                }
                else setError(result.data);

            }).catch((error) => {
                //toast.error(error);
            })
    }

  const handleSignUp = () => {
    window.open('/SignUp', '_blank');
  };

  // Calculate total amount
  const total = listFinal.reduce((sum, item) => sum + item.amount, 0);
  const amountUnit = listFinal.length > 0 ? listFinal[0].amountUnit : '';

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light w-100">
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="/">
            <img className="logo" src="/logo.png" alt="Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto w-100 d-flex justify-content-center">
              {menuItemsDataArray.map((menu, index) => (
                <li key={index} className="nav-item">
                  {menu.submenu ? (
                    <div className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle "
                        href="#"
                        id={`dropdown-${index}`}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {menu.title}
                      </a>
                      <ul className="dropdown-menu" aria-labelledby={`dropdown-${index}`}>
                        {menu.submenu.map((submenuItem, subIndex) => (
                          <li key={subIndex}>
                            {submenuItem.childmenu && submenuItem.childmenu.length > 0 ? (
                              <div className="dropdown-submenu">
                                <a
                                  className="dropdown-item dropdown-toggle"
                                  href="#"
                                  onClick={(e) => e.preventDefault()} // Prevent navigation for dropdown toggle
                                >
                                  {submenuItem.title}
                                </a>
                                <ul className="dropdown-menu">
                                  {submenuItem.childmenu.map((childItem, childIndex) => (
                                    <li key={childIndex}>
                                      <a
                                        className="dropdown-item"
                                        href={childItem.pageName}
                                      >
                                        {childItem.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <a
                                className="dropdown-item"
                                href={submenuItem.pageName}
                              >
                                {submenuItem.title}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <a
                      className={`nav-link  ${window.location.pathname === menu.pageName ? 'active' : ''}`}
                      href={menu.pageName}
                    >
                      {menu.title}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <ul className="navbar-nav ms-md-auto gap-2">
              <li className="nav-item">
                <div className="dropdown">
                  <a
                    href="#"
                    className="nav-link d-flex align-items-center  text-decoration-none"
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cart-fill me-2" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                    {/* Cart */}
                    <span className="notiCount text-xs rounded-full px-2 py-1 ms-2 text-white">
                      {listFinal.length}
                    </span>
                  </a>
                  {isVisible && (
                    <div className="dropdown-menu dropdown-menu-end show p-0 mt-2 w-100 shadow-lg rounded-lg">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover cartTblStyle m-0">
                          <thead>
                            <tr>
                              <th>Sl</th>
                              <th>Image</th>
                              <th>Topic Title</th>
                              <th>Access Type</th>
                              <th>Duration</th>
                              <th>Amount</th>
                              <th>Remove</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listFinal.length > 0 ? (
                              listFinal.map((item, index) => (
                                <tr key={item.topicID}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <img
                                      className="imgSize h-12 w-12 object-cover"
                                      src={item.topicImgPath}
                                      alt={item.topicTitle}
                                    />
                                  </td>
                                  <td>{item.topicTitle}</td>
                                  <td>{item.accessTypeText}</td>
                                  <td>
                                    {item.accessDuration}
                                    {item.durationUnitText}
                                  </td>
                                  <td>
                                    {item.amount.toFixed(2)}
                                    {item.amountUnit}
                                  </td>
                                  <td>
                                    <button
                                      className="delIconStyle btn btn-light btn-sm"
                                      onClick={() => handleDelete(item.topicID)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center">
                                  Your cart is empty
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={7} className="text-end font-bold">
                                Total: {total.toFixed(2)} {amountUnit}
                              </td>
                            </tr>
                            {listFinal.length > 0 && (
                              <tr>
                                <td colSpan={7} className="text-center">
                                  <button
                                    className="btn btn-primary w-100"
                                    onClick={handleCheckOut}
                                  >
                                    CheckOut
                                  </button>
                                </td>
                              </tr>
                            )}
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </li>

              <li className="nav-item dropdown rounded">
                <a
                  className="nav-link dropdown-toggle "
                  href="#"
                  id="navbarDropdownProfile"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userProfileDataArray[0].title}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownProfile">
                  {userProfileDataArray[0].submenu.map((submenuItem, subIndex) => (
                    <li key={subIndex}>
                      {submenuItem.pageName === 'logOut' ? (
                        <>
                          <hr className="dropdown-divider" />
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              if (window.confirm('Do you really want to log out?')) {
                                navigator.sendBeacon(API_URL + 'api/Login/LogOutUser');
                                navigate('/TopicSubscription');
                                toast.success('Logged out successfully', {
                                  toastId: 'logout-success',
                                  autoClose: 3000,
                                });
                              }
                            }}
                          >
                            {submenuItem.title}
                          </button>
                        </>
                      ) : (
                        <a className="dropdown-item" href={submenuItem.pageName}>
                          {submenuItem.title}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className={`modal fade ${show ? 'show' : ''}`} id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden={true} style={{ display: show ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">User Login/Registration</h5>
              <button type="button" className="btn-close btn-close-dark" onClick={handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col">
                  <p>Only registered customers can CheckOut. Please sign in to your account or register a new one.</p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4 text-end align-self-center">
                  <label htmlFor="email">Email:</label>
                </div>
                <div className="col-8">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={email}
                    onChange={handleUserIDChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4 text-end align-self-center">
                  <label htmlFor="password">Password:</label>
                </div>
                <div className="col-8">
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {errorMsg && <p className="text-danger text-center w-100">{errorMsg}</p>}
              <button type="button" className="btn btn-primary" onClick={handleSignIn}>
                SignIn
              </button>
              <button type="button" className="btn btn-outline-dark" onClick={handleSignUp}>
                Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;