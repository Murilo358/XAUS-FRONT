import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import { colorModeContext, useMode } from "./styles/Themes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Home from "./Pages/Home";
import AuthContext from "./Contexts/AuthContext";
import { useContext, useEffect } from "react";
import Register from "./Pages/Register";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import Layout from "./Components/Layout";
import Topbar from "./Components/Topbar";
import SideBar from "./Components/SideBar/SideBar";

function App() {
  const { validateToken, loading, authenticated } = useContext(AuthContext);

  const [theme, colorMode] = useMode();

  useEffect(() => {
    const validatedToken = async () => {
      await validateToken();
    };
    validatedToken();
  }, []);

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <SideBar />
          <main className="content">
            <Topbar />
            <Routes>
              {/* <Route element={<Layout />}> */}
              <Route
                path="/Register"
                element={
                  authenticated && !loading ? (
                    <Register />
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
              {/* </Route> */}
              <Route path="/Login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default App;
