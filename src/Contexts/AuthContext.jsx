import { createContext, useState } from "react";
import Cookies from "universal-cookie";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [jwtToken, setJwtToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  const validateToken = async () => {
    setLoading(true);
    const cookies = new Cookies();
    const cookiesToken = cookies.get("Jwt_token");
    if (cookiesToken) {
      const response = await fetch("http://3.15.239.137:8080/auth/validate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: cookiesToken,
      });

      if (response.ok) {
        const res = await response.json();
        setUserName(res.userName);
        setUserId(res.userId);

        setRoles(
          res.roles.map(function (item) {
            return item["authority"];
          })
        );
        setAuthenticated(true);
        setJwtToken(cookiesToken);
      }
    }

    setLoading(false);
  };

  const HandleLogout = () => {
    setAuthenticated(false);
    const cookies = new Cookies();
    cookies.remove("Jwt_token");
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          roles,
          jwtToken,
          authenticated,
          setAuthenticated,
          validateToken,
          loading,
          userName,
          userId,
          HandleLogout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
