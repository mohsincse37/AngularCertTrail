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

const QuestionOption = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [topicID, setTopicId] = useState('');
  const [questionID, setQuestionId] = useState('');
  const [optionTitle, setOptionTitle] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [editID, setEditId] = useState('');
  const [editTopicId, setEditTopicId] = useState('');
  const [editQuestionId, setEditQuestionId] = useState('');
  const [editOptionTitle, setEditOptionTitle] = useState('');
  const [editOrderNo, setEditOrderNo] = useState('');
  const [image, setImage] = useState('');
  const [errorMsg, setError] = useState('');
  const [data, setData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    pageAuthorization();
  }, []);

  const pageAuthorization = () => {
    const url = API_URL + 'api/PageAuthorization/CheckingAuthority';
    const data = { pageName: "/QuestionOption" };
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

  const handleImage = (e) => {
    const value = e.target.files[0];
    setImage(value);
  };

  const handleTopicIDChange = (e) => {
    const value = e.target.value;
    setTopicId(value);
    setQuestionId(''); // Reset question when topic changes
    if (value) {
      setError('');
      getQuestionDataByTopicID(value);
    } else {
      setQuestionData([]); // Clear questions if no topic is selected
    }
  };

  const handleQuestionIDChange = (e) => {
    const value = e.target.value;
    setQuestionId(value);
    if (value) setError('');
  };

  const handleOptionTitleChange = (e) => {
    const value = e.target.value;
    setOptionTitle(value);
    if (value) setError('');
  };

  const handleOrderNoChange = (e) => {
    const value = e.target.value;
    setOrderNo(value);
    if (value) setError('');
  };

  const handleEditTopicIDChange = (e) => {
    const value = e.target.value;
    setEditTopicId(value);
    setEditQuestionId(''); // Reset question when topic changes
    if (value) {
      setError('');
      getQuestionDataByTopicID(value);
    } else {
      setQuestionData([]); // Clear questions if no topic is selected
    }
  };

  const handleEditQuestionIDChange = (e) => {
    const value = e.target.value;
    setEditQuestionId(value);
    if (value) setError('');
  };

  const handleEditOptionTitleChange = (e) => {
    const value = e.target.value;
    setEditOptionTitle(value);
    if (value) setError('');
  };

  const handleEditOrderNoChange = (e) => {
    const value = e.target.value;
    setEditOrderNo(value);
    if (value) setError('');
  };

  const getTopicData = () => {
    axios.get(API_URL + 'api/CertificationTopic/GetCertificationTopics')
      .then((result) => {
        setTopicData(result.data);
      })
      .catch((error) => {
        toast.error("Failed to load topics: " + error.message);
      });
  };

  const getQuestionDataByTopicID = (topicID) => {
    axios.get(API_URL + 'api/CertificationQuestion/GetQuestionDataByTopicID/' + topicID)
      .then((result) => {
        setQuestionData(result.data);
      })
      .catch((error) => {
        toast.error("Failed to load questions: " + error.message);
      });
  };

  const getData = () => {
    axios.get(API_URL + 'api/QuestionOption/GetQuestionOption')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        toast.error("Failed to load options: " + error.message);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios.get(API_URL + 'api/QuestionOption/GetQuestionWithTopicWithOption/' + id)
      .then((result) => {
        setEditTopicId(result.data.topicID);
        getQuestionDataByTopicID(result.data.topicID);
        setEditQuestionId(result.data.questionID);
        setEditOptionTitle(result.data.optionTitle);
        setEditOrderNo(result.data.orderNo);
        setEditId(id);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleUpdate = () => {
    if (!editQuestionId) {
      setError('Question is required.');
      return;
    }
    if (!editOptionTitle) {
      setError('Option Title is required.');
      return;
    }
    if (!editOrderNo) {
      setError('Order No is required.');
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("id", editID);
    formData.append("questionID", editQuestionId);
    formData.append("optionTitle", editOptionTitle);
    formData.append("orderNo", editOrderNo);
    formData.append("fileName", editOptionTitle);

    axios.put(API_URL + 'api/QuestionOption/UpdateQuestionOption/' + editID, formData)
      .then((result) => {
        toast.success("Option has been updated");
        handleClose();
        getData();
        clear();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = () => {
    if (!questionID) {
      setError('Question is required.');
      return;
    }
    if (!optionTitle) {
      setError('Option Title is required.');
      return;
    }
    if (!orderNo) {
      setError('Order No is required.');
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("questionID", questionID);
    formData.append("optionTitle", optionTitle);
    formData.append("orderNo", orderNo);
    formData.append("fileName", optionTitle);

    axios.post(API_URL + 'api/QuestionOption/AddQuestionOption', formData)
      .then((result) => {
        toast.success("Option has been added");
        getData();
        clear();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setTopicId('');
    setQuestionId('');
    setOptionTitle('');
    setOrderNo('');
    setEditTopicId('');
    setEditQuestionId('');
    setEditOptionTitle('');
    setEditOrderNo('');
    setEditId('');
    setImage('');
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      axios.delete(API_URL + 'api/QuestionOption/DeleteQuestionOption/' + id)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Option has been deleted");
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

  const imageFormatter = (data, row) => {
    return <img className="imgSize" src={API_URL + row.optionImgPath} alt={row.optionTitle} />;
  };

  const editFormatter = (data, row) => {
    return <span onClick={() => handleEdit(row.id)} className='btn btn-success'><i className="far fa-edit"></i></span>;
  };

  const deleteFormatter = (data, row) => {
    return <span onClick={() => handleDelete(row.id)} className='btn btn-danger'><i className="fa fa-trash"></i></span>;
  };

  const columns = [
    { dataField: 'sl', text: 'SL' },
    { dataField: 'questionTitle', text: 'Question', sort: true },
    { dataField: 'optionTitle', text: 'Option Title', sort: true },
    { dataField: 'orderNo', text: 'Order No', sort: true },
    { dataField: 'optionImgPath', text: 'Image', formatter: imageFormatter },
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
              <h3 className="text-uppercase fw-bold mb-4 text-center text-green-600">Question Option</h3>
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
                      {topicData.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.topicTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="questionID" className="text-dark">Question:</label>
                    <select
                      id="questionID"
                      className="form-select rounded"
                      value={questionID}
                      onChange={handleQuestionIDChange}
                    >
                      <option value="">Select</option>
                      {questionData.map(question => (
                        <option key={question.id} value={question.id}>{question.questionTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="optionTitle" className="text-dark">Option Title:</label>
                    <input
                      type="text"
                      id="optionTitle"
                      className="form-control rounded"
                      placeholder="Enter Option Title"
                      value={optionTitle}
                      onChange={handleOptionTitleChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="orderNo" className="text-dark">Order No:</label>
                    <input
                      type="text"
                      id="orderNo"
                      className="form-control rounded"
                      placeholder="Enter Order No"
                      value={orderNo}
                      onChange={handleOrderNoChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="file" className="text-dark">Upload:</label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      className="form-control rounded"
                      placeholder="Choose File"
                      onChange={handleImage}
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
          <Modal.Title>Modify Option</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="inputGroup">
            <div className="form-group">
              <label htmlFor="editTopicId" className="text-dark">Topic:</label>
              <select
                id="editTopicId"
                className="form-select rounded"
                value={editTopicId}
                onChange={handleEditTopicIDChange}
              >
                <option value="">Select</option>
                {topicData.map((topic) => (
                  <option key={topic.id} value={topic.id}>{topic.topicTitle}</option>
                ))}
              </select>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editQuestionId" className="text-dark">Question:</label>
              <select
                id="editQuestionId"
                className="form-select rounded"
                value={editQuestionId}
                onChange={handleEditQuestionIDChange}
              >
                <option value="">Select</option>
                {questionData.map((question) => (
                  <option key={question.id} value={question.id}>{question.questionTitle}</option>
                ))}
              </select>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editOptionTitle" className="text-dark">Option Title:</label>
              <input
                type="text"
                id="editOptionTitle"
                className="form-control rounded"
                placeholder="Enter Option Title"
                value={editOptionTitle}
                onChange={handleEditOptionTitleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editOrderNo" className="text-dark">Order No:</label>
              <input
                type="text"
                id="editOrderNo"
                className="form-control rounded"
                placeholder="Enter Order No"
                value={editOrderNo}
                onChange={handleEditOrderNoChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editFile" className="text-dark">Upload:</label>
              <input
                type="file"
                id="editFile"
                name="file"
                className="form-control rounded"
                placeholder="Choose File"
                onChange={handleImage}
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

export default QuestionOption;