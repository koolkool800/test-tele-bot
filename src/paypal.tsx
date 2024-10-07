import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

const api_url = "http://localhost:3000/api/v1";

type OnApproveData = {
  billingToken?: string | null;
  facilitatorAccessToken: string;
  orderID: string;
  payerID?: string | null;
  paymentID?: string | null;
  subscriptionID?: string | null;
  authCode?: string | null;
};
function PaypalPayment() {
  /**
   *
   * @description pass the resellOrderId (id of the order just created) and amount (total payment) to create the order
   */
  async function createOrder(): Promise<string> {
    const response = await fetch(`${api_url}/payment/paypal/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resellOrderId: 700024, //REPLACE
        amount: 88000, //REPLACE
      }),
    });

    const orderData = await response.json();

    console.log(orderData);

    if (orderData.data.paypalOrderId) {
      return orderData.data.paypalOrderId;
    } else {
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      throw new Error(errorMessage);
    }
  }

  /**
   *
   * @description capture the order after the user approves the payment, replace the resell order id is the id of the resell order
   */
  async function onApprove(data: OnApproveData, actions: any) {
    // data.orderId is the paypalOrderId
    try {
      const response = await fetch(`${api_url}/payment/paypal/capture-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resellOrderId: 700024, //REPLACE
          paypalOrderId: data.orderID,
        }),
      });

      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL

        console.log("Capture result", orderData);
        alert("Success transaction");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <PayPalScriptProvider
        options={{
          clientId:
            "AaxTON4F0JBO6rNqhi_5bFtxF4sHFr_qjKRJG5VYzbcRbMAsF1eMNhmjDPagjnAbu7Ug8p1YDWS3C3Vi",
          currency: "USD",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </>
  );
}

export default PaypalPayment;
