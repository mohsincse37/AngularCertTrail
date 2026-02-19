
import React, { useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../components/API_URL";

export default function Paypal(arrayList) { 
  var total=0;
  for (var i in arrayList.list) {
      total += arrayList.list[i].amount;    
  }
  total = total + ".0";
  const paypal = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Certification Topic Subscription",
                amount: {
                  currency_code: "USD",
                  value: total,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          handlePayment();
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);

  const handlePayment = async () => {
    const url = API_URL + 'api/User/AddUserTopicMapping';
    axios.post(url, arrayList.list)
      .then(response => {
          console.log("Payment succesfull");
          navigate('/Home');
      })
      .catch(error => {
        console.log(error);
      });
  }
  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}
