import { useContext, useState } from "react";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import { useTheme } from "@emotion/react";
import { useForm } from "react-hook-form";
import { tokens } from "../styles/Themes";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { LoadingButton } from "@mui/lab";

// eslint-disable-next-line react/prop-types
const Login = ({ setLoginUpdated }) => {
  const cookies = new Cookies();

  const { setAuthenticated } = useContext(AuthContext);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [loading, setLoading] = useState(false);

  const HandleLogin = async (data) => {
    try {
      setLoading(true);
      await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify(data),
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
          setLoginUpdated(true);
          setLoading(false);
          return navigate("/");
        }
        setLoading(false);
        throw new Error("Não foi possivel logar");
      });
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex  mx-auto items-center justify-center">
      <form onSubmit={handleSubmit(HandleLogin)}>
        <Box
          className="flex flex-col gap-5"
          sx={{
            "& .MuiLoadingButton-root": {
              color: colors.primary[800],
              backgroundColor: colors.greenAccent[500],
            },
            "& .MuiLoadingButton-root:hover": {
              color: colors.primary[800],
              backgroundColor: colors.greenAccent[700],
            },
          }}
        >
          <TextField
            {...register("email", { required: true })}
            id="email"
            label="Email*"
            name="email"
            type={"email"}
            error={!!errors.email}
          />
          {errors?.email && (
            <p className="text-red-600">O campo e-mail é obrigatório</p>
          )}
          <FormControl variant="outlined">
            <InputLabel htmlFor="filled-adornment-password">Senha</InputLabel>
            <OutlinedInput
              {...register("password", { required: true })}
              id="filled-adornment-password"
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors?.password && (
              <p className="text-red-600">O campo senha é obrigatório</p>
            )}
          </FormControl>

          <LoadingButton
            type="submit"
            backgroundColor={colors.greenAccent[400]}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            <span>
              <Typography variant="h4">LOGIN</Typography>
            </span>
          </LoadingButton>
        </Box>
      </form>
    </div>
  );
};

export default Login;
