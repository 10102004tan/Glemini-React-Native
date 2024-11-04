/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./App.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./app/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#1C2833',
				background: '#ffffff',
				overlay: 'rgba(0, 0, 0, 0.2)',
				error: '#e84118',
				success: '#4cd137',
				text: '#000000',
				gray: '#757575',
				qblue: '#008BE1',
				qgreen: '#0BCA5E',
				qyellow: '#DEA807',
				qred: '#F22626',
				qtheme: '#1C2833',
			},
			fontFamily: {
				pthin: ['Poppins-Thin', 'sans-serif'],
				pextralight: ['Poppins-ExtraLight', 'sans-serif'],
				plight: ['Poppins-Light', 'sans-serif'],
				pregular: ['Poppins-Regular', 'sans-serif'],
				pmedium: ['Poppins-Medium', 'sans-serif'],
				psemibold: ['Poppins-SemiBold', 'sans-serif'],
				pbold: ['Poppins-Bold', 'sans-serif'],
				pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
				pblack: ['Poppins-Black', 'sans-serif'],
			},
		},
	},
	plugins: [
		
	],
};
