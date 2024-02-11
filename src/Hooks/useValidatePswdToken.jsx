import { useEffect, useState } from "react";

const useValidatePswdToken = ({ token }) => {
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const handleValidateToken = async () => {
      if (token !== undefined && token !== null) {
        try {
          await fetch(
            import.meta.env.VITE_PUBLIC_BACKEND_URL +
              "/password/validate-token?token=" +
              token,
            {
              method: "GET",
            }
          ).then(async (res) => {
            console.log("fetch executed");
            const response = await res.json();

            setValidToken(response);
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    handleValidateToken();
  }, [token]);

  return validToken;
};

export default useValidatePswdToken;
