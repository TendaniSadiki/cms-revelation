import React from "react";
import { FaTrash } from 'react-icons/fa';

const Modal = ({ isOpen, closeModal, product, selectedColor, onDeleteProduct }) => {
  if (!isOpen || !product) {
    return null;
  }

  const handleDelete = () => {
    onDeleteProduct(product.id);
    closeModal();
  };

  return (
    <div className="custom-modal">
      <div className="modal-content">
        <button onClick={closeModal} className="close-button">×</button>
        <div>
          <h3>Product Details</h3>
          <p>Product Name: {product.productName}</p>
          <p>Price: {product.price}</p>
          <p>Colors: {product.availableColors.join(", ")}</p>
          <h3>Product Images</h3>
          <div className="modal-image-container">
            {Object.keys(product.colorImages).map((color, index) => (
              // Filter images based on selectedColor
              (!selectedColor || product.availableColors.includes(selectedColor) || color === selectedColor) ? (
                <img
                  key={index}
                  src={product.colorImages[color]}
                  alt={`product-${color}`}
                  className="modal-image"
                />
              ) : null
            ))}
          </div>
          <button onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
