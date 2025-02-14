import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
	const [email, setEmail] = useState("test@example.com");
	const [password, setPassword] = useState("test01");
	const [error, setError] = useState("");
	// eslint-disable-next-line
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:1337/api/auth/local", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					identifier: email,
					password: password,
				}),
			});

			const data = await response.json();
			if (data.jwt) {
				localStorage.setItem("token", data.jwt);
				window.location.href = "/home";
			} else {
				setError("Credenziali non valide");
			}
		} catch (err) {
			setError("Si è verificato un errore");
		}
	};

	return (
		<div className="flex justify-center items-center bg-gray-100 py-8 font-accesible-font text-navbar-hover">
			<div className="w-full max-w-md flex flex-col items-center bg-white shadow-md rounded-lg p-4">
				<div className="w-full bg-navbar-hover px-2 py-2">
					<h2 className="m-0 text-center text-[42px] font-bold font-accesible-font text-white">
						Login
					</h2>
				</div>
				<form
					onSubmit={handleLogin}
					className="space-y-6 mt-3"
					aria-label="Form di login"
				>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-bold font-accesible-font text-navbar-hover"
						>
							Email:
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-navbar-hover focus:border-navbar-hover text-navbar-hover"
							aria-describedby="email-error"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-bold font-accesible-font text-navbar-hover"
						>
							Password:
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-navbar-hover focus:border-navbar-hover text-navbar-hover"
							aria-describedby="password-error"
						/>
					</div>
					{error && (
						<p id="email-error" className="text-sm text-red-600" role="alert">
							{error}
						</p>
					)}
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-navbar-hover rounded-md"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
