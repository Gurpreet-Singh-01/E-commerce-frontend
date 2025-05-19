import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="mt-16 font-text"
    />
  );
};

export default Toast;
