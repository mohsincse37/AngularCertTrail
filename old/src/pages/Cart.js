import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import PayPal from "../components/PayPal";
import { API_URL } from "../components/API_URL";
import '../styles/CustomCss.css';
import '../styles/common.css';
import '../styles/login.css';

const Cart = () => {
  const location = useLocation();
  const [arrayList, setArrayList] = useState(location.state.param1 || []);
  const [userData] = useState(location.state.param2 || {});
  const [checkout, setCheckOut] = useState(false);

  // Calculate total amount
  let total = 0;
  let amtUnit = "";
  if (arrayList && arrayList.length > 0) {
    for (let i in arrayList) {
      total += arrayList[i].amount;
      amtUnit = arrayList[0].amountUnit;
    }
    total = total + amtUnit;
  }

  const handleDeleteCart = (id) => {
    const newList = arrayList.filter((item) => item.id !== id);
    setArrayList(newList);
    toast.success("Item removed from cart");
  };

  useEffect(() => {
    // Placeholder for potential future API calls
  }, []);

  return (
    <Fragment>
      <ToastContainer />
      <Header />

      <div className="login-page d-flex justify-content-center min-vh-100">
        <Container className="dumps-practice-section py-5">
          <div className="home-page d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="col-10 floatingBox position-relative z-10">
              <h3 className="text-uppercase fw-bold mb-4 text-center text-green-600">Certification Cart</h3>

              {/* Table for Cart Items */}
              <div className="table-responsive">
                <Table striped bordered hover condensed className="table">
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
                    {arrayList && arrayList.length > 0 ? (
                      arrayList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              className="imgSize"
                              src={API_URL + item.topicImgPath}
                              alt={item.topicTitle}
                              onError={(e) => (e.target.src = "/images/placeholder.jpg")} // Fallback image
                            />
                          </td>
                          <td>{item.topicTitle}</td>
                          <td>{item.accessTypeText}</td>
                          <td>{item.accessDuration}{item.durationUnitText}</td>
                          <td>{item.amount}{item.amountUnit}</td>
                          <td>
                            <button
                              className="btn btn-danger delIconStyle"
                              onClick={() => handleDeleteCart(item.id)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">Your cart is empty</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7} className="text-end fw-bold">
                        Total: {total}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>

              {/* User Info Section */}
              <div className="mt-4">
                <h5 className="text-dark fw-bold mb-3">User Information</h5>
                <div className="inputGroup cartUserInfo">
                  <div className="form-group">
                    <label className="text-dark">User Full Name: </label>
                    <span className="ms-2 text-muted cartSpanUInfo">{userData.userName || 'N/A'}</span>
                  </div>
                  <div className="form-group mt-2">
                    <label className="text-dark">Email: </label>
                    <span className="ms-2 text-muted cartSpanUInfo">{userData.email || 'N/A'}</span>
                  </div>
                  <div className="form-group mt-2">
                    <label className="text-dark">Mobile No: </label>
                    <span className="ms-2 text-muted cartSpanUInfo">{userData.mobileNo || 'N/A'}</span>
                  </div>
                  <div className="form-group mt-2">
                    <label className="text-dark">Address: </label>
                    <span className="ms-2 text-muted cartSpanUInfo">{userData.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="login mt-4 text-center">
                <div className="App">
                  {checkout ? (
                    <PayPal list={arrayList} />
                  ) : (
                    <button
                      className="btn btn-primary fw-bold px-4 py-2 rounded-pill"
                      onClick={() => {
                        if (arrayList.length === 0) {
                          toast.error("Your cart is empty!");
                          return;
                        }
                        setCheckOut(true);
                      }}
                    >
                      Proceed for Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </Fragment>
  );
};

export default Cart;