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
import Select from 'react-select';
import { API_URL } from "../components/API_URL";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/CustomCss.css';
import '../styles/common.css';
import '../styles/login.css';

const RightOptionSetting = () => {
  const [topicId, setTopicId] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setError] = useState('');
  const [topicData, setTopicData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [optionData, setOptionData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    pageAuthorization();
  }, []);

  const pageAuthorization = () => {
    const url = API_URL + 'api/PageAuthorization/CheckingAuthority';
    const data = { pageName: "/RightOptionSetting" };
    axios.post(url, data)
      .then((result) => {
        if (result.data.authorityMsg === 'isValidAuthor') {
          getTopicData();
        } else {
          console.log("You are not authorized !!");
          navigate("/Login");
        }
      })
      .catch((error) => {
        toast.error("Authorization failed: " + error.message);
      });
  };

  const handleTopicIDChange = (e) => {
    const value = e.target.value;
    setTopicId(value);
    setQuestionId('');
    setQuestionData([]);
    setSelectedOptions([]);
    setOptionData([]);
    if (value) {
      setError('');
      getQuestionDataByTopicID(value);
    }
  };

  const handleQuestionIDChange = (e) => {
    const value = e.target.value;
    setQuestionId(value);
    setSelectedOptions([]);
    setOptionData([]);
    if (value) {
      setError('');
      getOptionDataByQuestionID(value);
    }
  };

  const handleOptionIDChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
    if (selectedOption.length > 0) setError('');
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

  const getOptionDataByQuestionID = (questionID) => {
    axios.get(API_URL + 'api/QuestionOption/GetOptionDataByQuestionID/' + questionID)
      .then((result) => {
        const options = result.data.map(option => ({
          value: option.id,
          label: option.optionTitle
        }));
        setOptionData(options);
      })
      .catch((error) => {
        toast.error("Failed to load options: " + error.message);
      });
  };

  const handleUpdate = () => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setError('Option is required.');
      return;
    }
    if (!questionId) {
      setError('Question is required.');
      return;
    }

    const url = API_URL + 'api/QuestionCorrectOptions/CreateQuestionCorrectOptions/';
    const selectedOptionIDs = selectedOptions.map(option => option.value).join(',');
    const data = {
      questionID: questionId,
      ansDescription: description,
      correctOptionID: selectedOptionIDs
    };
    axios.post(url, data)
      .then((result) => {
        toast.success("Right Option has been set");
        clear();
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred while setting the option.");
      });
  };

  const clear = () => {
    setTopicId('');
    setQuestionId('');
    setSelectedOptions([]);
    setOptionData([]);
    setQuestionData([]);
    setDescription('');
    setError('');
  };

  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <div className="login-page d-flex justify-content-center min-vh-100">
        <Container className="dumps-practice-section py-5">
          <div className="home-page d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="col-8 floatingBox position-relative z-10">
              <h3 className="text-uppercase fw-bold mb-4 text-center text-green-600">Right Question Option Setting</h3>
              <form className="addUserForm">
                <div className="inputGroup">
                  <div className="form-group">
                    <label htmlFor="topicId" className="text-dark">Topic:</label>
                    <select
                      id="topicId"
                      className="form-select rounded"
                      value={topicId}
                      onChange={handleTopicIDChange}
                    >
                      <option value="">Select</option>
                      {topicData.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.topicTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="questionId" className="text-dark">Question:</label>
                    <select
                      id="questionId"
                      className="form-select rounded"
                      value={questionId}
                      onChange={handleQuestionIDChange}
                    >
                      <option value="">Select</option>
                      {questionData.map(question => (
                        <option key={question.id} value={question.id}>{question.questionTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="optionId" className="text-dark">Option:</label>
                    <Select
                      id="optionId"
                      options={optionData}
                      value={selectedOptions}
                      onChange={handleOptionIDChange}
                      isMulti={true}
                      className="rounded"
                      placeholder="Select Options"
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="description" className="text-dark">Description:</label>
                    <textarea
                      id="description"
                      rows="3"
                      className="form-control rounded"
                      placeholder="Enter Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="login mt-3">
                  <p className="text-dark text-center mb-0">{errorMsg && <span className="text-danger">{errorMsg}</span>}</p>
                </div>
                <div className="login mt-3 text-center">
                  <button
                    className="btn btn-primary fw-bold px-4 py-2 rounded-pill"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </Fragment>
  );
};

export default RightOptionSetting;