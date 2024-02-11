import { LoadingButton } from "@mui/lab";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { tokens } from "../styles/Themes";
import { useTheme } from "@emotion/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";

const PasswordEmailSender = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const handleSendEmail = async (data) => {
    console.log(data);
    setLoading(true);
    await fetch(
      import.meta.env.VITE_PUBLIC_BACKEND_URL + "/password/generateToken",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      }
    ).then((res) => {
      if (res.ok) {
        toast.success("Email enviado com sucesso!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return navigate("/login");
      } else {
        toast.error("Não foi possível enviar o email!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    setLoading(false);
  };

  return (
    <>
      <Box className="flex  mx-auto items-center justify-center">
        <div className="flex w-3/4 mx-auto mt-12   items-center justify-center">
          <div className="flex  lg:p-7 w-full lg:w-11/12 flex-col lg:flex-row bg-gray-400 rounded-md">
            <div className="flex  lg:w-1/2 w-full ">
              <img
                className="w-[87%]"
                src="/ResetPasswordEmail.svg"
                alt="ResetpasswordImage"
              />
            </div>
            <form
              className="lg:w-1/2 flex flex-col justify-center w-full  text-center"
              onSubmit={handleSubmit(handleSendEmail)}
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
                </FormControl>
                <LoadingButton
                  type="submit"
                  endIcon={<SendIcon />}
                  loading={loading}
                  loadingPosition="end"
                  variant="contained"
                >
                  <Typography variant="h4">Enviar email</Typography>
                </LoadingButton>
                <Link to={"/Login"}>Voltar para o login</Link>
              </Box>
            </form>
          </div>
        </div>
      </Box>
    </>
  );
};

export default PasswordEmailSender;
