import './App.css'
import { BrowserRouter, Navigate, Route, Routes  } from "react-router-dom";
import Login from './Pages/Login';
import Home from './Pages/Home';
import AuthContext from './Contexts/AuthContext';
import { useContext, useEffect} from 'react';
import Register from './Pages/Register';
import Products from './Pages/Products';


function App() {



const {validateToken, loading, authenticated} = useContext(AuthContext);

useEffect(()=>{
  const validatedToken = async()=>{
    await validateToken();
  }
  validatedToken();

},[])




  return (
    <>
     <BrowserRouter>
      <Routes>
         <Route
              path="/Login"
              element={<Login/>}
            />
            <Route
              path="/Register"
              element={authenticated && !loading ? <Register/> : !loading && <Navigate to="/Login" /> }
            />
             <Route
            path="/"
            element={authenticated && !loading ? <Home /> : !loading &&  <Navigate to="/Login" />}
          />
           <Route
            path="/products"
            element={authenticated && !loading ? <Products /> : !loading &&  <Navigate to="/Login" />}
          />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
