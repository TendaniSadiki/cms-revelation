import React, { useState } from "react";
import "./AddProductForm.css";
import { auth, db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";

const AddProductForm = () => {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [productImage, setProductImage] = useState(null);
  const [isPrintable, setIsPrintable] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow"];

  const handleSizeChange = (size) => {
    // Toggle selected size
    setSelectedSizes((prevSizes) => {
      if (prevSizes.includes(size)) {
        return prevSizes.filter((s) => s !== size);
      } else {
        return [...prevSizes, size];
      }
    });
  };

  const handleColorChange = (color) => {
    // Toggle selected color
    setSelectedColors((prevColors) => {
      if (prevColors.includes(color)) {
        return prevColors.filter((c) => c !== color);
      } else {
        return [...prevColors, color];
      }
    });
  };

  const handleProductImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setProductImage(imageFile);
  };
  const handleFrontImageUpload = async (event) => {
    // Handle front image upload
    const imageFile = event.target.files[0];
    if (imageFile) {
      try {
        const base64 = await convertFileToBase64(imageFile);
        setFrontImage({ file: imageFile, base64 });
      } catch (error) {
        console.error("Error converting front image to base64:", error);
      }
    }
  };

  const handleBackImageUpload = async (event) => {
    // Handle back image upload
    const imageFile = event.target.files[0];
    if (imageFile) {
      try {
        const base64 = await convertFileToBase64(imageFile);
        setBackImage({ file: imageFile, base64 });
      } catch (error) {
        console.error("Error converting back image to base64:", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Convert images to base64 strings
      const productImageBase64 = await convertFileToBase64(productImage);
      const frontImageBase64 = frontImage ? frontImage.base64 : null;
      const backImageBase64 = backImage ? backImage.base64 : null;

      // Construct the product data with base64-encoded images
      const productData = {
        brand,
        category,
        productName,
        price,
        description,
        quantity,
        availableSizes: selectedSizes,
        availableColors: selectedColors,
        productImage: productImageBase64,
        isPrintable,
        frontImage: frontImageBase64,
        backImage: backImageBase64,
      };

      // Upload base64-encoded images to Firebase Storage
      const user = auth.currentUser;
      if (user) {
        const userUid = user.uid;
        const productsCollectionRef = collection(
          db,
          "admins",
          userUid,
          "products"
        );
        await addDoc(productsCollectionRef, productData);

        // Reset form fields and set submission status
        setBrand("");
        setCategory("");
        setProductName("");
        setPrice("");
        setDescription("");
        setSelectedSizes([]);
        setSelectedColors([]);
        setIsPrintable(false);
        setFrontImage(null);
        setBackImage(null);
        setProductImage(null);
        setFormErrors({});
        setSubmissionStatus("success");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setSubmissionStatus("error");
    }
  };

  // Helper function to convert File to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="form-container">
      <div className="form-content"></div>
      <label>Select Product Type:</label>
      <select value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option value="0">Select Type</option>
        <option value="Tops">Tops</option>
        <option value="Shirts">Shirts</option>
        <option value="Jackets,Sweatshirts&Blazers">
          Jackets, Sweatshirts & Blazers
        </option>
        <option value="Denim">Denim</option>
        <option value="Pants">Pants</option>
        <option value="Shorts">Shorts</option>
        <option value="Shoes">Shoes</option>
        <option value="Bags&Wallets">Bags & Wallets</option>
        <option value="Belts">Belts</option>
        <option value="Hats&Scarves">Hats & Scarves</option>
      </select>

      <div>
        <label>Select Brand Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="0">Select Category</option>
          <option value="Summer">Summer</option>
          <option value="Winter">Winter</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <label>Product Name:</label>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      {formErrors.productName && (
        <p className="error">{formErrors.productName}</p>
      )}

      <label>Price:</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {formErrors.price && <p className="error">{formErrors.price}</p>}

      <label>About the Product:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Available Sizes:</label>
      {sizes.map((size) => (
        <label key={size}>
          <input
            type="checkbox"
            checked={selectedSizes.includes(size)}
            onChange={() => handleSizeChange(size)}
          />
          {size}
        </label>
      ))}

      <label>Available Colors:</label>
      {colors.map((color) => (
        <div key={color}>
          <label>
            <input
              type="checkbox"
              checked={selectedColors.includes(color)}
              onChange={() => handleColorChange(color)}
            />
            {color}
          </label>
        </div>
      ))}
      <label>Quantity</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      {formErrors.quantity && <p className="error">{formErrors.quantity}</p>}
      <label>Product image:</label>
      <input type="file" accept="image/*" onChange={handleProductImageUpload} />
      {formErrors.productImage && (
        <p className="error">{formErrors.productImage}</p>
      )}

      <label>Is the product printable?</label>
      <input
        type="checkbox"
        checked={isPrintable}
        onChange={() => setIsPrintable(!isPrintable)}
      />

      {isPrintable && (
        <div>
          <label>Upload Front Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFrontImageUpload}
          />

          <label>Upload Back Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackImageUpload}
          />
        </div>
      )}

      <button onClick={handleSubmit}>Add Product</button>
      {submissionStatus === "success" && (
        <p className="submission-message success">
          Product saved successfully!
        </p>
      )}
      {submissionStatus === "error" && (
        <p className="submission-message error">
          Failed to save product. Please try again.
        </p>
      )}
    </div>
  );
};

export default AddProductForm;
