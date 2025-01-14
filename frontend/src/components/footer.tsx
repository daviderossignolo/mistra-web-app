import React from "react";

const Footer = () => {
	return (
		<footer className="bg-navbar text-white py-6">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Section 1 */}
					<div>
						<h3 className="font-bold text-lg mb-4">Company</h3>
						<ul>
							<li className="mb-2 hover:text-gray-400">
								<a href="/about">About Us</a>
							</li>
							<li className="mb-2 hover:text-gray-400">
								<a href="/careers">Careers</a>
							</li>
							<li className="hover:text-gray-400">
								<a href="/contact">Contact</a>
							</li>
						</ul>
					</div>

					{/* Section 2 */}
					<div>
						<h3 className="font-bold text-lg mb-4">Support</h3>
						<ul>
							<li className="mb-2 hover:text-gray-400">
								<a href="/faq">FAQ</a>
							</li>
							<li className="mb-2 hover:text-gray-400">
								<a href="/support">Help Center</a>
							</li>
							<li className="hover:text-gray-400">
								<a href="/privacy-policy">Privacy Policy</a>
							</li>
						</ul>
					</div>

					{/* Section 3 */}
					<div>
						<h3 className="font-bold text-lg mb-4">Follow Us</h3>
						<div className="flex space-x-4">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-gray-400"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
									className="w-6 h-6"
								>
									<title>Facebook</title>
									<path d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 24h11.523v-9.288H9.847v-3.622h2.998V8.411c0-2.967 1.805-4.585 4.439-4.585 1.26 0 2.34.093 2.655.135v3.078l-1.823.001c-1.431 0-1.709.682-1.709 1.68v2.202h3.417l-.446 3.622h-2.972V24h5.824C23.4 24 24 23.4 24 22.675v-21.35C24 .6 23.4 0 22.675 0z" />
								</svg>
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-gray-400"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
									className="w-6 h-6"
								>
									<title>Twitter</title>
									<path d="M22.46 6c-.77.35-1.6.57-2.46.67a4.13 4.13 0 0 0 1.82-2.27 8.3 8.3 0 0 1-2.6.98 4.1 4.1 0 0 0-7.03 3.74A11.67 11.67 0 0 1 3.15 4.67a4.08 4.08 0 0 0-.55 2.07c0 1.43.73 2.7 1.84 3.44a4.1 4.1 0 0 1-1.86-.5v.05c0 2 .14 3.02 3 3.43a4.1 4.1 0 0 1-1.86.07c.55 1.7 2.15 2.94 4.02 2.92A8.23 8.23 0 0 1 1.6 19.13 11.63 11.63 0 0 0 7.29 21c6.74 0 10.8-5.59 10.8-10.44v-.48A7.72 7.72 0 0 0 22.46 6z" />
								</svg>
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-gray-400"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
									className="w-6 h-6"
								>
									<title>LinkedIn</title>
									<path d="M20.447 20.452h-3.554v-5.569c0-1.327-.473-2.234-1.66-2.234-.905 0-1.445.613-1.682 1.205-.086.209-.108.5-.108.79v5.808H9.89V9.75h3.415v1.435c.455-.7 1.272-1.7 3.099-1.7 2.26 0 3.945 1.435 3.945 4.515v6.452zM5.337 8.632c-1.144 0-1.887.752-1.887 1.74 0 .975.723 1.74 1.853 1.74h.022c1.144 0 1.887-.765 1.887-1.74-.022-.988-.743-1.74-1.875-1.74zM7.313 20.451H3.37V9.751h3.942v10.7zM22.225 0H1.771C.791 0 0 .787 0 1.759v20.468C0 23.22.791 24 1.771 24h20.451c.98 0 1.779-.78 1.779-1.771V1.759C24 .787 23.205 0 22.225 0z" />
								</svg>
							</a>
						</div>
					</div>
				</div>

				<div className="mt-8 border-t border-gray-700 pt-6 text-center">
					<p className="text-sm">
						&copy; {new Date().getFullYear()} Your Company. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
