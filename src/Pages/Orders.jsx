import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import { hasPermission } from "../Permissions/Permissions";
import { actions } from "../Permissions/Constants";
import Swal from "sweetalert2";
import Header from "../Components/Header/Header";
import ArticleIcon from "@mui/icons-material/Article";
import { LiaSpinnerSolid } from "react-icons/lia";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import PtBrLang from "../styles/PtBr";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { formatPaymentMethods } from "../Components/Utils";
import { useTheme } from "@emotion/react";
import { tokens } from "../styles/Themes";
import { toast } from "react-toastify";
import DataGridBox from "../Components/DataGridBox/DataGridBox";
import { useNavigate } from "react-router-dom";
import ProductsModal from "../Components/ProductModal/ProductsModal";
import UseIsMobile from "../Hooks/UseIsMobile";
import MuiToolBar from "../Components/MuiToolbar/MuiToolBar";
import { useLocation } from "react-router-dom/dist";
import HandlePermissionError from "../Components/HandlePermissionError";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Orders = () => {
  const { jwtToken, roles } = useContext(AuthContext);
  const permission = hasPermission(roles, actions.VIEW_ORDERS);
  const createOrderPermission = hasPermission(roles, actions.CREATE_ORDER);
  const setPackagedPermission = hasPermission(roles, actions.SET_PACKAGED);
  const setPayedPermission = hasPermission(roles, actions.SET_PAYED);
  const [rows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  //Used in products modal
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [orderPackaged, setOrderPackaged] = useState(false);
  const [orderId, setOrderId] = useState(false);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [alreadyClicked, setAlreadyClicked] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let query = useQuery();

  let urlOrderId = query.get("orderId");

  if (urlOrderId !== null) {
    let orderButton = document.getElementById(`see-orders-${urlOrderId}`);
    if (orderButton !== null && !alreadyClicked) {
      orderButton.click();
      setAlreadyClicked(true);
    }
  }

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
        <MuiToolBar />
      </GridToolbarContainer>
    );
  }

  const handleSetPackaged = async (orderId, packaged) => {
    try {
      setLoading(true);
      const response = await fetch(
        import.meta.env.VITE_PUBLIC_BACKEND_URL +
          `/orders/${orderId}/setPackaged`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(packaged),
        }
      );
      setLoading(false);
      if (response.ok) {
        handleRowUpdate(orderId, packaged);
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

  const handleSetPayed = async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(
        import.meta.env.VITE_PUBLIC_BACKEND_URL + `/orders/${orderId}/setPayed`,
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
  const handleRowUpdate = (orderId, packaged) => {
    setAllRows(
      rows.map((row) =>
        row.id == orderId ? { ...row, packaged: packaged } : row
      )
    );
  };

  const { isMobile } = UseIsMobile();
  const processRowUpdate = async (newRow, oldRow) => {
    let updated = false;

    if (oldRow.itsPackaged !== newRow.itsPackaged) {
      const res = await handleSetPackaged(newRow.id, newRow.itsPackaged);
      if (res.ok) {
        updated = true;
      }
    }
    if (newRow.itsPayed === false && updated === false) {
      toast.error(`O pedido não pode ser marcado como não pago`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      const updatedRow = { ...oldRow, isNew: false };
      setAllRows(rows.map((row) => (row.id === oldRow.id ? updatedRow : row)));
      return updatedRow;
    }
    // if (newRow.itsPackaged === false) {
    //   toast.error(`O pedido não pode ser marcado como não empacotado`, {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });

    //   const updatedRow = { ...oldRow, isNew: false };
    //   setAllRows(rows.map((row) => (row.id === oldRow.id ? updatedRow : row)));
    //   return updatedRow;
    // }

    if (oldRow.itsPayed !== newRow.itsPayed) {
      const res = await handleSetPayed(newRow.id);
      if (res.ok) {
        updated = true;
      }
    }

    if (updated) {
      toast.success(`Pedido atualizado com sucesso!`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      const updatedRow = { ...newRow, isNew: false };
      setAllRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    }
  };

  const handleRowClick = (product) => {
    console.log(product);
  };

  const columns = [
    { field: "userName", headerName: "Vendedor", flex: isMobile ? 0 : 1 },
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
      headerName: "Pago",
      headerAlign: "center",
      type: "boolean",
      editable: setPayedPermission,
      flex: isMobile ? 0 : 1,
      align: "center",
    },
    {
      field: "itsPackaged",
      editable: setPackagedPermission,
      headerName: "Empacotado",
      headerAlign: "center",
      type: "boolean",
      flex: isMobile ? 0 : 1,
      align: "center",
    },
    {
      field: "products",
      headerName: "Produtos",
      flex: isMobile ? 0 : 1,
      headerAlign: "center",
      onclick: (product) => handleRowClick(product),
      align: "center",
      renderCell: ({ row: { id, products, orderPrice, itsPackaged } }) => {
        return (
          <Box>
            <Button
              style={{
                backgroundColor: colors.greenAccent[500],
              }}
              type="submit"
              id={`see-orders-${id}`}
              className="p-4"
              onClick={() => {
                setOrderId(id);
                setOrderPackaged(itsPackaged);
                setTotalOrderPrice(orderPrice);
                setModalProducts(products);
                setOpen(true);
              }}
            >
              Ver produtos
            </Button>
            {/* <Typography variant="p" sx={{ color: colors.grey[100] }}>
              {products.map((product, index) => (
                <>
                  {product.productName}
                  {index < products.length - 1 ? "," : ""}
                </>
              ))}
            </Typography> */}
          </Box>
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
        return <Typography variant="p">R$ {orderPrice.toFixed(2)}</Typography>;
      },
    },
  ];

  useEffect(() => {
    const getAllOrders = async () => {
      setLoading(true);
      await fetch(import.meta.env.VITE_PUBLIC_BACKEND_URL + "/orders/getall", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }).then(async (res) => {
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
      setLoading(false);
    };
    getAllOrders();
  }, []);

  return (
    <Box
      className="flex flex-col justify-center items-center text-center"
      sx={{ mb: "40px" }}
    >
      <Header title="Pedidos" subtitle="Veja todos os pedidos do XAUS" />
      <ProductsModal
        orderId={orderId}
        handleSetPackaged={handleSetPackaged}
        orderPackaged={orderPackaged}
        totalOrderPrice={totalOrderPrice}
        openModal={open}
        setOpenModal={setOpen}
        products={modalProducts}
      />

      {permission ? (
        <>
          {loading && (
            <LiaSpinnerSolid className="animate-spin mt-20  w-[80px] h-[80px]" />
          )}
          {!loading && (
            <DataGridBox>
              <DataGrid
                className="w-11/12 "
                editMode="row"
                initialState={{
                  sorting: {
                    sortModel: [{ field: "createdAt", sort: "desc" }],
                  },
                }}
                localeText={PtBrLang}
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
          )}
        </>
      ) : (
        <HandlePermissionError />
      )}
    </Box>
  );
};

export default Orders;
