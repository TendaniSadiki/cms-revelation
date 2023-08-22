import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import './Inventory.css'
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

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
          <input
            type="text"
            value={editedProduct.productName}
            onChange={(e) => setEditedProduct({ ...editedProduct, productName: e.target.value })}
          />
          <input
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
          />
          <button onClick={handleUpdateProduct}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
