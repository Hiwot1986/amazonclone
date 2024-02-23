import React from "react";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Landing from "./Components/Pages/Landing/Landing";
import Auth from "./Components/Pages/Auth/Auth";
import Payment from "./Components/Pages/Payment/Payment";
import Orders from "./Components/Pages/Orders/Orders";
import Cart from "./Components/Pages/Cart/Cart";
import Results from './Components/Pages/Results/Results'
import ProductDetail from './Components/Pages/ProductDetail/ProductDetail'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute  from "./Components/ProtectedRoute/ProtectedRoute";

const stripePromise = loadStripe(
	"pk_test_51Ol1G1LUmHLXiHl2X6Z60e80wzc6uXy6OAzHRLVH6vNRoYmy8Ll8dPHPPFnTm27X9NP89DgRyVXPnRVMe0CHBPTU00kcfZctbq"
);

function Routing() {
    return (
			<Router>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="auth" element={<Auth />} />
					<Route
						path="payments"
						element={
							<Elements stripe={stripePromise}>
								<Payment />
							</Elements>
						}
					/>
					<Route
						path="/"
						element={
							<ProtectedRoute
								msg={"you must log in to pay"}
								redirect={"/payments"}
							>
								<Elements stripe={stripePromise}>
									<payments />
								</Elements>
							</ProtectedRoute>
						}
					/>
					{/* <Route path="orders" element={<Orders />} /> */}

					<Route
						path="/"
						element={
							<ProtectedRoute
								msg={"you must log in to your orders"}
								redirect={"/orders"}
							>
								<orders stripe={stripePromise}>
									<payments />
								</orders>
							</ProtectedRoute>
						}
					/>

					<Route path="/category/:categoryName" element={<Results />} />
					<Route path="/products/:productId" element={<ProductDetail />} />
					<Route path="cart" element={<Cart />} />
				</Routes>
			</Router>
		);
}

export default Routing;