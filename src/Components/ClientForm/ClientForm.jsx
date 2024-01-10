import React from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import InputMask from "react-input-mask";
import { useTheme } from "@emotion/react";
import { tokens } from "../../styles/Themes";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";

// eslint-disable-next-line react/prop-types
const ClientForm = ({ clientId, setClientId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [radiosDisabled, setRadioDisabled] = useState(false);

  const onClientFormSubmit = async (data) => {
    const newClientId = await fetch(
      "https://xaus-backend-production.up.railway.app/auth/allRoles:8080/clients/create",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(data),
      }
    ).then(async (res) => {
      if (res.ok) {
        const response = await res.json();
        setRadioDisabled(true);
        return response.id;
      }
      Swal.fire({
        background: colors.primary[400],
        color: colors.grey[100],
        icon: "error",
        title: "Oops...",
        text: "Erro ao buscar todos os clientes",
      });
    });

    setClientId(newClientId);
  };
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState("existing");
  const [clientSelected, setClientSelected] = useState();
  const { jwtToken } = useContext(AuthContext);

  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();
  const handleChange = (e) => {
    setClientId(1);
    setValue(e.target.value);
  };

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const allClients = await fetch(
        "https://xaus-backend-production.up.railway.app/auth/allRoles:8080/clients/getall",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      ).then(async (res) => {
        if (res.ok) {
          const response = await res.json();

          return response;
        }
        Swal.fire({
          background: colors.primary[400],
          color: colors.grey[100],
          icon: "error",
          title: "Oops...",
          text: "Erro ao buscar todos os clientes",
        });
      });

      if (active) {
        setOptions([...allClients.filter((client) => client.id !== 1)]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <form onSubmit={handleSubmit(onClientFormSubmit)}>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Cliente</FormLabel>
        <RadioGroup row value={value} onChange={handleChange}>
          {!radiosDisabled && (
            <FormControlLabel
              value="existing"
              control={
                <Radio
                  sx={{
                    color: colors.greenAccent[400],
                    "&.Mui-checked": {
                      color: colors.greenAccent[200],
                    },
                  }}
                />
              }
              label="Cliente cadastrado"
            />
          )}

          <FormControlLabel
            value="new"
            control={
              <Radio
                sx={{
                  color: colors.greenAccent[400],
                  "&.Mui-checked": {
                    color: colors.greenAccent[200],
                  },
                }}
              />
            }
            label={
              radiosDisabled
                ? "Novo cliente - CRIADO COM SUCESSO!"
                : "Novo cliente"
            }
          />
          {!radiosDisabled && (
            <FormControlLabel
              value="without"
              control={
                <Radio
                  sx={{
                    color: colors.greenAccent[400],
                    "&.Mui-checked": {
                      color: colors.greenAccent[200],
                    },
                  }}
                />
              }
              label="Sem cadastro"
            />
          )}
        </RadioGroup>
        {value === "existing" && (
          <Autocomplete
            className="w-[250px] lg:w-[350px] mb-1"
            open={open}
            value={clientSelected}
            onChange={(event, newValue) => {
              setClientSelected(newValue);
              setClientId(newValue.id);
            }}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name + " - " + option.cpf}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Clientes"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        )}
        {value === "new" && (
          <>
            {!radiosDisabled && (
              <>
                <Box className="flex w-100 gap-2 ">
                  <Box>
                    <TextField
                      {...register("email", { required: true })}
                      id="email"
                      label="Email*"
                      name="email"
                      type={"email"}
                      error={!!errors.email}
                    />
                    {errors?.email && (
                      <p className="text-red-600">
                        O campo e-mail é obrigatório
                      </p>
                    )}
                  </Box>

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
                  <Box>
                    <TextField
                      {...register("name", { required: true })}
                      id="name"
                      label="Nome*"
                      name="name"
                      type={"name"}
                      error={!!errors.name}
                    />
                    {errors?.name && (
                      <p className="text-red-600">O campo nome é obrigatório</p>
                    )}
                  </Box>
                </Box>
                <button
                  style={{
                    backgroundColor: colors.greenAccent[400],
                    color: colors.blueAccent[900],
                  }}
                  type="submit"
                  className="p-4 mt-3 mb-4 rounded-sm "
                >
                  Novo cliente
                </button>
              </>
            )}
          </>
        )}
      </FormControl>
    </form>
  );
};

export default ClientForm;
