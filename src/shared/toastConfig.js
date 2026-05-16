import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = (type, message, customConfig = {}) => {
  const isMobile = window.innerWidth <= 1100;
  const defaultConfig = {
    position: isMobile ? "top-center" : "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: isMobile ? "small-toast" : "",
  };

  const config = { ...defaultConfig, ...customConfig };

  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "info":
      toast.info(message, config);
      break;
    case "warning":
      toast.warning(message, config);
      break;
    default:
      toast(message, config);
      break;
  }
};

export default showToast;
