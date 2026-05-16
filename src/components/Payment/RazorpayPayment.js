import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import showToast from "../../shared/toastConfig";
const RazorpayPayment = () => {
  // const { authData, setAuthData } = useAuth();
  let navigate = useNavigate();
  const location = useLocation();
  const { bookingPayload, orderId } = location.state || {};
  const baseURL = process.env.REACT_APP_BASE_URL;
  const razorpayKey = process.env.REACT_APP_RAZOR_PAY_KEY;
  // const secretKey = CryptoJS.enc.Base64.parse(authData?.secret_key?.encoded);
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const razorPayCheckout = async () => {
    try {
      const res = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        showToast("error", "Razorpay SDK failed to load. Are you online?");
        return;
      }

      const options = {
        key: razorpayKey,
        amount: bookingPayload?.totalAmt * 100,
        currency: "INR",
        name: "Payment App",
        description: "Test Transaction",
        order_id: orderId,
        handler: async (response) => {
          try {
            const res = await axios.post(baseURL + "bookings/verify", null, {
              params: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });
            if (rzp && typeof rzp.close === "function") {
              rzp.close();
            }
            if (res?.status === 200) {
              navigate("/", {
                state: { paymentId: response.razorpay_payment_id }
              });
              rzp.close();
              showToast("success", "Payment successful! Booking confirmed.");
            } else {
              rzp.close();
              showToast("error", "Payment failed.");
              navigate("/");
            }
          } catch (error) {
            rzp.close();
            console.error("Verification failed:", error);
             showToast("error", "Payment failed.");
            navigate("/");
          }
        },
        prefill: {
          name: bookingPayload.customerName,
          email: bookingPayload.email,
          contact: bookingPayload.mobile,
        },
        // theme: { color: theme.palette.primary.main },
        notes: { description: "Test payment transaction" },
      };

      const rzp = new window.Razorpay({
        ...options,
        modal: {
          ondismiss: () => {
            navigate("/");
          },
          escape: false, // Prevents user from closing UI with Esc key
          confirm_close: true, // Asks for confirmation before closing
        },
      });
      rzp.close();
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    razorPayCheckout();
  }, []);

  return <></>;
};

export default RazorpayPayment;
