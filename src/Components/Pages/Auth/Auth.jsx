import React, { useContext, useState } from "react";
import classes from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../Utility/firebase";
import { ClipLoader } from "react-spinners";
import { DataContext } from "../../../Components/DataProvider/DataProvider";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { Type } from "../../../Utility/action.type";
import { useLocation } from "react-router-dom";
function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState({
		signIn: false,
		signUp: false,
	});
	const [{ user }, dispatch] = useContext(DataContext);
	const navigate = useNavigate()
	const navStateData= useLocation();
	// console.log(user);
	const authHandler = async (e) => {
		e.preventDefault();
		console.log(e.target.name);
		if (e.target.name == "signin") {
			// firebase auth
			setLoading({ ...loading, signIn: true });
			signInWithEmailAndPassword(auth, email, password)
				.then((userInfo) => {
					dispatch({
						type: Type.SET_USER,
						user: userInfo.user,
					});
					// console.log(userInfo);
					setLoading({ ...loading, signIn: false });
					navigate(navStateData?.state?.redirect || "/");
				})
				.catch((err) => {
					console.log(err.message);
					setError(err.message);
					setLoading({ ...loading, signIn: false });
				});
		} else {
			setLoading({ ...loading, signUp: true });
			createUserWithEmailAndPassword(auth, email, password)
				.then((userInfo) => {
					console.log(userInfo);
					dispatch({
						type: Type.SET_USER,
						user: userInfo.user,
					});
					setLoading({ ...loading, signUp: false });
					navigate(navStateData?.state?.redirect || "/");
				})
				.catch((err) => {
					console.log(err);
					setError(err.message);
					setLoading({ ...loading, signUp: false });
				});
		}
	};
	//   console.log(password,email);
	return (
		<section className={classes.login}>
			{/* logo */}
			<Link>
				<img
					src="https://logospng.org/download/amazon/logo-amazon-2048.png"
					alt=""
				/>
			</Link>
			{/* form  */}
			<div className={classes.login_container}>
				<h1>Sign In</h1>
				{navStateData.state.msg && (
					<small
						style={{
							padding: "5px",
							textAlign: "center",
							color: "red",
							fontWeight: "bold",
						}}
					>
						{navStateData.state.msg}
					</small>
				)}
				<form action="">
					<div>
						<lable htmlFor="email">Email</lable>
						<input type="email" id="email" />
					</div>
					<div>
						<lable htmlFor="password">Password</lable>
						<input type="password" id="password" />
					</div>
					<button className={classes.login__signInButton}>Sign In</button>
					{loading.signIn ? (
						<ClipLoader color="#000" size={15}></ClipLoader>
					) : (
						"sign In"
					)}
					{/* agreement */}
					<p>
						By signing-in you agree to the AMAZON FAKE CLONE Conditionsof Use &
						Sale.Please see our privacy Notice, our Cookie Notice and our
						Interest-Based Ads Notice.
					</p>
					{/* create account btn */}
					<button
						type="submit"
						name="sighnup"
						onClick={authHandler}
						className={classes.login__registerButton}
					>
						{loading.signUp ? (
							<ClipLoader color="#000" size={15}></ClipLoader>
						) : (
							"Create your Amazon Account"
						)}
					</button>
					{error && <small style={{ paddingTop: "5px", color: "red" }}></small>}
				</form>
			</div>
		</section>
	);
}

export default Auth;
