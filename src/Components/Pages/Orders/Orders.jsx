import React,{useContext,useState,useEffect} from 'react'
import Layout from '../../../Components/Layout/Layout';
import Classes from "./Orders.modules.css"
import {db} from "../../../Utility/firebase"
import {DataContext} from "../../../Components/DataProvider/DataProvider";
import ProductCard from "../../../Components/Product/ProductCard";


function Orders() {
   const [{user},dispatch]=useContext(DataContext);
   const [orders,setOrders]=useState([])

   useEffect(()=>{
     if(user){
      db.collection("users")
				.doc(user.uid)
				.collection("orders")
				.orderBy("created", "desc")
				.onSnapshot((snapshot) => {
					console.log(snapshot);
					setOrders(
						snapshot.docs.map((doc) => ({
							id: doc.id,
							data: doc.data(),
						}))
					);
				});

    }else{
      setOrders([])

    }


   },[])

  return (
    <Layout>
    <section className={Classes.container}>
      <div className={Classes.orders__container}>
        <h2>Your Orders</h2>
        {orders?.length === 0 && <div style={{padding:"20px"}}>you don't have orders yet.</div>}
        {/* order item */}
        <div>{
          orders?.map((eachOrder,i)=>{
            return (
              <div key={i}>
                <hr/>
                <p>Order ID:{eachOrder?.id}</p>
                {
                  eachOrder?.data?.basket?.map((order)=>(
                    <ProductCard flex={true} product={order} key={order.id}/>
                  ))}

              </div>
            )
          })
          }</div>
      </div>
    </section>
    </Layout>
  )
}

export default Orders