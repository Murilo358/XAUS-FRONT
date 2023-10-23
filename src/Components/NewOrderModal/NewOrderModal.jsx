import { useTheme } from "@emotion/react";
import { tokens } from "../../styles/Themes";
import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { actions } from "../../Permissions/Constants";
import Header from "../Header/Header";
import { DataGrid } from "@mui/x-data-grid";
import UsePaymentMethods from "../../Hooks/UsePaymentMethods";
import { formatPaymentMethods } from "../Utils";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import { hasPermission } from "../../Permissions/Permissions";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import InputMask from "react-input-mask";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

// eslint-disable-next-line react/prop-types
const NewOrderModal = ({ openModal, setOpenModal, products }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { methods } = UsePaymentMethods();
  const { userId, jwtToken, roles } = useContext(AuthContext);
  const permission = hasPermission(roles, actions.CREATE_ORDER);

  // const selectedValues = useMemo(
  //   () => allValues.filter((v) => v.selected),
  //   [allValues]
  // );

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  const [value, setValue] = useState("existing");
  const [clientSelected, setClientSelected] = useState();

  const [clientId, setClientId] = useState(1);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const productsData = [];
    // eslint-disable-next-line react/prop-types
    products.forEach((product) => {
      productsData.push([product.id, parseInt(product.buying)]);
    });

    const formData = {
      paymentMethod: data.methods,
      products: productsData,
      userId: userId,
    };

    // await fetch("http://localhost:8080/orders/create", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${jwtToken}`,
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // }).then(async (res) => {
    //   console.log(res);
    //   if (res.ok) {
    //     toast.success("Pedido criado com sucesso!", {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //     setOpenModal(false);
    //     return;
    //   } else if (res.status == 400) {
    //     const response = await res.json();
    //     setOpenModal(false);
    //     toast.error(response.message, {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   }
    // });
  };

  const onClientFormSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const allClients = await fetch("http://localhost:8080/clients/getall", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }).then(async (res) => {
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

  const columns = [
    { field: "id", flex: 1, headerName: "ID" },
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      cellClassName: "name-column-cell",
    },
    {
      field: "description",
      headerName: "Descrição",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "price",
      headerName: "Valor",
      headerAlign: "center",
      align: "center",
      type: "number",

      renderCell: ({ row: { price } }) => {
        return (
          <Box>
            <Typography variant="p">R$ {price}</Typography>
          </Box>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Quantidade disponivel",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },

    {
      field: "buying",
      headerName: "Qtt a comprar",
      sortable: false,
    },
    {
      field: "totalProductPrice",
      headerName: "Total",
      headerAlign: "center",
      align: "center",
      type: "number",

      renderCell: ({ row: { price, buying } }) => {
        return (
          <Box>
            <Typography variant="p">R$ {price * buying}</Typography>
          </Box>
        );
      },
    },
  ];

  const handleClose = () => {
    setOpenModal(false);
  };

  let totalPrice = 0;

  // eslint-disable-next-line react/prop-types
  products.forEach((product) => {
    totalPrice += product.price * product.buying;
  });

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box
        className="lg:w-[50%] w-[80%]"
        sx={{
          ...style,

          backgroundColor: colors.primary[500],
          color: colors.grey[100],
        }}
      >
        <Header
          title="Resumo do pedido"
          subtitle="Visualize o resumo antes de finalizar o pedido"
        />
        <Box
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
          }}
        >
          <DataGrid
            sx={{
              "& .MuiDataGrid-footerContainer": {
                display: "none !important",
              },
            }}
            className=" w-full mb-4"
            editMode="row"
            initialState={{
              sorting: {
                sortModel: [{ field: "name", sort: "asc" }],
              },
            }}
            rows={products}
            columns={columns}
          />
        </Box>

        <Box
          sx={{
            "&  MuiAutocomplete-endAdornment": {
              backgroundColor: "red !important",
            },
            "&  css-1q60rmi-MuiAutocomplete-endAdornment": {
              backgroundColor: "red !important",
            },
            "& label.Mui-focused": {
              color: colors.greenAccent[300],
            },
            "& .MuiAutocomplete-root": {
              color: colors.greenAccent[300],
            },

            "& .MuiInputBase-root": {
              borderColor: colors.grey[300],

              "&:hover fieldset": {
                borderColor: colors.grey[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.greenAccent[300],
              },
            },
          }}
        >
          <form onSubmit={handleSubmit(onClientFormSubmit)}>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Cliente
              </FormLabel>
              <RadioGroup row value={value} onChange={handleChange}>
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
                  label="Novo cliente"
                />
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
              </RadioGroup>
              {value === "existing" && (
                <Autocomplete
                  sx={{ width: 350, mb: 1 }}
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
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
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
                  <Box className="flex w-100 gap-2">
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
                        <p className="text-red-600">
                          O campo CPF é obrigatório
                        </p>
                      )}
                    </FormControl>
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
            </FormControl>
          </form>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="flex justify-between">
            <Box
              sx={{
                "&  MuiAutocomplete-endAdornment": {
                  backgroundColor: "red !important",
                },
                "&  css-1q60rmi-MuiAutocomplete-endAdornment": {
                  backgroundColor: "red !important",
                },
                "& label.Mui-focused": {
                  color: colors.greenAccent[300],
                },
                "& .MuiAutocomplete-root": {
                  color: colors.greenAccent[300],
                  backgroundColor: colors.greenAccent[300],
                },
                "& .MuiInputBase-inputTypeSearch": {
                  borderBottomColor: colors.greenAccent[300],
                },
                "& .MuiInputBase-root": {
                  borderColor: colors.grey[300],

                  "&:hover fieldset": {
                    borderColor: colors.grey[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.greenAccent[300],
                  },
                },
              }}
            >
              <FormControl>
                <InputLabel id="methods-label">Método de pagamento*</InputLabel>
                <Select
                  sx={{
                    width: 350,
                  }}
                  {...register("methods", { required: true })}
                  labelId="methods-label"
                  id="methods"
                  label="Método de pagamento*"
                  name="methods"
                  error={!!errors.methods}
                >
                  {methods &&
                    methods.map((method) => (
                      <MenuItem key={method.paymentMethod} value={method.id}>
                        {formatPaymentMethods(method.paymentMethod)}
                      </MenuItem>
                    ))}
                </Select>
                {!!errors.methods && (
                  <p className="text-red-600">
                    O campo método de pagamento é obrigatório
                  </p>
                )}
              </FormControl>
            </Box>
            <Box className="flex">
              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ mb: "5px", mt: "8px" }}
              >
                Valor total: R${totalPrice}
              </Typography>
            </Box>
          </Box>
        </form>
        {permission && (
          <Button
            type="submit"
            sx={{
              "&:hover": {
                color: colors.blueAccent[600],
                backgroundColor: colors.greenAccent[500],
              },
              padding: "10px",
              width: "100%",
              mt: "15px",
              fontSize: "16px",
              color: colors.blueAccent[900],
              backgroundColor: colors.greenAccent[400],
            }}
          >
            Gerar pedido
          </Button>
        )}

        <Button
          sx={{
            position: "absolute",
            top: "0%",
            left: "93%",
            color: colors.grey[100],
          }}
          onClick={handleClose}
        ></Button>
      </Box>
    </Modal>
  );
};

export default NewOrderModal;
