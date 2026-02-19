import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import Header from "../components/Header";
import { API_URL } from "../components/API_URL";
import '../styles/CustomCss.css';
import HeroSection from "../components/HeroSection";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";

// Dummy data for topics
const dummyTopics = [
  {
    topicID: 1,
    topicImgPath: "/images/topic1.jpg",
    topicTitle: "Introduction to Python",
    topicDetail: "Learn the basics of Python programming.",
    accessTypeText: "Full Access",
    accessDuration: 3,
    durationUnitText: " Months",
    amount: 49.99,
    amountUnit: " USD",
  },
  {
    topicID: 2,
    topicImgPath: "/images/topic2.jpg",
    topicTitle: "Web Development with React",
    topicDetail: "Build modern web applications using React.",
    accessTypeText: "Standard Access",
    accessDuration: 6,
    durationUnitText: " Months",
    amount: 79.99,
    amountUnit: " USD",
  },
  {
    topicID: 3,
    topicImgPath: "/images/topic3.jpg",
    topicTitle: "Data Science Fundamentals",
    topicDetail: "Explore data analysis and visualization techniques.",
    accessTypeText: "Premium Access",
    accessDuration: 12,
    durationUnitText: " Months",
    amount: 99.99,
    amountUnit: " USD",
  },
];

// Dummy access types
const dummyAccessTypes = [
  { id: 1, accessType: 1, accessTypeText: "Full Access" },
  { id: 2, accessType: 2, accessTypeText: "Standard Access" },
  { id: 3, accessType: 3, accessTypeText: "Premium Access" },
];

// Dummy duration types
const dummyDurationTypes = [
  { id: 1, accessDuration: 3, durationUnitText: " Months" },
  { id: 2, accessDuration: 6, durationUnitText: " Months" },
  { id: 3, accessDuration: 12, durationUnitText: " Months" },
];

// Dummy amount data
const dummyAmountData = [
  { topicID: 1, accessType: 1, durationType: 3, amounText: "49.99 USD" },
  { topicID: 1, accessType: 2, durationType: 6, amounText: "69.99 USD" },
  { topicID: 1, accessType: 3, durationType: 12, amounText: "89.99 USD" },
  { topicID: 2, accessType: 1, durationType: 3, amounText: "79.99 USD" },
  { topicID: 2, accessType: 2, durationType: 6, amounText: "99.99 USD" },
  { topicID: 2, accessType: 3, durationType: 12, amounText: "119.99 USD" },
  { topicID: 3, accessType: 1, durationType: 3, amounText: "99.99 USD" },
  { topicID: 3, accessType: 2, durationType: 6, amounText: "129.99 USD" },
  { topicID: 3, accessType: 3, durationType: 12, amounText: "149.99 USD" },
];

const TopicSubscription = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [accessType, setAccessType] = useState(1);
  const [accDuration, setAccessDuration] = useState(3);
  const [amount, setAmount] = useState(0);
  const [selectedButton, setselectedButton] = useState([]);
  const [topicID, setTopicID] = useState('');
  const [errorMsg, setError] = useState('');
  const [cartData, setCartData] = useState([]);
  const [data, setData] = useState([]);
  const [accessTypeData, setAccessTypeData] = useState([]);
  const [durationTypeData, setDurationTypeData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = data.slice(firstPostIndex, lastPostIndex);

  const getData = () => {
    // Simulate API call with dummy data
    setData(dummyTopics);
  };

  const handleAccessTypeChange = (e) => {
    const value = e.target.value;
    setAccessType(value);
    getAmountData(topicID, value, accDuration);
  };

  const handleAccessDurationChange = (e) => {
    const value = e.target.value;
    setAccessDuration(value);
    getAmountData(topicID, accessType, value);
  };

  const handleOtherScheme = (topicID) => {
    handleShow();
    setTopicID(topicID);
    getAccessTypeData(topicID);
    getDurationTypeData(topicID);
    getAmountData(topicID, accessType, accDuration);
  };

  const getAccessTypeData = (topicID) => {
    // Simulate API call with dummy data
    setAccessTypeData(dummyAccessTypes);
  };

  const getDurationTypeData = (topicID) => {
    // Simulate API call with dummy data
    setDurationTypeData(dummyDurationTypes);
  };

  const getAmountData = (topicID, accessType, durationType) => {
    // Simulate API call with dummy data
    const amount = dummyAmountData.find(
      (item) => item.topicID === parseInt(topicID) && item.accessType === parseInt(accessType) && item.durationType === parseInt(durationType)
    );
    setAmount(amount ? amount.amounText : "0.00 USD");
  };

  const handleAddTocart = (item) => {
    setCartData([...cartData, item]);
    let value = parseInt(item.topicID);
    setselectedButton([...selectedButton, value]);
    toast.success('Item added to cart', {
      toastId: `add-${item.topicID}`,
      autoClose: 3000,
    });
  };

  const handleTopicChoose = () => {
    // Simulate API call with dummy data
    const selectedTopic = dummyTopics.find((item) => item.topicID === parseInt(topicID));
    if (selectedTopic) {
      const updatedTopic = {
        ...selectedTopic,
        accessTypeText: dummyAccessTypes.find((aT) => aT.accessType === parseInt(accessType)).accessTypeText,
        accessDuration: parseInt(accDuration),
        durationUnitText: dummyDurationTypes.find((dT) => dT.accessDuration === parseInt(accDuration)).durationUnitText,
        amount: parseFloat(amount.split(' ')[0]),
        amountUnit: amount.split(' ')[1],
      };
      setData((prevData) =>
        prevData.map((item) => (item.topicID === parseInt(topicID) ? updatedTopic : item))
      );
      handleClose();
      toast.success('Scheme updated successfully', {
        toastId: `update-${topicID}`,
        autoClose: 3000,
      });
    }
  };

  const { SearchBar } = Search;
  let newData = [];
  data.map((item, index) => {
    newData.push({ sl: index + 1, ...item });
  });

  const imageFormatter = (data, row) => {
    return <img className="imgSize" src={API_URL + row.topicImgPath} alt={row.topicTitle} />;
  };

  const durationFormatter = (data, row) => {
    return `${row.accessDuration}${row.durationUnitText}`;
  };

  const amountFormatter = (data, row) => {
    return `${row.amount}${row.amountUnit}`;
  };

  const otherSchemeFormatter = (data, row) => {
    return <a href="#" onClick={() => handleOtherScheme(row.topicID)}>Choose Other Scheme</a>;
  };

  const addCartFormatter = (data, row) => {
    return (
      <button
        className="btn btn-success"
        disabled={selectedButton.includes(row.topicID)}
        onClick={() => handleAddTocart(row)}
      >
        Add to Cart
      </button>
    );
  };

  const columns = [
    { dataField: 'sl', text: 'SL' },
    { dataField: 'topicImgPath', text: 'Image', formatter: imageFormatter },
    { dataField: 'topicTitle', text: 'Topic Title', sort: true },
    { dataField: 'topicDetail', text: 'Detail' },
    { dataField: 'accessTypeText', text: 'Access Type', sort: true },
    { dataField: 'accessDuration', text: 'Duration', sort: true, formatter: durationFormatter },
    { dataField: 'amount', text: 'Amount', sort: true, formatter: amountFormatter },
    { dataField: '', text: 'Choose Other Scheme', formatter: otherSchemeFormatter },
    { dataField: '', text: 'Add to Cart', formatter: addCartFormatter },
  ];

  return (
    <Fragment>
      <ToastContainer />
      <Header list={cartData} />
      <HeroSection />

      {viewMode === 'cards' ? (
        <Container className="certification-section">
          <Row>
            {currentPosts && currentPosts.length > 0 ? (
              currentPosts.map((item, index) => (
                <Col key={index} md={4} className="mb-4">
                  <div className="card certification-card h-100">
                    <img
                      src={API_URL + item.topicImgPath}
                      className="card-img-top certification-img"
                      alt={item.topicTitle}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.topicTitle}</h5>
                      <p className="card-text">{item.topicDetail}</p>
                      <p className="card-text">
                        <strong>Access Type:</strong> {item.accessTypeText}
                      </p>
                      <p className="card-text">
                        <strong>Duration:</strong> {item.accessDuration}{item.durationUnitText}
                      </p>
                      <p className="card-text">
                        <strong>Amount:</strong> {item.amount}{item.amountUnit}
                      </p>
                      <div className="card-actions d-flex justify-content-between">
                        <a
                          href="#"
                          className="card-link"
                          onClick={() => handleOtherScheme(item.topicID)}
                        >
                          Choose Other Scheme
                        </a>
                        <button
                          className="btn btn-secondary px-4 py-2 rounded-pill fw-bold"
                          disabled={selectedButton.includes(item.topicID)}
                          onClick={() => handleAddTocart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </Row>
          <Pagination
            totalPosts={data.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </Container>
      ) : (
        <Container>
          <ToolkitProvider keyField="sl" data={newData} columns={columns} search>
            {(props) => (
              <div>
                <SearchBar {...props.searchProps} />
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory()}
                  bootstrap4
                  striped
                  hover
                  condensed
                />
              </div>
            )}
          </ToolkitProvider>
        </Container>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choosing Scheme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col style={{ textAlign: "right" }}>
              <label>Access Type:</label>
            </Col>
            <Col>
              <select className="form-select" value={accessType} onChange={handleAccessTypeChange}>
                {accessTypeData.map((aT) => (
                  <option key={aT.id} value={aT.accessType}>{aT.accessTypeText}</option>
                ))}
              </select>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "right" }}>
              <label>Access Duration:</label>
            </Col>
            <Col>
              <select className="form-select" value={accDuration} onChange={handleAccessDurationChange}>
                {durationTypeData.map((dT) => (
                  <option key={dT.id} value={dT.accessDuration}>
                    {dT.accessDuration}{dT.durationUnitText}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "right" }}>
              <label>Amount:</label>
            </Col>
            <Col>
              <input type="text" className="form-control" disabled value={amount} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleTopicChoose}>
            Choose
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </Fragment>
  );
};

export default TopicSubscription;