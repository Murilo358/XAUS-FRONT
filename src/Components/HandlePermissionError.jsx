import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HandlePermissionError = () => {
  const [errorHandled, setErrorHandled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!errorHandled) {
      toast.error(
        "Você não tem a permissão necessária para entrar nessa página",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
      setErrorHandled(true);
    }
  }, [errorHandled]);

  useEffect(() => {
    return () => {
      setErrorHandled(false); // Reset errorHandled state when component unmounts
    };
  }, []);

  return navigate("/");
};

export default HandlePermissionError;
