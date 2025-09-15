import "./Modal.css";

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Error</h3>
        <p>{message}</p>
        <button className="Modal-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
