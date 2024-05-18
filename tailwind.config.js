/** @type {import('tailwindcss').Config} */

module.exports = {
	presets: [require("@evoluzione/tailwind-config")],
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
};
