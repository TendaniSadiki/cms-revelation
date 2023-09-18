import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import './Inventory.css';
import { FaTrash, FaTshirt } from 'react-icons/fa'; // Import the trash icon

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    // Fetch user's products from Firestore
    const user = auth.currentUser;
    if (user) {
      const userUid = user.uid;
      const productsCollectionRef = collection(db, "admins", userUid, "products");

      const fetchProducts = async () => {
        try {
          const querySnapshot = await getDocs(productsCollectionRef);
          const productsData = [];
          querySnapshot.forEach((doc) => {
            productsData.push({ id: doc.id, ...doc.data() });
          });
          setProducts(productsData);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
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

  const handleColorFilter = (color) => {
    setSelectedColor(color);
  };

  const resetColorFilter = () => {
    setSelectedColor(null);
  };

  return (
    <div>
      <h2>Inventory</h2>
     
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {(!selectedColor || product.availableColors.includes(selectedColor)) && (
              <div>
                <img src={product.colorImages?.Blue} alt="product" className="InventoryImage" />
                <img src={product.colorImages?.Red} alt="product" className="InventoryImage" />           
                <img src={product.colorImages?.Green} alt="product" className="InventoryImage" />   
                <p>Product Name: {product.productName}</p>
                <p>Price: {product.price}</p>
                <p>Colors: {product.availableColors.join(", ")}</p>
                <button onClick={() => handleDeleteProduct(product.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
