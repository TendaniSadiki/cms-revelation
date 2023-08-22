import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import './Inventory.css'
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow"];

  useEffect(() => {
    // Fetch user's products from Firestore
    const user = auth.currentUser;
    if (user) {
      const userUid = user.uid;
      const productsCollectionRef = collection(db, "admins", userUid, "products");

      const fetchProducts = async () => {
        const querySnapshot = await getDocs(productsCollectionRef);
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
      };

      fetchProducts();
    }
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, `admins/${auth.currentUser.uid}/products`, productId));
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditedProduct(product);
  };

  const handleUpdateProduct = async () => {
    if (editedProduct) {
      try {
        // Update product in the database
        await updateDoc(doc(db, `admins/${auth.currentUser.uid}/products`, editedProduct.id), editedProduct);

        // Update the product in the local state
        setProducts((prevProducts) => prevProducts.map((product) => product.id === editedProduct.id ? editedProduct : product));

        setIsEditing(false);
        setEditedProduct(null);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };
  const handleProductImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      try {
        const base64 = await convertFileToBase64(imageFile);
        setEditedProduct({ ...editedProduct, productImage: base64 });
      } catch (error) {
        console.error("Error converting product image to base64:", error);
      }
    }
  };
  const handleSizeToggle = (size) => {
    if (editedProduct) {
      const updatedSizes = editedProduct.availableSizes.includes(size)
        ? editedProduct.availableSizes.filter((s) => s !== size)
        : [...editedProduct.availableSizes, size];
      setEditedProduct({ ...editedProduct, availableSizes: updatedSizes });
    }
  };

  const handleColorToggle = (color) => {
    if (editedProduct) {
      const updatedColors = editedProduct.availableColors.includes(color)
        ? editedProduct.availableColors.filter((c) => c !== color)
        : [...editedProduct.availableColors, color];
      setEditedProduct({ ...editedProduct, availableColors: updatedColors });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <h2>Inventory</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.productImage} alt="product" className="InventoryImage" />
            <p>Product Name: {product.productName}</p>
            <p>Price: {product.price}</p>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            <button onClick={() => handleEditProduct(product)}>Edit</button>
          </li>
        ))}
      </ul>

      {isEditing && editedProduct && (
        <div>
          <h3>Edit Product</h3>
          <label>Available Sizes:</label>
          {sizes.map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                checked={editedProduct.availableSizes.includes(size)}
                onChange={() => handleSizeToggle(size)}
              />
              {size}
            </label>
          ))}
          
          <label>Available Colors:</label>
          {colors.map((color) => (
            <label key={color}>
              <input
                type="checkbox"
                checked={editedProduct.availableColors.includes(color)}
                onChange={() => handleColorToggle(color)}
              />
              {color}
            </label>
          ))}
          <label>Select Product Type:</label>
          <select value={editedProduct.brand} onChange={(e) => setEditedProduct({ ...editedProduct, brand: e.target.value })}>
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
          <label>Select Brand Category:</label>
          <select value={editedProduct.category} 
          onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}>
            <option value="0">Select Category</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
            <option value="Accessories">Accessories</option>
          </select>
          <label>Product image:</label>
          <input type="file" accept="image/*" onChange={handleProductImageUpload} />
          {editedProduct.productImage && (
            <img src={editedProduct.productImage} alt="product" className="EditedImage" />
          )}
          <label>Product name</label>
          <input
            type="text"
            value={editedProduct.productName}
            onChange={(e) => setEditedProduct({ ...editedProduct, productName: e.target.value })}
          />
          <label>Price</label>
          <input
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
          />
           <label>Quantity</label>
          <input
            type="number"
            value={editedProduct.quantity}
            onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
          />
          <label>About the Product:</label>
      <textarea
        value={editedProduct.description}
        onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
      />
      
          <button onClick={handleUpdateProduct}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
