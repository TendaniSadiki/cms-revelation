import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import './Inventory.css';
import { FaTshirt } from 'react-icons/fa';
import Modal from "./Modal";

const Inventory = ({ categories, types, sizes }) => { // Pass categories, types, and sizes as props
  const [products, setProducts] = useState([]);
  const [selectedColor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
    <div className="Inventory">
      <h2>Inventory</h2>
     
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {(!selectedColor || product.availableColors.includes(selectedColor)) && (
              <div>
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
                    }
                    alt="product"
                    className="InventoryImage"
                    onClick={() => openModal(product)}
                  />
                ) : (
                  <FaTshirt size={50} onClick={() => openModal(product)} />
                )}
                <p>Product Name: {product.productName}</p>
                <p>Price: {product.price}</p>
                <p>Colors: {product.availableColors.join(", ")}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        product={selectedProduct}
        categories={categories} // Pass categories as a prop
        types={types} // Pass types as a prop
        sizes={sizes} // Pass sizes as a prop
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default Inventory;
