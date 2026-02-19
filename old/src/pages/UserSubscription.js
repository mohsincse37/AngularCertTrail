import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../components/API_URL";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/CustomCss.css';
import '../styles/common.css';
import '../styles/login.css';

const UserSubscription = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassWord] = useState('');
  const [age, setAge] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [editID, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassWord] = useState('');
  const [editMobileNo, setEditMobileNo] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [errorMsg, setError] = useState('');
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    pageAuthorization();
  }, []);

  const pageAuthorization = () => {
    const url = API_URL + 'api/PageAuthorization/CheckingAuthority';
    const data = { pageName: "/UserSubscription" };
    axios.post(url, data)
      .then((result) => {
        if (result.data.authorityMsg === 'isValidAuthor') {
          getData();
        } else {
          console.log("You are not authorized !!");
          navigate("/Login");
        }
      })
      .catch((error) => {
        toast.error("Authorization failed: " + error.message);
      });
  };

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

  const handleEditNameChange = (e) => {
    const value = e.target.value;
    setEditName(value);
    if (value) setError('');
  };

  const handleEditPasswordChange = (e) => {
    const value = e.target.value;
    setEditPassWord(value);
    if (value) {
      if (value.length < 8) {
        setError('Password length must be 8 Characters');
      } else {
        setError('');
      }
    }
  };

  const handleEditAgeChange = (e) => {
    const value = e.target.value;
    setEditAge(value);
    if (value) setError('');
  };

  const handleEditEmailChange = (e) => {
    const value = e.target.value;
    setEditEmail(value.trim());
    if (value) setError('');
  };

  const handleEditMobileChange = (e) => {
    const value = e.target.value;
    setEditMobileNo(value);
    if (value) setError('');
  };

  const getData = () => {
    axios.get(API_URL + 'api/User/GetUsers')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        toast.error("Failed to load users: " + error.message);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios.get(API_URL + 'api/User/GetUser/' + id)
      .then((result) => {
        setEditName(result.data.userName);
        setEditAge(result.data.age);
        setEditPassWord(result.data.password);
        setEditMobileNo(result.data.mobileNo);
        setEditEmail(result.data.email);
        setEditAddress(result.data.address);
        setEditId(id);
      })
      .catch((error) => {
        toast.error("Failed to load user: " + error.message);
      });
  };

  const handleUpdate = () => {
    if (!editName) {
      setError('User Name is required.');
      return;
    }
    if (!editPassword) {
      setError('Password is required.');
      return;
    }
    if (editPassword.length < 8) {
      setError('Password length must be 8 Characters');
      return;
    }
    if (!editAge) {
      setError('Age is required.');
      return;
    }
    if (!editEmail) {
      setError('Email is required.');
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(editEmail)) {
      setError('Invalid email address');
      return;
    }
    if (!editMobileNo) {
      setError('Mobile No is required.');
      return;
    }

    const url = API_URL + 'api/User/UpdateUser/' + editID;
    const data = {
      id: editID,
      userPass: editPassword,
      userName: editName,
      age: editAge,
      mobileNo: editMobileNo,
      email: editEmail,
      address: editAddress
    };
    axios.put(url, data)
      .then((result) => {
        toast.success("User has been updated");
        handleClose();
        getData();
        clear();
      })
      .catch((error) => {
        toast.error("Failed to update user: " + error.message);
      });
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
          toast.success("User has been added");
          getData();
          clear();
        }
      })
      .catch((error) => {
        toast.error("Failed to add user: " + error.message);
      });
  };

  const clear = () => {
    setName('');
    setPassWord('');
    setAge('');
    setMobileNo('');
    setEmail('');
    setAddress('');
    setEditName('');
    setEditPassWord('');
    setEditAge('');
    setEditMobileNo('');
    setEditEmail('');
    setEditAddress('');
    setEditId('');
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      axios.delete(API_URL + 'api/User/DeleteUser/' + id)
        .then((result) => {
          if (result.status === 200) {
            toast.success("User has been deleted");
            getData();
          }
        })
        .catch((error) => {
          toast.error("Failed to delete user: " + error.message);
        });
    }
  };

  const { SearchBar } = Search;
  let newData = [];
  data.map((item, index) => {
    newData.push({ sl: index + 1, ...item });
  });

  const editFormatter = (data, row) => {
    return (
      <span onClick={() => handleEdit(row.id)} className="btn btn-success">
        <i className="far fa-edit"></i>
      </span>
    );
  };

  const deleteFormatter = (data, row) => {
    return (
      <span onClick={() => handleDelete(row.id)} className="btn btn-danger">
        <i className="fa fa-trash"></i>
      </span>
    );
  };

  const columns = [
    { dataField: 'sl', text: 'SL' },
    { dataField: 'userName', text: 'User Name', sort: true },
    { dataField: 'age', text: 'Age', sort: true },
    { dataField: 'mobileNo', text: 'Mobile No' },
    { dataField: 'email', text: 'Email' },
    { dataField: 'address', text: 'Address' },
    { dataField: 'hasPayment', text: 'Has Payment' },
    { dataField: '', text: 'Edit', formatter: editFormatter },
    { dataField: '', text: 'Delete', formatter: deleteFormatter }
  ];

  const paginationOptions = {
    sizePerPage: rowsPerPage,
    hideSizePerPage: false,
    sizePerPageList: [
      { text: '10', value: 10 },
      { text: '25', value: 25 },
      { text: '50', value: 50 }
    ],
    onSizePerPageChange: (sizePerPage) => {
      setRowsPerPage(sizePerPage);
    }
  };

  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <div className="login-page d-flex justify-content-center min-vh-100">
        <Container className="dumps-practice-section py-5">
          <div className="home-page d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="col-8 floatingBox position-relative z-10">
              <h3 className="text-uppercase fw-bold mb-4 text-center text-green-600">User Subscription</h3>
              <form className="addUserForm">
                <div className="inputGroup">
                  <div className="form-group">
                    <label htmlFor="name" className="text-dark">User Full Name:</label>
                    <input
                      type="text"
                      id="name"
                      className="form-control rounded"
                      placeholder="Enter Full Name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="password" className="text-dark">Password:</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control rounded"
                      placeholder="Enter Password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="age" className="text-dark">Age:</label>
                    <input
                      type="number"
                      id="age"
                      className="form-control rounded"
                      placeholder="Enter Age"
                      value={age}
                      onChange={handleAgeChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="mobileNo" className="text-dark">Mobile No:</label>
                    <input
                      type="tel"
                      id="mobileNo"
                      className="form-control rounded"
                      placeholder="Enter Mobile No"
                      value={mobileNo}
                      onChange={handleMobileChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="email" className="text-dark">Email:</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control rounded"
                      placeholder="Enter Email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="address" className="text-dark">Address:</label>
                    <textarea
                      rows="3"
                      id="address"
                      className="form-control rounded"
                      placeholder="Enter Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="login mt-3">
                  <p className="text-dark text-center mb-0">{errorMsg && <span className="text-danger">{errorMsg}</span>}</p>
                </div>
                <div className="login mt-3 text-center">
                  <button
                    className="btn btn-primary fw-bold px-4 py-2 rounded-pill"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="tablePosition mt-5">
            <ToolkitProvider search>
              {(props) => (
                <div>
                  <SearchBar
                    {...props.searchProps}
                    className="mb-3 form-control rounded search-bar"
                    placeholder="Search users"
                  />
                  <BootstrapTable
                    {...props.baseProps}
                    keyField="id"
                    data={newData}
                    columns={columns}
                    striped
                    hover
                    condensed
                    pagination={paginationFactory(paginationOptions)}
                    wrapperClasses="table-responsive"
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>
        </Container>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="text-dark">
          <Modal.Title>Modify User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="inputGroup">
            <div className="form-group">
              <label htmlFor="editName" className="text-dark">User Name:</label>
              <input
                type="text"
                id="editName"
                className="form-control rounded"
                placeholder="Enter Name"
                value={editName}
                onChange={handleEditNameChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editPassword" className="text-dark">Password:</label>
              <input
                type="password"
                id="editPassword"
                className="form-control rounded"
                placeholder="Enter Password"
                value={editPassword}
                onChange={handleEditPasswordChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editAge" className="text-dark">Age:</label>
              <input
                type="number"
                id="editAge"
                className="form-control rounded"
                placeholder="Enter Age"
                value={editAge}
                onChange={handleEditAgeChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editMobileNo" className="text-dark">Mobile No:</label>
              <input
                type="tel"
                id="editMobileNo"
                className="form-control rounded"
                placeholder="Enter Mobile No"
                value={editMobileNo}
                onChange={handleEditMobileChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editEmail" className="text-dark">Email:</label>
              <input
                type="email"
                id="editEmail"
                className="form-control rounded"
                placeholder="Enter Email"
                value={editEmail}
                onChange={handleEditEmailChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editAddress" className="text-dark">Address:</label>
              <textarea
                rows="3"
                id="editAddress"
                className="form-control rounded"
                placeholder="Enter Address"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-dark text-center mb-0">{errorMsg && <span className="text-danger">{errorMsg}</span>}</p>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" className="fw-bold" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </Fragment>
  );
};

export default UserSubscription;