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
      await fetch("https://xaus-backend-production.up.railway.app/auth/login", {
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
    <Box className="flex  mx-auto items-center justify-center">
      <div className="flex w-3/4 mx-auto mt-12   items-center justify-center">
        <div className="flex  lg:p-7 w-full lg:w-11/12 flex-col lg:flex-row bg-gray-400 rounded-md">
          <div className="flex  lg:w-1/2 w-full ">
            <img className="w-full" src="/Login.svg" alt="LoginImage" />
          </div>
          <form
            className="lg:w-1/2 flex flex-col justify-center w-full  text-center"
            onSubmit={handleSubmit(HandleLogin)}
          >
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ mb: "5px" }}
            >
              Seja bem vindo ao XAUS!
            </Typography>
            <Box
              className="flex flex-col gap-5"
              sx={{
                "& .MuiLoadingButton-root": {
                  color: colors.primary[800],
                  backgroundColor: colors.blueAccent[400],
                },
                "& .MuiLoadingButton-root:hover": {
                  color: colors.primary[800],
                  backgroundColor: colors.blueAccent[500],
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
                <InputLabel htmlFor="filled-adornment-password">
                  Senha
                </InputLabel>
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
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
              >
                <Typography variant="h4">LOGIN</Typography>
              </LoadingButton>
            </Box>
          </form>
        </div>
      </div>
    </Box>
  );
};

export default Login;
