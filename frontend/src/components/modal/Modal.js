import React from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export default function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  return createPortal(
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </>,
    document.getElementById("modal")
  );
}
