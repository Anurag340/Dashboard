import React from 'react';

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white flex justify-center items-center gap-[2vh] flex-col p-8 rounded-lg shadow-lg">
        <p className="text-xl mb-4">{message}</p>
        <button 
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
