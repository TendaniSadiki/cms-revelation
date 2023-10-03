import React, { useState } from "react";
import { FaTrash, FaEdit } from 'react-icons/fa';

// Import the input components and constants from the module where they are defined

import { TextInput } from "../Constance/Constance";

const Modal = ({ isOpen, closeModal, product, selectedColor, onDeleteProduct, onUpdateProduct }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen || !product) {
    return null;
  }

  const handleDelete = () => {
    onDeleteProduct(product.id);
    closeModal();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    // Implement your update logic here
    onUpdateProduct(product.id, /* updated product data */);
    setIsEditing(false);
  };

  return (
    <div className="custom-modal">
      <div className="modal-content">
        <button onClick={closeModal} className="close-button">×</button>
        <div>
          {isEditing ? (
            <div>
              {/* Render editable fields here */}
              {/* Example: */}
              <TextInput
                label="Product Name:"
                value={product.productName}
                onChange={(e) => onUpdateProduct({ ...product, productName: e.target.value })}
              />
              {/* Add other editable fields as needed */}
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          ) : (
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
              <button onClick={handleEdit}>
                <FaEdit /> Edit
              </button>
              <button onClick={handleDelete}>
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
