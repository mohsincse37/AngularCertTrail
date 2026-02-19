import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
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

const CertificationScheme = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [topicID, setTopicID] = useState('');
  const [accessType, setAccessType] = useState('');
  const [accessDuration, setAccessDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [amountUnit, setAmountUnit] = useState('');
  const [editID, setEditId] = useState('');
  const [editTopicID, setEditTopicID] = useState('');
  const [editAccessType, setEditAccessType] = useState('');
  const [editAccessDuration, setEditAccessDuration] = useState('');
  const [editDurationUnit, setEditDurationUnit] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editAmountUnit, setEditAmountUnit] = useState('');
  const [errorMsg, setError] = useState('');
  const [data, setData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    pageAuthorization();
  }, []);

  const pageAuthorization = () => {
    const url = API_URL + 'api/PageAuthorization/CheckingAuthority';
    const data = { pageName: "/CertificationScheme" };
    axios.post(url, data)
      .then((result) => {
        if (result.data.authorityMsg === 'isValidAuthor') {
          getTopicData();
          getData();
        } else {
          console.log("You are not authorized !!");
          navigate("/Login");
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleAccessTypeChange = (e) => {
    const value = e.target.value;
    setAccessType(value);
    if (value) setError('');
  };

  const handleTopicIDChange = (e) => {
    const value = e.target.value;
    setTopicID(value);
    if (value) setError('');
  };

  const handleAccessDurationChange = (e) => {
    const value = e.target.value;
    setAccessDuration(value);
    if (value) setError('');
  };

  const handleDurationUnitChange = (e) => {
    const value = e.target.value;
    setDurationUnit(value);
    if (value) setError('');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (value) setError('');
  };

  const handleAmountUnitChange = (e) => {
    const value = e.target.value;
    setAmountUnit(value);
    if (value) setError('');
  };

  const handleEditAccessTypeChange = (e) => {
    const value = e.target.value;
    setEditAccessType(value);
    if (value) setError('');
  };

  const handleEditTopicIDChange = (e) => {
    const value = e.target.value;
    setEditTopicID(value);
    if (value) setError('');
  };

  const handleEditAccessDurationChange = (e) => {
    const value = e.target.value;
    setEditAccessDuration(value);
    if (value) setError('');
  };

  const handleEditDurationUnitChange = (e) => {
    const value = e.target.value;
    setEditDurationUnit(value);
    if (value) setError('');
  };

  const handleEditAmountChange = (e) => {
    const value = e.target.value;
    setEditAmount(value);
    if (value) setError('');
  };

  const handleEditAmountUnitChange = (e) => {
    const value = e.target.value;
    setEditAmountUnit(value);
    if (value) setError('');
  };

  const getTopicData = () => {
    axios.get(API_URL + 'api/CertificationTopic/GetActiveNonFreeCertificationTopics')
      .then((result) => {
        setTopicData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = () => {
    axios.get(API_URL + 'api/CertificationScheme/GetCertificationSchemes')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios.get(API_URL + 'api/CertificationScheme/GetCertificationScheme/' + id)
      .then((result) => {
        setEditAccessType(result.data.accessType);
        setEditTopicID(result.data.topicID);
        setEditAccessDuration(result.data.accessDuration);
        setEditDurationUnit(result.data.durationUnit);
        setEditAmount(result.data.amount);
        setEditAmountUnit(result.data.amountUnit);
        setEditId(id);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleUpdate = () => {
    if (!editTopicID) {
      setError('Topic is required.');
      return;
    }
    if (!editAccessType) {
      setError('Access Type is required.');
      return;
    }
    if (!editAccessDuration) {
      setError('Access Duration is required.');
      return;
    }
    if (!editDurationUnit) {
      setError('Duration Unit is required.');
      return;
    }
    if (!editAmount) {
      setError('Amount is required.');
      return;
    }
    if (!editAmountUnit) {
      setError('Amount Unit is required.');
      return;
    }

    const url = API_URL + 'api/CertificationScheme/UpdateCertificationScheme/' + editID;
    const data = {
      id: editID,
      accessType: editAccessType,
      topicID: editTopicID,
      accessDuration: editAccessDuration,
      durationUnit: editDurationUnit,
      amount: editAmount,
      amountUnit: editAmountUnit
    };
    axios.put(url, data)
      .then((result) => {
        toast.success("Scheme has been updated");
        handleClose();
        getData();
        clear();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = () => {
    if (!topicID) {
      setError('Topic is required.');
      return;
    }
    if (!accessType) {
      setError('Access Type is required.');
      return;
    }
    if (!accessDuration) {
      setError('Access Duration is required.');
      return;
    }
    if (!durationUnit) {
      setError('Duration Unit is required.');
      return;
    }
    if (!amount) {
      setError('Amount is required.');
      return;
    }
    if (!amountUnit) {
      setError('Amount Unit is required.');
      return;
    }

    const url = API_URL + 'api/CertificationScheme/AddCertificationScheme';
    const data = {
      accessType: accessType,
      topicID: topicID,
      accessDuration: accessDuration,
      durationUnit: durationUnit,
      amount: amount,
      amountUnit: amountUnit
    };

    axios.post(url, data)
      .then((result) => {
        toast.success("Scheme has been added");
        getData();
        clear();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setAccessType('');
    setTopicID('');
    setAccessDuration('');
    setDurationUnit('');
    setAmount('');
    setAmountUnit('');
    setEditAccessType('');
    setEditTopicID('');
    setEditAccessDuration('');
    setEditDurationUnit('');
    setEditAmount('');
    setEditAmountUnit('');
    setEditId('');
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      axios.delete(API_URL + 'api/CertificationScheme/DeleteCertificationScheme/' + id)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Scheme has been deleted");
            getData();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const { SearchBar } = Search;
  let newData = [];
  data.map((item, index) => {
    newData.push({ sl: index + 1, ...item });
  });

  const editFormatter = (data, row) => {
    return <span onClick={() => handleEdit(row.id)} className='btn btn-success'><i className="far fa-edit"></i></span>;
  };

  const deleteFormatter = (data, row) => {
    return <span onClick={() => handleDelete(row.id)} className='btn btn-danger'><i className="fa fa-trash"></i></span>;
  };

  const columns = [
    { dataField: 'sl', text: 'SL' },
    { dataField: 'topicTitle', text: 'Topic Title', sort: true },
    { dataField: 'accessTypeText', text: 'Access Type', sort: true },
    { dataField: 'accessDuration', text: 'Access Duration', sort: true },
    { dataField: 'durationUnitText', text: 'Duration Unit' },
    { dataField: 'amount', text: 'Amount', sort: true },
    { dataField: 'amountUnit', text: 'Amount Unit' },
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
              <h3 className="text-uppercase fw-bold mb-4 text-center text-green-600">Certification Scheme</h3>
              <form className="addUserForm">
                <div className="inputGroup">
                  <div className="form-group">
                    <label htmlFor="topicID" className="text-dark">Topic:</label>
                    <select
                      id="topicID"
                      className="form-select rounded"
                      value={topicID}
                      onChange={handleTopicIDChange}
                    >
                      <option value="">Select</option>
                      {topicData.map((topic) => (
                        <option key={topic.id} value={topic.id}>{topic.topicTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="accessType" className="text-dark">Access Type:</label>
                    <select
                      id="accessType"
                      className="form-select rounded"
                      value={accessType}
                      onChange={handleAccessTypeChange}
                    >
                      <option value="">Select</option>
                      <option value={1}>Online practice + Download pdf</option>
                      <option value={2}>Online practice</option>
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="accessDuration" className="text-dark">Access Duration:</label>
                    <select
                      id="accessDuration"
                      className="form-select rounded"
                      value={accessDuration}
                      onChange={handleAccessDurationChange}
                    >
                      <option value="">Select</option>
                      <option value={3}>3</option>
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="durationUnit" className="text-dark">Duration Unit:</label>
                    <select
                      id="durationUnit"
                      className="form-select rounded"
                      value={durationUnit}
                      onChange={handleDurationUnitChange}
                    >
                      <option value="">Select</option>
                      <option value={1}>Months</option>
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="amount" className="text-dark">Amount:</label>
                    <input
                      type="text"
                      id="amount"
                      className="form-control rounded"
                      placeholder="Enter Amount"
                      value={amount}
                      onChange={handleAmountChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="amountUnit" className="text-dark">Amount Unit:</label>
                    <input
                      type="text"
                      id="amountUnit"
                      className="form-control rounded"
                      placeholder="Enter Amount Unit"
                      value={amountUnit}
                      onChange={handleAmountUnitChange}
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
                    placeholder="Search"
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
          <Modal.Title>Modify Scheme</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="inputGroup">
            <div className="form-group">
              <label htmlFor="editTopicID" className="text-dark">Topic:</label>
              <select
                id="editTopicID"
                className="form-select rounded"
                value={editTopicID}
                onChange={handleEditTopicIDChange}
              >
                <option value="">Select</option>
                {topicData.map((topic) => (
                  <option key={topic.id} value={topic.id}>{topic.topicTitle}</option>
                ))}
              </select>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editAccessType" className="text-dark">Access Type:</label>
              <select
                id="editAccessType"
                className="form-select rounded"
                value={editAccessType}
                onChange={handleEditAccessTypeChange}
              >
                <option value="">Select</option>
                <option value={1}>Online practice + Download pdf</option>
                <option value={2}>Online practice</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editAccessDuration" className="text-dark">Access Duration:</label>
              <select
                id="editAccessDuration"
                className="form-select rounded"
                value={editAccessDuration}
                onChange={handleEditAccessDurationChange}
              >
                <option value="">Select</option>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editDurationUnit" className="text-dark">Duration Unit:</label>
              <select
                id="editDurationUnit"
                className="form-select rounded"
                value={editDurationUnit}
                onChange={handleEditDurationUnitChange}
              >
                <option value="">Select</option>
                <option value={1}>Months</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editAmount" className="text-dark">Amount:</label>
              <input
                type="text"
                id="editAmount"
                className="form-control rounded"
                placeholder="Enter Amount"
                value={editAmount}
                onChange={handleEditAmountChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editAmountUnit" className="text-dark">Amount Unit:</label>
              <input
                type="text"
                id="editAmountUnit"
                className="form-control rounded"
                placeholder="Enter Amount Unit"
                value={editAmountUnit}
                onChange={handleEditAmountUnitChange}
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

export default CertificationScheme;