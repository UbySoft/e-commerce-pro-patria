import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import { lightTheme, darkTheme } from "../src/components/theme/theme";
import createEmotionCache from "../src/components/utils/createEmotionCache";
import { ThemeProvider as CustomThemeProvider } from "../src/components/theme/ThemeContext";
import { ThemeProvider } from "@mui/material/styles";
import LoadingOverlay from "../src/components/utils/LoadingOverlay";
import ThemeColorListener from "../src/components/theme/ThemeColorListener";
import { AlertMeProvider } from "../src/components/layout/alert/AlertMeContext";

import { wrapper } from "/src/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import BlockPage from "./blockPage";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const authEcommerce = useSelector((state) => state.authEcommerce);
  const authUser = useSelector((state) => state.authUser);

  const isAuthenticated = authEcommerce && authUser;
  const requiresAuth = router.pathname.startsWith("/auth");

  const [themeMode, setThemeMode] = React.useState("light");
  const isLoading = useSelector((state) => state.loading);
  const [autoMode, setAutoMode] = React.useState("false");

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedThemeMode = localStorage.getItem("themeMode");
      setAutoMode(localStorage.getItem("autoMode"));
      if (savedThemeMode) {
        setThemeMode(savedThemeMode);
      }
    }
  }, []);

  const toggleThemeMode = (newThemeMode) => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("themeMode", newThemeMode);
      setThemeMode(newThemeMode);
      setAutoMode(localStorage.getItem("autoMode"));
    }
  };

  const appTheme = React.useMemo(() => {
    return {
      ...(themeMode === "dark" ? darkTheme : lightTheme),
      palette: {
        ...(themeMode === "dark" ? darkTheme : lightTheme).palette,
        mode: themeMode,
      },
    };
  }, [themeMode]);

  useEffect(() => {
    if (requiresAuth && !isAuthenticated) {
      router.push(
        `/blockPage?titolo=ACCESSO NON AUTORIZZATO&descrizione=Sembra che tu non abbia l'autorizzazione necessaria per accedere a questa area. Al momento, non hai i privilegi per visualizzare o navigare attraverso queste pagine. Per favore, effettua nuovamente l'accesso per recuperare i tuoi diritti di accesso. &desc_azione=Clicca qui per effettuare il login e accedere.

        Ti ringraziamo per la comprensione e la collaborazione.&redirectTo=/`
      );
    }
  }, [requiresAuth, isAuthenticated]);

  return (
    <>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={appTheme}>
          <AlertMeProvider>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <CustomThemeProvider toggleThemeMode={toggleThemeMode}>
              {autoMode === "true" ? <ThemeColorListener setThemeMode={setThemeMode} /> : <></>}
              <CssBaseline />
              {isLoading && <LoadingOverlay />}
              <Component {...pageProps} />
            </CustomThemeProvider>
          </AlertMeProvider>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
