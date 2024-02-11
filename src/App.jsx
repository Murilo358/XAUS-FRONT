import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import { colorModeContext, tokens, useMode } from "./styles/Themes";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Home from "./Pages/Home";
import AuthContext from "./Contexts/AuthContext";
import { useContext, useEffect } from "react";
import Register from "./Pages/Register";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import Topbar from "./Components/TopBar/Topbar";
import SideBar from "./Components/SideBar/SideBar";
import { useState } from "react";
import Clients from "./Pages/Clients";
import PasswordRecover from "./Pages/PasswordRecover";
import PasswordEmailSender from "./Pages/PasswordEmailSender";

function App() {
  const { validateToken, loading, authenticated } = useContext(AuthContext);
  const [loginUpdated, setLoginUpdated] = useState(false);
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const validatedToken = async () => {
      await validateToken();
    };
    validatedToken();
  }, [loginUpdated]);

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <NotificationButton /> */}
        <div className="app">
          {authenticated && !loading && <SideBar />}
          <main className="content">
            <Box
              sx={{
                "& label.Mui-focused": {
                  color: colors.greenAccent[300],
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: colors.greenAccent[300],
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colors.grey[300],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.grey[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.greenAccent[300],
                  },
                },
              }}
            >
              <Topbar />
              <Routes>
                <Route
                  path="/register"
                  element={
                    authenticated && !loading ? (
                      <Register />
                    ) : (
                      !loading && <Navigate to="/Login" />
                    )
                  }
                />
                <Route
                  path="/clients"
                  element={
                    authenticated && !loading ? (
                      <Clients />
                    ) : (
                      !loading && <Navigate to="/Login" />
                    )
                  }
                />
                <Route
                  path="/"
                  element={
                    authenticated && !loading ? (
                      <Home />
                    ) : (
                      !loading && <Navigate to="/Login" />
                    )
                  }
                />
                <Route
                  path="/products"
                  element={
                    authenticated && !loading ? (
                      <Products />
                    ) : (
                      !loading && <Navigate to="/Login" />
                    )
                  }
                />
                <Route
                  path="/orders"
                  element={
                    authenticated && !loading ? (
                      <Orders />
                    ) : (
                      !loading && <Navigate to="/Login" />
                    )
                  }
                />
                <Route
                  path="/Login"
                  element={<Login setLoginUpdated={setLoginUpdated} />}
                />
                <Route
                  path="/password-recover/:token"
                  element={<PasswordRecover />}
                />
                <Route
                  path="/password-recover-send"
                  element={<PasswordEmailSender />}
                />
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default App;
