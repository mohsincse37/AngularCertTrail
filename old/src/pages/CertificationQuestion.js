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

const CertificationQuestion = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [topicID, setTopicId] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [optionType, setOptionType] = useState('');
  const [isActive, setIsActive] = useState(1);
  const [questionNo, setQuestionNo] = useState('');
  const [editID, setEditId] = useState('');
  const [editTopicId, setEditTopicId] = useState('');
  const [editQuestionTitle, setEditQuestionTitle] = useState('');
  const [editOptionType, setEditOptionType] = useState('');
  const [editIsActive, setEditIsActive] = useState(0);
  const [editQuestionNo, setEditQuestionNo] = useState('');
  const [image, setImage] = useState('');
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
    const data = { pageName: "/CertificationQuestion" };
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

  const getMaxQuestionNoByTopicID = (topicID) => {
    axios.get(API_URL + 'api/CertificationQuestion/GetMaxQuestionNo/' + topicID)
      .then((result) => {
        if (!result.data.questionNo) setQuestionNo(1);
        else setQuestionNo(result.data.questionNo + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImage = (e) => {
    const value = e.target.files[0];
    setImage(value);
  };

  const handleOptionTypeChange = (e) => {
    const value = e.target.value;
    setOptionType(value);
    if (value) setError('');
  };

  const handleTopicIDChange = (e) => {
    const value = e.target.value;
    setTopicId(value);
    if (value) {
      setError('');
      getMaxQuestionNoByTopicID(value);
    } else {
      setQuestionNo('');
    }
  };

  const handleQuestionTitleChange = (e) => {
    const value = e.target.value;
    setQuestionTitle(value);
    if (value) setError('');
  };

  const handleEditOptionTypeChange = (e) => {
    const value = e.target.value;
    setEditOptionType(value);
    if (value) setError('');
  };

  const handleEditQuestionTitleChange = (e) => {
    const value = e.target.value;
    setEditQuestionTitle(value);
    if (value) setError('');
  };

  const handleEditTopicIDChange = (e) => {
    const value = e.target.value;
    setEditTopicId(value);
    if (value) setError('');
  };

  const getTopicData = () => {
    axios.get(API_URL + 'api/CertificationTopic/GetCertificationTopics')
      .then((result) => {
        setTopicData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = () => {
    axios.get(API_URL + 'api/CertificationQuestion/GetCertificationQuestion')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios.get(API_URL + 'api/CertificationQuestion/GetCertificationQuestion/' + id)
      .then((result) => {
        setEditQuestionNo(result.data.questionNo);
        setEditQuestionTitle(result.data.questionTitle);
        setEditTopicId(result.data.topicID);
        setEditIsActive(result.data.isActive);
        setEditOptionType(result.data.optionType);
        setEditId(id);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleUpdate = () => {
    if (!editTopicId) {
      setError('Topic is required.');
      return;
    }
    if (!editQuestionTitle) {
      setError('Question Title is required.');
      return;
    }
    if (!editOptionType) {
      setError('Option Type is required.');
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("id", editID);
    formData.append("topicID", editTopicId);
    formData.append("questionNo", editQuestionNo);
    formData.append("questionTitle", editQuestionTitle);
    formData.append("isActive", editIsActive);
    formData.append("fileName", editQuestionTitle);
    formData.append("optionType", editOptionType);

    axios.put(API_URL + 'api/CertificationQuestion/UpdateCertificationQuestion/' + editID, formData)
      .then((result) => {
        toast.success("Question has been updated");
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
    if (!questionTitle) {
      setError('Question Title is required.');
      return;
    }
    if (!optionType) {
      setError('Option Type is required.');
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("topicID", topicID);
    formData.append("questionNo", questionNo);
    formData.append("questionTitle", questionTitle);
    formData.append("isActive", isActive);
    formData.append("fileName", questionTitle);
    formData.append("optionType", optionType);

    axios.post(API_URL + 'api/CertificationQuestion/AddCertificationQuestion', formData)
      .then((result) => {
        toast.success("Question has been added");
        getData();
        clear();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setTopicId('');
    setQuestionTitle('');
    setOptionType('');
    setIsActive(1);
    setQuestionNo('');
    setEditTopicId('');
    setEditQuestionTitle('');
    setEditOptionType('');
    setEditIsActive(0);
    setEditQuestionNo('');
    setEditId('');
    setImage('');
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      axios.delete(API_URL + 'api/CertificationQuestion/DeleteCertificationQuestion/' + id)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Question has been deleted");
            getData();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleActiveChange = (e) => {
    setIsActive(e.target.checked ? 1 : 0);
  };

  const handleEditActiveChange = (e) => {
    setEditIsActive(e.target.checked ? 1 : 0);
  };

  const { SearchBar } = Search;
  let newData = [];
  data.map((item, index) => {
    newData.push({ sl: index + 1, ...item });
  });

  const imageFormatter = (data, row) => {
    return <img className="imgSize" src={API_URL + row.questionImgPath} alt={row.questionTitle} />;
  };

  const editFormatter = (data, row) => {
    return <span onClick={() => handleEdit(row.id)} className='btn btn-success'><i className="far Workshops in Bangalore fa-edit"></i></span>;
  };

  const deleteFormatter = (data, row) => {
    return <span onClick={() => handleDelete(row.id)} className='btn btn-danger'><i className="fa fa-trash"></i></span>;
  };

  const columns = [
    { dataField: 'sl', text: 'SL' },
    { dataField: 'topicTitle', text: 'Topic', sort: true },
    { dataField: 'questionTitle', text: 'Question Title', sort: true },
    { dataField: 'correctOptionTitle', text: 'Correct Answer' },
    { dataField: 'optionTypeText', text: 'Option Type' },
    {
      dataField: 'isActive',
      text: 'Is Active',
      sort: true,
      formatter: (cell) => (cell === 1 ? "Yes" : "No")
    },
    { dataField: 'questionImgPath', text: 'Image', formatter: imageFormatter },
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
              <h3 className="text-uppercase fw-bold mb-4 text-center text-green-600">Certification Question</h3>
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
                    <label htmlFor="questionNo" className="text-dark">Question No:</label>
                    <input
                      type="text"
                      id="questionNo"
                      className="form-control rounded"
                      value={questionNo}
                      readOnly
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="questionTitle" className="text-dark">Question Title:</label>
                    <input
                      type="text"
                      id="questionTitle"
                      className="form-control rounded"
                      placeholder="Enter Question Title"
                      value={questionTitle}
                      onChange={handleQuestionTitleChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="optionType" className="text-dark">Option Type:</label>
                    <select
                      id="optionType"
                      className="form-select rounded"
                      value={optionType}
                      onChange={handleOptionTypeChange}
                    >
                      <option value="">Select</option>
                      <option value={1}>Radio Button</option>
                      <option value={2}>Check Box</option>
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label className="text-dark">Is Active:</label>
                    <input
                      className="ms-2"
                      type="checkbox"
                      checked={isActive === 1}
                      onChange={handleActiveChange}
                      value="isActive"
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
          <Modal.Title>Modify Question</Modal.Title>
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
              <label htmlFor="editQuestionNo" className="text-dark">Question No:</label>
              <input
                type="text"
                id="editQuestionNo"
                className="form-control rounded"
                value={editQuestionNo}
                readOnly
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editQuestionTitle" className="text-dark">Question Title:</label>
              <input
                type="text"
                id="editQuestionTitle"
                className="form-control rounded"
                placeholder="Enter Question Title"
                value={editQuestionTitle}
                onChange={handleEditQuestionTitleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="editOptionType" className="text-dark">Option Type:</label>
              <select
                id="editOptionType"
                className="form-select rounded"
                value={editOptionType}
                onChange={handleEditOptionTypeChange}
              >
                <option value="">Select</option>
                <option value={1}>Radio Button</option>
                <option value={2}>Check Box</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label className="text-dark">Is Active:</label>
              <input
                className="ms-2"
                type="checkbox"
                checked={editIsActive === 1}
                onChange={handleEditActiveChange}
                value="editIsActive"
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

export default CertificationQuestion;