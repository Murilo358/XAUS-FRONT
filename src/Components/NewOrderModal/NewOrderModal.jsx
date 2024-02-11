import { useTheme } from "@emotion/react";
import { tokens } from "../../styles/Themes";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { actions } from "../../Permissions/Constants";
import Header from "../Header/Header";
import { DataGrid } from "@mui/x-data-grid";
import UsePaymentMethods from "../../Hooks/UsePaymentMethods";
import { formatPaymentMethods } from "../Utils";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import AuthContext from "../../Contexts/AuthContext";
import { hasPermission } from "../../Permissions/Permissions";
import { useState } from "react";
import ClientForm from "../ClientForm/ClientForm";
import { toast } from "react-toastify";
import UseIsMobile from "../../Hooks/UseIsMobile";

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

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const { isMobile } = UseIsMobile();

  const [clientId, setClientId] = useState(1);

  const onSubmit = async (data) => {
    const productsData = [];

    // eslint-disable-next-line react/prop-types
    products.forEach((product) => {
      productsData.push([product.id, parseInt(product.buying)]);
    });

    const formData = {
      paymentMethod: data.methods,
      products: productsData,
      userId,
      clientId,
    };

    await fetch(import.meta.env.VITE_PUBLIC_BACKEND_URL + "/orders/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(formData),
    }).then(async (res) => {
      console.log(res);
      if (res.ok) {
        toast.success("Pedido criado com sucesso!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setOpenModal(false);
        return;
      } else if (res.status == 400) {
        const response = await res.json();
        setOpenModal(false);
        toast.error(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  const columns = [
    { field: "id", flex: isMobile ? 0 : 1, headerName: "ID" },
    {
      field: "name",
      headerName: "Nome",
      flex: isMobile ? 0 : 1,
      cellClassName: "name-column-cell",
    },
    {
      field: "description",
      headerName: "Descrição",
      flex: isMobile ? 0 : 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "price",
      flex: isMobile ? 0 : 1,
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
      flex: isMobile ? 0 : 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },

    {
      field: "buying",
      flex: isMobile ? 0 : 1,
      headerName: "Qtt a comprar",
      sortable: false,
    },
    {
      field: "totalProductPrice",
      flex: isMobile ? 0 : 1,
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
        ></Box>
        <ClientForm clientId={clientId} setClientId={setClientId} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="flex flex-wrap justify-between">
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
                  className="w-[220px] md:w-[300px] lg:w-[350px]"
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
        </form>

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
