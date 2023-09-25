import {  createContext, useState} from "react";
import Cookies from "universal-cookie";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [jwtToken, setJwtToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  let roles = []

const validateToken = async ()=>{
  setLoading(true);
  const cookies = new Cookies();
      const cookiesToken = cookies.get('Jwt_token');
      if (cookiesToken) {
        const response = await fetch("http://localhost:8080/auth/validate", {
          method: 'POST',
          headers: {
            "Content-type": "application/json",
          },
          body: cookiesToken
        });

        if (response.ok) {
          const res = await response.json()
          roles = [res]
          setAuthenticated(true);
          setJwtToken(cookiesToken);
        }
      }

      setLoading(false);

}


    return (
      <>
        <AuthContext.Provider value={{roles, jwtToken, authenticated, setAuthenticated , validateToken, loading}}>
          {children}
        </AuthContext.Provider>
      </>
    );
  };

  export default AuthContext;
