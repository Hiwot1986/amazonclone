import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import Layout from "../../../Components/Layout/Layout";
import { DataContext } from "../../../Components/DataProvider/DataProvider";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../../Api/axios";
import { db } from "../../../Utility/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../../Utility/action.type";
import ProductCard from "../../Product/ProductCard";
import { ClipLoader } from "react-spinners";

function Payment() {
	const [{ user, basket }, dispatch] = useContext(DataContext);
	const totalItem = basket?.reduce((amount, item) => {
		return item.amount + amount;
	}, 0);
	const total = basket.reduce((amount, item) => {
		return item.price * item.amount + amount;
	}, 0);

	const [cardError, setCardError] = useState(null);
	const [processing, setProcessing] = useState(false);

	const Stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setCardError(e.error ? e.error.message : null);
	};

	const handlePayment = async (e) => {
		e.preventDefault();
		try {
			setProcessing(true);

			const response = await axiosInstance.post(
				`/payment/create?total=${total * 100}`
			);
			const clientSecret = response.data?.clientSecret;

			const { paymentIntent, error } = await Stripe.confirmCardPayment(
				clientSecret,
				{
					payment_method: {
						card: elements.getElement(CardElement),
					},
				}
			);

			if (error) {
				setCardError(error.message);
				setProcessing(false);
				return;
			}

			await db
				.collection("users")
				.doc(user.id)
				.collection("orders")
				.doc(paymentIntent.id)
				.set({
					basket: basket,
					amount: paymentIntent.amount,
					created: paymentIntent.created,
				});

			dispatch({ type: Type.EMPTY_BASKET });

			setProcessing(false);
			navigate("/orders", { state: { msg: "You have placed a new order." } });
		} catch (error) {
			console.log(error);
			setProcessing(false);
		}
	};

	return (
		<Layout>
			<div className={classes.Payment__header}>
				Checkout ({totalItem}) items
			</div>

			<section className={classes.Payment}>
				<div className={classes.flex}>
					<h3>Delivery Address</h3>
					<div>
						<div>{user?.email}</div>
						<div>123 React Lane</div>
						<div>Chicago, IL</div>
					</div>
				</div>
				<hr />

				<div className={classes.flex}>
					<h3>Review items and Delivery</h3>
					<div>
						{basket?.map((item) => (
							<ProductCard key={item.id} product={item} flex={true} />
						))}
					</div>
				</div>
				<hr />

				<div className={classes.flex}>
					<h3>Payment methods</h3>
					<div className={classes.Payment__card__container}>
						<div className={classes.Payment__details}>
							<form onSubmit={handlePayment}>
								{cardError && (
									<small style={{ color: "red" }}>{cardError}</small>
								)}

								<CardElement onChange={handleChange} />

								<div className={classes.payment__price}>
									<div>
										<span style={{ display: "flex", gap: "10px" }}>
											<p>Total Order |</p> <CurrencyFormat amount={total} />
										</span>
									</div>
									<button type="submit">
										{processing ? (
											<div className={classes.loading}>
												<ClipLoader color="gray" size={12} />
												<p>Please wait...</p>
											</div>
										) : (
											"Pay Now"
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
}

export default Payment;
