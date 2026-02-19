import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
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
import '../styles/CustomCss.css';

const UserWiseTopic = () => {

    const navigate = useNavigate();
    const [topicID, setTopicId] = useState('');
    const [errorMsg, setError] = useState('');

    const [data, setData] = useState([]);
    const [topicData, setTopicData] = useState([]);
    useEffect(() => {
        pageAuthorization();
    }, [])

    const pageAuthorization = () => {
        const url = API_URL + 'api/PageAuthorization/CheckingAuthority';
        const data = {
            "pageName": "/UserWiseTopic",
        }
        axios.post(url, data)
            .then((result) => {
                if (result.data.authorityMsg == 'isValidAuthor') {
                    getTopicData();
                }
                else {
                    console.log("You are not authorized !!");
                    navigate("/Login");
                }

            }).catch((error) => {
                toast.error(error);
            })
    };


    const handleTopicIDChange = (e) => {
        const value = e.target.value;
        setTopicId(value);
        if (value) setError('');
    };

    const getTopicData = () => {
        axios.get(API_URL + 'api/CertificationTopic/GetCertificationTopics')
            .then((result) => {
                setTopicData(result.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getData = (topicID) => {
        axios.get(API_URL + 'api/User/GetUserWiseSubscriptionList/' + topicID)
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleShow = () => {
        if (!topicID) {
            setError('Topic is required.');
            return;
        }
        getData(topicID);
    }

    const { SearchBar } = Search;
    let newData = [];
    data.map((item, index) => {
        newData.push({ sl: index + 1, ...item });
    });

    const columns = [
        {
            dataField: 'sl',
            text: 'SL'
        },
        {
            dataField: 'userID',
            text: 'User ID'
        },
        {
            dataField: 'topicTitle',
            text: 'Topic',
            sort: true
        },
        {
            dataField: 'fromDate',
            text: 'From Date'
        },
        {
            dataField: 'toDate',
            text: 'To Date'
        },
        {
            dataField: 'amount',
            text: 'Amount'
        }
    ];

    return (
        <Fragment>
            <ToastContainer />
            <Header />

            <h3 style={{ color: "green", textAlign: "center" }}>User Wise Subscription</h3>

            <Container>
                <Row>
                    <Col style={{ textAlign: "right" }}>
                        <label>Topic:</label>
                    </Col>
                    <Col>
                        <select className="form-select" value={topicID} onChange={handleTopicIDChange}>
                            <option value={""}>Select</option>
                            {topicData.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.topicTitle}</option>
                            ))}
                        </select>
                    </Col>
                    <Col>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col className="buttonCenter">
                        <button className="btn btn-primary" onClick={() => handleShow()}>Show</button>
                    </Col>
                    <Col>
                    </Col>
                </Row>

            </Container>
            <br></br>
            <ToolkitProvider
                search
            >
                {
                    props => (
                        <div className="tablePosition">
                            <SearchBar {...props.searchProps} />
                            <hr />
                            <BootstrapTable
                                {...props.baseProps}
                                keyField='topicID'
                                data={newData}
                                columns={columns}
                                striped
                                hover
                                condensed
                                pagination={paginationFactory()}
                            />
                        </div>
                    )
                }
            </ToolkitProvider>


        </Fragment>
    )
}
export default UserWiseTopic;