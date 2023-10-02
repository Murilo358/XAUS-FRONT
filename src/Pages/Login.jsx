import { useContext } from "react";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const cookies = new Cookies();

  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const HandleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    try {
      await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify(formProps),
      }).then(async (res) => {
        if (res.ok) {
          const response = await res.json();

          const decoded = jwtDecode(response.token);

          await cookies.set("Jwt_token", response.token, {
            expires: new Date(decoded.exp * 1000),
          });
          setAuthenticated(true);
          toast.success("Logado com sucesso!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return navigate("/");
        }
        throw new Error("Não foi possivel logar");
      });
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div className="flex container mx-auto h-screen  items-center justify-center">
      <form onSubmit={(e) => HandleLogin(e)}>
        <input type="email" name="email" placeholder="Insira seu email" />
        <input type="password" name="password" placeholder="Insira sua senha" />
        <button type="submit" className="p-4 bg-red-600 text-slate-50">
          Logar
        </button>
      </form>
    </div>
  );
};

export default Login;
