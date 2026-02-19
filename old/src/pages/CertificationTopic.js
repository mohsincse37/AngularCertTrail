import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../components/API_URL";
import '../styles/common.css';
import '../styles/login.css';

const CertificationTopic = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const [topicTitle, setTopicTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [isActive, setIsActive] = useState(1);
  const [isFree, setIsFree] = useState(0);

  const [editID, setEditId] = useState('');
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editDetail, setEditDetail] = useState('');
  const [editIsActive, setEditIsActive] = useState(0);
  const [editIsFree, setEditIsFree] = useState(0);

  const [image, setImage] = useState('');
  const [errorMsg, setError] = useState('');
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Replace with API call to fetch certification topics
    pageAuthorization();
  }, []);

  const pageAuthorization = () => {
    const url = API_URL + 'api/PageAuthorization/CheckingAuthority';
    const data = {
      "pageName": "/CertificationTopic",
    }
    axios.post(url, data)
      .then((result) => {
        if (result.data.authorityMsg == 'isValidAuthor') {
          getData();
        }
        else {
          console.log("You are not authorized !!");
          navigate("/Login");
        }

      }).catch((error) => {
        toast.error(error);
      })
  };
   const getData = () => {
    axios.get(API_URL + 'api/CertificationTopic/GetCertificationTopics')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }
  const handleImage = (e) => {
    const value = e.target.files[0];
    setImage(value);
  };

  const handleTopicTitleChange = (e) => {
    const value = e.target.value;
    setTopicTitle(value);
    if (value) setError('');
  };

  const handleEditTopicTitleChange = (e) => {
    const value = e.target.value;
    setEditTopicTitle(value);
    if (value) setError('');
  };

  const handleEdit = (id) => {
    handleShow();
    const topic = data.find(item => item.id === id);
    if (topic) {
      setEditTopicTitle(topic.topicTitle);
      setEditDetail(topic.detail);
      setEditIsActive(topic.isActive);
      setEditIsFree(topic.isPublicTopic);
      setEditId(id);
    }
  };

  const handleUpdate = () => {
    if (!editTopicTitle) {
      setError('Topic Title is required.');
      return;
    }

    const updatedTopic = {
      id: editID,
      topicTitle: editTopicTitle,
      detail: editDetail,
      isActive: editIsActive,
      isPublicTopic: editIsFree,
      topicImgPath: data.find(item => item.id === editID)?.topicImgPath || '',
    };
    const updatedData = data.map(item => (item.id === editID ? updatedTopic : item));
    setData(updatedData);
    toast.success("Topic has been updated");
    handleClose();
    clear();
  };

  const handleSave = () => {
    if (!topicTitle) {
      setError('Topic Title is required.');
      return;
    }

    // Generate a unique ID by finding the max ID and incrementing
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
    const newId = maxId + 1;

    const newTopic = {
      id: newId,
      topicTitle: topicTitle,
      detail: detail,
      isActive: isActive,
      isPublicTopic: isFree,
      topicImgPath: image ? `/images/${image.name}` : '',
    };
    setData([...data, newTopic]);
    toast.success("Topic has been added");
    clear();
  };

  const clear = () => {
    setTopicTitle('');
    setDetail('');
    setIsActive(0);
    setIsFree(0);
    setEditTopicTitle('');
    setEditDetail('');
    setEditIsActive(0);
    setEditIsFree(0);
    setEditId('');
    setImage('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete') === true) {
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      toast.success("Topic has been deleted");
    }
  };

  const handleActiveChange = (e) => {
    if (e.target.checked) setIsActive(1);
    else setIsActive(0);
  };

  const handleEditActiveChange = (e) => {
    if (e.target.checked) setEditIsActive(1);
    else setEditIsActive(0);
  };

  const handleFreeChange = (e) => {
    if (e.target.checked) setIsFree(1);
    else setIsFree(0);
  };

  const handleEditFreeChange = (e) => {
    if (e.target.checked) setEditIsFree(1);
    else setEditIsFree(0);
  };

  const { SearchBar } = Search;
  const newData = data.map((item, index) => ({
    sl: index + 1,
    ...item,
  }));

  const imageFormatter = (data, row) => {
    return <img className="imgSize" src={row.topicImgPath} alt={row.topicTitle} />;
  };

  const editFormatter = (data, row) => {
    return <span onClick={() => handleEdit(row.id)} className='btn btn-success'><i className="far fa-edit"></i></span>;
  };

  const deleteFormatter = (data, row) => {
    return <span onClick={() => handleDelete(row.id)} className='btn btn-danger'><i className="fa fa-trash"></i></span>;
  };

  const columns = [
    {
      dataField: 'sl',
      text: 'SL',
    },
    {
      dataField: 'topicTitle',
      text: 'Topic Title',
      sort: true,
    },
    {
      dataField: 'detail',
      text: 'Detail',
    },
    {
      dataField: 'isActive',
      text: 'Is Active',
      sort: true,
      formatter: (cell) => (cell === 1 ? "Yes" : "No"),
    },
    {
      dataField: 'isPublicTopic',
      text: 'Is Free',
      sort: true,
      formatter: (cell) => (cell === 1 ? "Yes" : "No"),
    },
    {
      dataField: 'topicImgPath',
      text: 'Image',
      formatter: imageFormatter,
    },
    {
      dataField: '',
      text: 'Edit',
      formatter: editFormatter,
    },
    {
      dataField: '',
      text: 'Delete',
      formatter: deleteFormatter,
    },
  ];

  const paginationOptions = {
    sizePerPage: rowsPerPage,
    hideSizePerPage: false,
    sizePerPageList: [
      { text: '10', value: 10 },
      { text: '25', value: 25 },
      { text: '50', value: 50 },
    ],
    onSizePerPageChange: (sizePerPage) => {
      setRowsPerPage(sizePerPage);
    },
  };

  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <div className="login-page d-flex justify-content-center min-vh-100 ">
        <Container className="dumps-practice-section py-5">
          <div className="home-page d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            {/* Form container */}
            <div className="col-8 floatingBox position-relative z-10">
              <h3 className=" text-uppercase fw-bold mb-4">Certification Topic</h3>
              <form className="addUserForm">
                <div className="inputGroup">
                  <label htmlFor="topicTitle" className="">Topic Title:</label>
                  <input
                    type="text"
                    id="topicTitle"
                    className="form-control rounded"
                    placeholder="Enter Topic Title"
                    value={topicTitle}
                    onChange={handleTopicTitleChange}
                  />
                  <label htmlFor="detail" className="">Detail:</label>
                  <textarea
                    rows="3"
                    id="detail"
                    className="form-control rounded"
                    placeholder="Enter Detail"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                  <label className="">Is Active:</label>
                  <input
                    type="checkbox"
                    checked={isActive === 1}
                    onChange={(e) => handleActiveChange(e)}
                    value="isActive"
                  />
                  <label className="">Is Free:</label>
                  <input
                    type="checkbox"
                    checked={isFree === 1}
                    onChange={(e) => handleFreeChange(e)}
                    value="isFree"
                  />
                  <label htmlFor="file" className="">Upload:</label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    className="form-control rounded"
                    placeholder="Choose File"
                    onChange={handleImage}
                  />
                </div>
              </form>
              <div className="login">
                <p className=" text-center mb-0">{errorMsg && <span className="text-danger">{errorMsg}</span>}</p>
              </div>
              <div className="login">
                <button
                  className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-pill"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="tablePosition mt-5">
            <ToolkitProvider search>
              {props => (
                <div>
                  <SearchBar {...props.searchProps} className="mb-3 form-control rounded search-bar" placeholder="Search" />
                  {newData.length > 0 ? (
                    <BootstrapTable
                      {...props.baseProps}
                      keyField='id'
                      data={newData}
                      columns={columns}
                      hover
                      condensed
                      pagination={paginationFactory(paginationOptions)}
                      wrapperClasses="table-responsive"
                    />
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              )}
            </ToolkitProvider>
          </div>
        </Container>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className=" ">
          <Modal.Title>Modify Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="inputGroup">
            <label htmlFor="editTopicTitle" className="text-dark">Topic Title:</label>
            <input
              type="text"
              id="editTopicTitle"
              className="form-control rounded"
              placeholder="Enter Topic Title"
              value={editTopicTitle}
              onChange={handleEditTopicTitleChange}
            />
            <label htmlFor="editDetail" className="text-dark">Detail:</label>
            <textarea
              rows="3"
              id="editDetail"
              className="form-control rounded"
              placeholder="Enter Detail"
              value={editDetail}
              onChange={(e) => setEditDetail(e.target.value)}
            />
            <label className="text-dark">Is Active:</label>
            <input
              type="checkbox"
              checked={editIsActive === 1}
              onChange={(e) => handleEditActiveChange(e)}
              value="editIsActive"
            />
            <label className="text-dark">Is Free:</label>
            <input
              type="checkbox"
              checked={editIsFree === 1}
              onChange={(e) => handleEditFreeChange(e)}
              value="editIsFree"
            />
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
        </Modal.Body>
        <Modal.Footer className="">
          <p className=" text-center mb-0">{errorMsg && <span className="text-danger">{errorMsg}</span>}</p>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="warning" className="text-dark fw-bold" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </Fragment>
  );
};

export default CertificationTopic;