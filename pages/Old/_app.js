import {useEffect, useState} from "react";
import {ThemeProvider} from "styled-components";
import {lightTheme, darkTheme, GlobalStyles} from "../styles/ThemeManager";
import Header from "../components/Header";
import ThemeContext from "../contexts/ThemeContext"; // Aggiorna il percorso corretto al file ThemeContext.js
import ContDemosComp from "../components/demo/ContDemosComp";
function App() {
	const [userTheme, setUserTheme] = useState(lightTheme);

	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme) {
			setUserTheme(storedTheme === "dark" ? darkTheme : lightTheme);
		} else {
			const prefersDarkMode =
				window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
			setUserTheme(prefersDarkMode ? darkTheme : lightTheme);
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = userTheme === lightTheme ? darkTheme : lightTheme;
		setUserTheme(newTheme);
		localStorage.setItem("theme", newTheme === darkTheme ? "dark" : "light");
	};

	return (
		<ThemeProvider theme={userTheme}>
			<GlobalStyles />
			<ThemeContext.Provider value={{theme: userTheme, toggleTheme}}>
				<Header />
				<ContDemosComp userTheme={userTheme} />
			</ThemeContext.Provider>
		</ThemeProvider>
	);
}

export default App;