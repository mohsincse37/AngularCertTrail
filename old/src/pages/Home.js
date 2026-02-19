import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../components/Pagination";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../components/API_URL";
import '../styles/CustomCss.css';
import '../styles/common.css';
import '../styles/login.css';

const DumpsPractice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [topicId, setTopicId] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [selectOption, setSelectOption] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    getTopicData();
  }, []);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = questionData.slice(firstPostIndex, lastPostIndex);

  const handleTopicIDChange = (e) => {
    const value = e.target.value;
    setTopicId(value);
    setCurrentPage(1); // Reset to first page when topic changes
    if (value) {
      getQuestionWithOptionByTopicID(value);
    } else {
      setQuestionData([]); // Clear questions if no topic is selected
    }
  };

  const getTopicData = () => {
    axios.get(API_URL + 'api/CertificationTopic/GetActiveCertificationTopicsByUserID')
      .then((result) => {
        setTopicData(result.data);
      })
      .catch((error) => {
        toast.error("Failed to load topics: " + error.message);
      });
  };

  const getQuestionWithOptionByTopicID = (topicID) => {
    axios.get(API_URL + 'api/QuestionOption/GetQuestionWithOptionByTopicID/' + topicID)
      .then((result) => {
        setQuestionData(result.data);
      })
      .catch((error) => {
        toast.error("Failed to load questions: " + error.message);
      });
  };

  const handleSelectedOption = (e) => {
    setSelectOption(e.target.value !== selectOption ? e.target.value : null);
  };

  const checkboxHandler = (e) => {
    const isSelected = e.target.checked;
    const value = parseInt(e.target.value);

    if (isSelected) {
      setSelectedItems([...selectedItems, value]);
    } else {
      setSelectedItems((prevData) => prevData.filter((id) => id !== value));
    }
  };

  const handleShow = (id) => {
    setSelectedId(id !== selectedId ? id : null);
  };

  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <div className="login-page d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Container className="dumps-practice-section py-5">
          <h3 className="text-uppercase fw-bold mb-4 text-center text-green-600">Dumps Practice</h3>
          <Row>
            <Col xs={12} md={4} className="text-md-right">
              <label htmlFor="topicId" className="text-dark">Topic:</label>
            </Col>
            <Col xs={12} md={4}>
              <select
                id="topicId"
                className="form-select rounded"
                value={topicId}
                onChange={handleTopicIDChange}
              >
                <option value="">Select</option>
                {topicData.map((topic) => (
                  <option key={topic.id} value={topic.id}>{topic.topicTitle}</option>
                ))}
              </select>
            </Col>
            <Col xs={12} md={4}></Col>
          </Row>

          <Row className="mt-4">
            <Col>
              {currentPosts.length === 0 && topicId ? (
                <p className="text-center text-muted">No questions available for this topic.</p>
              ) : (
                currentPosts.map((question, questionIndex) => (
                  <div key={questionIndex} className="questionSpace mb-4 p-3 bg-light rounded">
                    <div className="fw-bold">
                      Q{question.questionNo}. {question.questionTitle}
                    </div>
                    {question.questionImgPath && (
                      <div className="mt-2">
                        <img
                          className="imgSize"
                          src={API_URL + question.questionImgPath}
                          alt={`Question ${question.questionNo}`}
                        />
                      </div>
                    )}
                    {question.qOption.map((quesOption) => (
                      <div key={quesOption.id} className="mt-2">
                        {question.optionType === 1 ? (
                          <Row>
                            <Col>
                              <label className="d-flex align-items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.questionID}`}
                                  value={quesOption.id}
                                  onChange={handleSelectedOption}
                                  className="me-2"
                                />
                                {quesOption.optionTitle}
                                {quesOption.optionImgPath && (
                                  <div className="mt-1">
                                    <img
                                      className="imgSize"
                                      src={API_URL + quesOption.optionImgPath}
                                      alt={`Option ${quesOption.id}`}
                                    />
                                  </div>
                                )}
                              </label>
                            </Col>
                          </Row>
                        ) : (
                          <Row>
                            <Col>
                              <label className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(quesOption.id)}
                                  value={quesOption.id}
                                  onChange={checkboxHandler}
                                  className="me-2"
                                />
                                {quesOption.optionTitle}
                                {quesOption.optionImgPath && (
                                  <div className="mt-1">
                                    <img
                                      className="imgSize"
                                      src={API_URL + quesOption.optionImgPath}
                                      alt={`Option ${quesOption.id}`}
                                    />
                                  </div>
                                )}
                              </label>
                            </Col>
                          </Row>
                        )}
                      </div>
                    ))}
                    <button
                      className="btn btn-info mt-3"
                      onClick={() => handleShow(question.questionID)}
                    >
                      Show Answer
                    </button>
                    {selectedId === question.questionID && (
                      <div className="mt-3">
                        <div>
                          Correct answer:{" "}
                          <span
                            style={{
                              color:
                                (question.optionType === 1
                                  ? selectOption == question.correctOptionID
                                  : selectedItems.toString() ===
                                    question.correctOptionID)
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {question.correctOptionTitle}
                          </span>
                        </div>
                        <div>Description: {question.ansDescription}</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <Pagination
        totalPosts={questionData.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <Footer />
    </Fragment>
  );
};

export default DumpsPractice;