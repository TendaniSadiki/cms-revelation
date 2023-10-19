import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import './Inventory.css';
import { FaTshirt } from 'react-icons/fa'; // Import the trash and T-shirt icons
import Modal from "./Modal"; // Import the Modal component

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [selectedColor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="Inventory"> {/* Apply the Inventory style */}
      <h2>Inventory</h2>
     
       <ul>
        {products.map((product) => (
          <li key={product.id}>
            {(!selectedColor || product.availableColors.includes(selectedColor)) && (
              <div className="productcard">
                {product.colorImages ? (
                  <img
                  src={
                    product.colorImages.Blue ||
                    product.colorImages.Red ||
                    product.colorImages.Green ||
                    product.colorImages.Brown ||
                    product.colorImages.Black ||
                    product.colorImages.White ||
                    product.colorImages.Yellow ||
                    product.colorImages.Orange ||
                    product.colorImages.Purple
                  }                    alt="product"
                    className="InventoryImage" // Apply the InventoryImage style
                    onClick={() => openModal(product)}
                  />
                ) : (
                  <FaTshirt size={50} onClick={() => openModal(product)} /> // Display the T-shirt icon as default
                )}
                <p>Product Name: {product.productName}</p>
                <p>Price: {product.price}</p>
                <p>Colors: {product.availableColors.join(", ")}</p>
               
              </div>
            )}
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} closeModal={closeModal} product={selectedProduct} selectedColor={selectedColor}   onDeleteProduct={handleDeleteProduct} // Make sure this is correctly passed
/>
    </div>
  );
};

export default Inventory;
