import React, { useState, useEffect } from "react";
import "./AddProductForm.css";
import { auth, db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { CheckboxInput, FileInput, NumberInput, SelectInput, TextArea, TextInput } from "../Constance/Constance";



export const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
export const shoeSizes = ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"];
export const colors = [
  "Red",
  "Blue",
  "Green",
  "Black",
  "White",
  "Yellow",
  "Orange",
  "Purple",
  "Brown",
  "Gold",  
  "Silver",
];


const AddProductForm = () => {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isPrintable, setIsPrintable] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [colorImages, setColorImages] = useState({});
  const [colorQuantities, setColorQuantities] = useState({});
  const [totalQuantity, setTotalQuantity] = useState(0); // Initialize totalQuantity state



  const [formErrors] = useState({});

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleColorImageUpload = (color, event) => {
    const imageFile = event.target.files[0];
    setColorImages((prevImages) => ({
      ...prevImages,
      [color]: imageFile,
    }));
  };

  const handleColorChange = (color) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };



  const handleFrontImageUpload = async (event) => {
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

  const handleColorQuantityChange = (color, value) => {
    const parsedValue = parseInt(value);
    setColorQuantities((prevQuantities) => ({
      ...prevQuantities,
      [color]: isNaN(parsedValue) ? 0 : parsedValue,
    }));
  
    // Recalculate the total quantity
  
  };

  
  const handleSubmit = async () => {
    try {
      // Construct the product data with base64-encoded images
      const frontImageBase64 = frontImage ? frontImage.base64 : null;
      const backImageBase64 = backImage ? backImage.base64 : null;
  
      // Convert color images to base64 strings
      const colorImageBase64 = {};
      for (const color of selectedColors) {
        const colorImageFile = colorImages[color];
        if (colorImageFile) {
          const base64 = await convertFileToBase64(colorImageFile);
          colorImageBase64[color] = base64;
        }
      }
  
      // Calculate the total quantity based on colorQuantities
      let total = 0;
      for (const color in colorQuantities) {
        total += colorQuantities[color] || 0;
      }
  
      // Construct the product data
      const productData = {
        brand,
        category,
        productName,
        price,
        description,
        quantity: total, // Assign total quantity
        availableSizes: selectedSizes,
        availableColors: selectedColors,
        isPrintable,
        frontImage: frontImageBase64,
        backImage: backImageBase64,
        colorImages: colorImageBase64,
        colorQuantities, // Include colorQuantities in the product data
      };
  
      // Upload product data to Firestore
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
        setColorImages({});
        setColorQuantities({});
        setSubmissionStatus("success");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      // Handle error and set submission status accordingly
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

  const brandOptions = [
    { value: "0", label: "Select Type" },
    { value: "Tops", label: "Tops" },
    { value: "Shirts", label: "Shirts" },
    { value: "Jackets,Sweatshirts&Blazers", label: "Jackets, Sweatshirts & Blazers" },
    { value: "Denim", label: "Denim" },
    { value: "Pants", label: "Pants" },
    { value: "Shorts", label: "Shorts" },
    { value: "Shoes", label: "Shoes" },
    { value: "Bags&Wallets", label: "Bags & Wallets" },
    { value: "Belts", label: "Belts" },
    { value: "Hats&Scarves", label: "Hats & Scarves" },
  ];

  const categoryOptions = [
    { value: "0", label: "Select Category" },
    { value: "Summer", label: "Summer" },
    { value: "Winter", label: "Winter" },
    { value: "Accessories", label: "Accessories" },
  ];
  useEffect(() => {
    // Calculate the total quantity based on colorQuantities
    let total = 0;
    for (const color in colorQuantities) {
      total += colorQuantities[color] || 0;
    }

    // Update the totalQuantity state
    setTotalQuantity(total);
  }, [colorQuantities, setTotalQuantity]);
  return (
    <div className="form-container">
      <div className="form-content">
      <SelectInput
          label="Select Product Type:"
          value={brand}
          options={brandOptions}
          onChange={(e) => {
            setBrand(e.target.value);
            setSelectedSizes([]); // Clear selected sizes when changing product type
          }}
        />
        <SelectInput
          label="Select Brand Category:"
          value={category}
          options={categoryOptions}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextInput
          label="Product Name:"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        {formErrors.productName && (
          <p className="error">{formErrors.productName}</p>
        )}

        <NumberInput
          label="Price:"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {formErrors.price && <p className="error">{formErrors.price}</p>}

        <TextArea
          label="About the Product:"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <label>Available Colors:</label>
      {colors.map((color) => (
        <div key={color}>
          <CheckboxInput
            label={color}
            checked={selectedColors.includes(color)}
            onChange={() => handleColorChange(color)}
          />
          {selectedColors.includes(color) && (
            <>
              <NumberInput
                label={`Quantity for ${color}:`}
                value={colorQuantities[color] || ""}
                onChange={(e) =>
                  handleColorQuantityChange(color, e.target.value)
                }
              />
              <FileInput
                label={`Upload ${color} Image:`}
                accept="image/*"
                onChange={(e) => handleColorImageUpload(color, e)}
              />
            </>
          )}
        </div>
      ))}

      <>
      <p>Total Quantity: {totalQuantity}</p>

      </>
      {category !== "Accessories" && (
        <>
        <label>Available Sizes:</label>
          {brand === "Shoes" ? (
            <div>
              {shoeSizes.map((size) => (
                <div key={size}>
                  <CheckboxInput
                    label={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {sizes.map((size) => (
                <div key={size}>
                  <CheckboxInput
                    label={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                </div>
              ))}
            </div>
          )}

        </>
      )}


      
      <CheckboxInput
        label="Is the product printable?"
        checked={isPrintable}
        onChange={() => setIsPrintable(!isPrintable)}
      />

      {isPrintable && (
        <div>
          <FileInput
            label="Upload Front Image:"
            accept="image/*"
            onChange={handleFrontImageUpload}
          />
          <FileInput
            label="Upload Back Image:"
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
