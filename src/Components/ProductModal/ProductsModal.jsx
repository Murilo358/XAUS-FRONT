import { useTheme } from "@emotion/react";
import { Box, Button, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../styles/Themes";
import Header from "../Header/Header";
import { DataGrid } from "@mui/x-data-grid";
import UseIsMobile from "../../Hooks/UseIsMobile";
import { hasPermission } from "../../Permissions/Permissions";
import { actions } from "../../Permissions/Constants";
import { useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  overflow: "scroll",
  maxHeight: "550px",
  "overflow-x": "hidden",
  transform: "translate(-50%, -50%)",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
//prettier-ignore
// eslint-disable-next-line react/prop-types
const ProductsModal = ({handleSetPackaged, orderId, openModal,setOpenModal,products,totalOrderPrice,orderPackaged}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {  roles } = useContext(AuthContext);
  const canSetPackaged = hasPermission(roles, actions.SET_PACKAGED);

  const handleClose = () => {
    setOpenModal(false);
  };
  const { isMobile } = UseIsMobile();



  const columns = [
    {
      field: "productName",
      headerName: "Nome",
      flex: isMobile ? 0 : 1,
      cellClassName: "name-column-cell",
    },
    {
      field: "productPrice",
      flex: isMobile ? 0 : 1,
      headerName: "Valor",
      headerAlign: "center",
      align: "center",
      type: "number",

      renderCell: ({ row: { productPrice } }) => {
        return (
          <Box>
            <Typography variant="p">R$ {productPrice}</Typography>
          </Box>
        );
      },
    },
    {
      field: "buyedQuantity",
      headerName: "Quantidade comprada",
      flex: isMobile ? 0 : 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },

    {
      field: "totalProductPrice",
      flex: isMobile ? 0 : 1,
      headerName: "Total",
      headerAlign: "center",
      align: "center",
      type: "number",

      renderCell: ({
        row: { productPrice, buyedQuantity, totalProductPrice },
      }) => {
        if (productPrice !== 0 && buyedQuantity !== 0) {
          return (
            <Box>
              <Typography variant="p">
                R$ {productPrice * buyedQuantity}
              </Typography>
            </Box>
          );
        } else {
          return (
            <Box>
              <Typography variant="p">R$ {totalProductPrice}</Typography>
            </Box>
          );
        }
      },
    },
  ];

 
  console.log(typeof products);
  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      className="overflow-scroll"
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
        <Header title={`Produto(s):`} subtitle="Visualize todos os produtos" />

        <Button
          sx={{
            position: "absolute",
            top: "0%",
            left: "93%",
            color: colors.grey[100],
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </Button>
        <Box>
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
              getRowId={(row) => row.productPrice}
              className=" w-full mb-4"
              editMode="row"
              initialState={{
                sorting: {
                  sortModel: [{ field: "productName", sort: "asc" }],
                },
              }}
              rows={products}
              columns={columns}
            />
          </Box>
          <Box className="flex">
              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ mb: "5px", mt: "8px" }}
              >
                Valor total: R${totalOrderPrice}
              </Typography>
            </Box>
            {!orderPackaged &&  canSetPackaged && ( 
              <Button
              onClick={()=> handleSetPackaged(orderId, true)}
              sx={{
                "&:hover": {
                  color: colors.blueAccent[600],
                  backgroundColor: colors.greenAccent[500],
                },
                padding: "10px",
                width: "50%",
                mt: "15px",
                fontSize: "16px",
                color: colors.blueAccent[900],
                backgroundColor: colors.greenAccent[400],
              }}
            >
              Marcar como empacotado
            </Button>
            )}
          
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductsModal;
