import { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import { hasPermission } from "../Permissions/Permissions";
import { actions } from "../Permissions/Constants";
import Swal from "sweetalert2";
import Header from "../Components/Header/Header";
import ArticleIcon from "@mui/icons-material/Article";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Button, LinearProgress, Modal, Typography } from "@mui/material";
import dayjs from "dayjs";
import { formatPaymentMethods } from "../Components/Utils";
import { useTheme } from "@emotion/react";
import { tokens } from "../styles/Themes";
import { toast } from "react-toastify";
import DataGridBox from "../Components/DataGridBox/DataGridBox";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { jwtToken, roles } = useContext(AuthContext);
  const permission = hasPermission(roles, actions.VIEW_ORDERS);
  const createOrderPermission = hasPermission(roles, actions.CREATE_ORDER);
  const [rows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  function EditToolbar() {
    const handleRedirectClick = () => {
      toast.info(`Selecione os produtos para gerar um pedido`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return navigate("/products");
    };

    return (
      <GridToolbarContainer>
        <Box>
          <GridToolbarExport
            sx={{
              fontSize: "0.8571428571428571rem",
              height: "32.578px",
              color: colors.grey[100],
            }}
          />
        </Box>
        <Box>
          <GridToolbarDensitySelector
            sx={{
              fontSize: "0.8571428571428571rem",
              height: "32.578px",
              color: colors.grey[100],
            }}
          />
        </Box>
        <Box>
          {createOrderPermission && (
            <Button
              sx={{ color: colors.grey[100] }}
              startIcon={<ArticleIcon />}
              onClick={handleRedirectClick}
            >
              <Typography> Gerar pedido </Typography>
            </Button>
          )}
        </Box>
      </GridToolbarContainer>
    );
  }

  const handleSetPayed = async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://xaus-backend-production.up.railway.app/orders/${orderId}/setPayed`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setLoading(false);
      if (response.ok) {
        return response;
      } else {
        throw new Error("Erro atualizar o pedido");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        background: colors.primary[400],
        color: colors.grey[100],
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      setLoading(false);
      return null;
    }
  };

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  const processRowUpdate = async (newRow, oldRow) => {
    if (newRow.itsPayed === false) {
      toast.error(`O pedido não pode ser marcado como não pago`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      const updatedRow = { ...oldRow, isNew: false };
      setAllRows(rows.map((row) => (row.id === oldRow.id ? updatedRow : row)));
      return updatedRow;
    }
    const res = await handleSetPayed(newRow.id);

    if (res.ok) {
      toast.success(`Pedido atualizado com sucesso!`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      const updatedRow = { ...newRow, isNew: false };
      setAllRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: isMobile ? 0 : 1 },
    {
      field: "clientCpf",
      headerName: "CPF-Cliente",
      flex: isMobile ? 0 : 1,
    },
    {
      field: "createdAt",
      headerName: "Criado em",
      flex: isMobile ? 0 : 1,

      renderCell: ({ row: { createdAt } }) => {
        return (
          <Box>
            {
              (createdAt = dayjs(new Date(createdAt)).format(
                "DD-MM-YYYY - HH:mm"
              ))
            }
          </Box>
        );
      },
    },

    {
      field: "paymentMethod",
      flex: isMobile ? 0 : 1,
      headerName: "Método pagamento",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { paymentMethod } }) => {
        return (
          <Typography variant="p">
            {formatPaymentMethods(paymentMethod)}
          </Typography>
        );
      },
    },
    {
      field: "itsPayed",
      headerName: "Pago?",
      headerAlign: "center",
      type: "boolean",
      editable: true,
      flex: isMobile ? 0 : 1,
      align: "center",
    },
    {
      field: "products",
      headerName: "Produtos",
      flex: isMobile ? 0 : 1,
      headerAlign: "left",
      align: "left",
      renderCell: ({ row: { products } }) => {
        return (
          <Typography onClick={() => handleOpen()} variant="p">
            <Modal style={modalStyle} open={open} onClose={handleClose}>
              <Box>
                {products.map((product) => (
                  <Typography key={product.name}>
                    {product.productName}{" "}
                  </Typography>
                ))}
              </Box>
            </Modal>
            {products.map((product, index) => (
              <>
                {product.productName}
                {index < products.length - 1 ? "," : ""}
              </>
            ))}
          </Typography>
        );
      },
    },
    {
      field: "orderPrice",
      headerName: "Total",
      flex: isMobile ? 0 : 1,
      headerAlign: "left",
      align: "left",
      type: "number",
      renderCell: ({ row: { orderPrice } }) => {
        return <Typography variant="p">R$ {orderPrice}</Typography>;
      },
    },
  ];

  useEffect(() => {
    const getAllOrders = async () => {
      await fetch(
        "https://xaus-backend-production.up.railway.app/orders/getall",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      ).then(async (res) => {
        if (res.ok) {
          setAllRows(await res.json());
          return;
        }
        Swal.fire({
          background: colors.primary[400],
          color: colors.grey[100],
          icon: "error",
          title: "Oops...",
          text: "Erro ao buscar todos os pedidos",
        });
      });
    };
    getAllOrders();
  }, []);

  return (
    <Box sx={{ mb: "40px" }}>
      <Header title="Pedidos" subtitle="Veja todos os pedidos do XAUS" />
      {permission ? (
        <DataGridBox>
          <DataGrid
            className="w-11/12 "
            editMode="row"
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
              },
            }}
            localeText={{
              toolbarDensity: "Densidade da tabela",
              toolbarExport: "Exportar",
              toolbarExportCSV: "Baixar como CSV",
              toolbarExportPrint: "Imprimir",
              toolbarDensityCompact: "Compacto",
              toolbarDensityStandard: "Padrão",
              toolbarDensityComfortable: "Confortável",
            }}
            slots={{
              toolbar: EditToolbar,
              loadingOverlay: LinearProgress,
            }}
            processRowUpdate={processRowUpdate}
            loading={loading}
            rows={rows}
            columns={columns}
          />
        </DataGridBox>
      ) : (
        <p>Você não tem permissão para visualizar essa página </p>
      )}
    </Box>
  );
};

export default Orders;
