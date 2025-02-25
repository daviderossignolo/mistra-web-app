import type React from "react";

const ErrorPage: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<h1 className="text-4xl font-extrabold text-navbar-hover mb-4">
				Errore 404
			</h1>
			<p className="text-base text-navbar-hover">
				La pagina richiesta non è stata trovata.
			</p>
			<button
				onClick={() => {
					window.location.href = "/home";
				}}
				className="mt-6 text-white bg-navbar-hover p-2 rounded-lg font-medium font-accessible-font"
				type="button"
			>
				Torna alla Home
			</button>
		</div>
	);
};

export default ErrorPage;
