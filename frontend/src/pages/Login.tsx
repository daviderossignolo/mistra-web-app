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
				window.location.reload(); // Ricarica la pagina dopo aver salvato il token
			} else {
				setError("Invalid credentials");
			}
		} catch (err) {
			setError("An error occurred");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
				<h2 className="text-2xl font-bold text-center">Login</h2>
				<form onSubmit={handleLogin} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email:
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-navbar-hover focus:border-navbar-hover"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password:
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-navbar-hover focus:border-navbar-hover"
						/>
					</div>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-navbar-hoverhover rounded-md hover:bg-navbar-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
