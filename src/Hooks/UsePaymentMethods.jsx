import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import AuthContext from "../Contexts/AuthContext";

const UsePaymentMethods = () => {
  const [methods, setMethods] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { jwtToken } = useContext(AuthContext);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const response = await fetch(
          `https://xaus-backend.up.railway.app/payments/getAll`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setMethods(await response.json());
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { methods, error, loading };
};

export default UsePaymentMethods;
