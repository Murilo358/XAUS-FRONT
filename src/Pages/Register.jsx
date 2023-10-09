import { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import { hasPermission } from "../Permissions/Permissions";
import { actions } from "../Permissions/Constants";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import InputMask from "react-input-mask";

import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Header from "../Components/Header/Header";
import { useTheme } from "@emotion/react";
import { tokens } from "../styles/Themes";

const Register = () => {
  const { jwtToken, roles } = useContext(AuthContext);
  const permission = hasPermission(roles, actions.CREATE_USER);
  const navigate = useNavigate();
  const [allRoles, setAllRoles] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const getAllRoles = async () => {
      await fetch("http://localhost:8080/auth/allRoles").then(async (res) =>
        setAllRoles(await res.json())
      );
    };
    getAllRoles();
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    data.birthDate = dayjs(new Date(data.birthDate)).format("YYYY-MM-DD");

    await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-type": "application/json",
      },

      body: JSON.stringify(data),
    }).then(async (res) => {
      console.log(res);
      if (res.ok) {
        toast.success("Usuário criado com sucesso!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return navigate("/Login");
      } else if (res.status == 400) {
        const response = await res.json();
        toast.error(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  return (
    <>
      {permission ? (
        <div className="flex flex-col text-center items-center">
          <Header
            className="m-6"
            title="Registrar "
            subtitle="Registre novos usuários para o XAUS"
          />
          <div className="flex w-3/4 mx-auto mt-12   items-center justify-center">
            <div className="flex  lg:p-7 w-full lg:w-11/12 flex-col lg:flex-row bg-gray-400 rounded-md">
              <div className="flex  lg:w-1/2 w-full ">
                <img
                  className="w-full"
                  src="/registerImg.svg"
                  alt="registerImage"
                />
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4  lg:w-1/2 w-full "
              >
                <TextField
                  {...register("name", { required: true })}
                  id="name"
                  label="Nome*"
                  name="name"
                  error={!!errors.name}
                />
                {errors?.name && (
                  <p className="text-red-600">O campo nome é obrigatório</p>
                )}
                <FormControl variant="outlined">
                  <InputMask
                    {...register("cpf", { required: true })}
                    mask="999.999.999-99"
                  >
                    {() => (
                      <TextField
                        id="cpf"
                        label="CPF*"
                        name="cpf"
                        error={!!errors.cpf}
                      />
                    )}
                  </InputMask>
                  {errors?.cpf && (
                    <p className="text-red-600">O campo CPF é obrigatório</p>
                  )}
                </FormControl>
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
                          {showPassword ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors?.password && (
                    <p className="text-red-600">O campo senha é obrigatório</p>
                  )}
                </FormControl>
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
                <Controller
                  rules={{ required: true }}
                  name="birthDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <DatePicker
                        disableFuture
                        value={field.value}
                        label="Data de nascimento*"
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        error={!!errors.birthDate}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            error: !!error,
                          },
                        }}
                      />
                    );
                  }}
                />
                {errors?.birthDate && (
                  <p className="text-red-600">
                    O campo data de nascimento é obrigatório
                  </p>
                )}

                <FormControl>
                  <InputLabel id="role-label">Cargo*</InputLabel>
                  <Select
                    {...register("role", { required: true })}
                    labelId="role-label"
                    id="role"
                    label="Cargo*"
                    name="role"
                    error={!!errors.role}
                  >
                    {allRoles.length > 0 &&
                      allRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                  </Select>
                  {!!errors.role && (
                    <p className="text-red-600">O campo cargo é obrigatório</p>
                  )}
                </FormControl>
                <button
                  style={{ backgroundColor: colors.blueAccent[600] }}
                  type="submit"
                  className="p-4  "
                >
                  REGISTRAR
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <p>Você não tem permissão :(</p>
      )}
    </>
  );
};

export default Register;
