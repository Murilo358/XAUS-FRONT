import { useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { tokens } from "../styles/Themes";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import SendIcon from "@mui/icons-material/Send";
import AuthContext from "../Contexts/AuthContext";

const PasswordRecover = () => {
  const { token } = useParams();
  const { authenticated } = useContext(AuthContext);
  const [validPswdToken, setValidPswdToken] = useState();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const handleValidateToken = async (token) => {
      setLoading(true);
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
            let response = await res.json();

            if (!res.ok) {
              if (response?.message === "Link already expired, resend link") {
                toast.error("Token expirado, por favor solicite novamente!", {
                  position: toast.POSITION.TOP_RIGHT,
                });
              } else {
                toast.error("Token invalido!", {
                  position: toast.POSITION.TOP_RIGHT,
                });
              }

              return navigate("/Login");
            }

            setValidPswdToken(response);
          });
        } catch (error) {
          console.log("error", error);
        }
      }
      setLoading(false);
    };

    if (authenticated) {
      toast.error(
        "Você não pode estar logado para se conectar a essa página!",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
      return navigate("/");
    } else {
      handleValidateToken(token);
    }
  }, [authenticated]);

  const handleResetPassword = async (data) => {
    setLoading(true);
    try {
      await fetch(
        import.meta.env.VITE_PUBLIC_BACKEND_URL +
          "/password/reset-password?token=" +
          token,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then((res) => {
        if (res.ok) {
          toast.success("Senha alterada com sucesso!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return navigate("/login");
        } else {
          toast.error("Não foi possível alterar a senha!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  return (
    <>
      {!loading && validPswdToken && (
        <Box className="flex  mx-auto items-center justify-center">
          <div className="flex w-3/4 mx-auto mt-12   items-center justify-center">
            <div className="flex  lg:p-7 w-full lg:w-11/12 flex-col lg:flex-row bg-gray-400 rounded-md">
              <div className="flex  lg:w-1/2 w-full ">
                <img
                  className="w-[87%]"
                  src="/ResetPassword.svg"
                  alt="ResetpasswordImage"
                />
              </div>
              <form
                className="lg:w-1/2 flex flex-col justify-center w-full  text-center"
                onSubmit={handleSubmit(handleResetPassword)}
              >
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ mb: "5px" }}
                >
                  Recupere sua senha
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
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="filled-adornment-password">
                      Nova senha
                    </InputLabel>
                    <OutlinedInput
                      {...register("newPassword", { required: true })}
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
                            {showPassword ? (
                              <MdVisibilityOff />
                            ) : (
                              <MdVisibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors?.newPassword && (
                      <p className="text-red-600">
                        O campo senha é obrigatório
                      </p>
                    )}
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="filled-adornment-confirm-password">
                      Confirme a senha
                    </InputLabel>
                    <OutlinedInput
                      {...register("confirmPassword", {
                        required: true,
                        validate: (val) => {
                          if (watch("newPassword") != val) {
                            return "As senhas precisam ser iguais";
                          }
                          if (
                            !val.match(
                              "^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{6,20}$"
                            )
                          ) {
                            return "A senha precisa conter no mínimo 6 caracteres, um caractere maiúsculo, e um caractere especial";
                          }
                        },
                      })}
                      id="filled-adornment-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      error={!!errors.confirmPassword}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <MdVisibilityOff />
                            ) : (
                              <MdVisibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors?.confirmPassword?.message ? (
                      <p className="text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    ) : errors?.confirmPassword ? (
                      <p className="text-red-600">
                        A confirmação de senha é obrigatória
                      </p>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  <LoadingButton
                    type="submit"
                    endIcon={<SendIcon />}
                    loading={loading}
                    loadingPosition="end"
                    variant="contained"
                  >
                    <Typography variant="h4">ALTERAR A SENHA</Typography>
                  </LoadingButton>
                </Box>
              </form>
            </div>
          </div>
        </Box>
      )}
    </>
  );
};

export default PasswordRecover;
