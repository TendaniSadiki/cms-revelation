import React, {useState} from "react";
import { Link} from "react-router-dom";
import Inventory from "../Inventory/Inventory";
import PendingOrders from "../PendingOrders/PendingOrders";
import OrderHistory from "../OrderHistory/OrderHistory";
import AddProductForm from "../AddProduct/AddProduct";
import './Home.css';
function Home() {
  const [activeBtn, setActiveBtn] = useState(0);
  console.log("You clicked button "+activeBtn)
    const toogle=(index) =>{ 
      setActiveBtn(index)
   }
  return (
    <div className="Home">
      {/* <h2>Welcome to the Home Page</h2> */}
      <div className="content">
    <div className="left-side">
      <nav className="sidebar">
       
      <div className="SideLinks"> 
            <Link onClick={()=>toogle(0)}  className={activeBtn === 0 ? 'activebtn' : "activebtn2" } to="/inventory">Inventory</Link>
          
         
            <Link onClick={()=>toogle(1)}  className={activeBtn === 1 ? 'activebtn' : "activebtn2" } to="/pending-orders">Pending Orders</Link>
          
          
            <Link onClick={()=>toogle(2)}  className={activeBtn === 2 ? 'activebtn' : "activebtn2" } to="/order-history">Order History</Link>
         
        </div>
        
         
      </nav>
      <div className="products">
       
        {
                ( activeBtn === 0 ? <div><Inventory /></div> : activeBtn === 1 ? <PendingOrders /> : <OrderHistory /> )
        }
        </div>
       </div>
      <div className="rightbar">
        <AddProductForm/>
      </div>
      </div>
    </div>
  );
}

export default Home;
