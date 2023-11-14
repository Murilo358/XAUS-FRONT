import { useTheme } from "@emotion/react";
import { Box, Paper, Typography } from "@mui/material";

import { tokens } from "../../styles/Themes";

const OrdersBox = ({ orders }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      {orders.length > 0 &&
        orders.map((order) => (
          <Box
            component={Paper}
            color={colors.grey[100]}
            className="ms-3 mb-2 me-3 p-3 rounded-md lg:flex-nowrap flex-wrap "
            sx={{ backgroundColor: colors.primary[500] }}
            key={order.id}
          >
            <div className="flex justify-between lg:flex-nowrap flex-wrap">
              <div className="flex flex-col">
                <Typography sx={{ marginLeft: "-53px" }}>
                  Usuario: {order.userName}
                </Typography>
                <Typography>Cliente: {order.clientName}</Typography>
              </div>
              <Box
                className="flex rounded-sm shadow-md items-center justify-center rounded-sm"
                sx={{
                  width: "80px",
                  backgroundColor: order.itsPayed ? "GREEN" : "RED",
                }}
              >
                <Typography fontWeight="bold">
                  {order.itsPayed ? "PAGO" : "PENDENTE"}{" "}
                </Typography>
              </Box>
            </div>
            <div className="flex justify-between lg:flex-nowrap flex-wrap">
              <div className="flex">
                <Typography fontWeight="bold" variant="h5">
                  Produtos:
                </Typography>
                <Box
                  sx={{
                    marginTop: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "43vw",
                    width: "70%",
                  }}
                >
                  {order.products.map((product, index) => (
                    <Typography
                      key={product.productName}
                      sx={{
                        marginLeft: "3px",
                      }}
                      variant="p"
                    >
                      {product.productName}
                      {index < order.products.length - 1 ? "," : ""}
                    </Typography>
                  ))}
                </Box>
              </div>
              <Box
                sx={{
                  marginTop: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Typography fontWeight="bold" variant="h5">
                  Valor total:
                </Typography>

                <Typography
                  sx={{ marginLeft: "3px", marginTop: "2px" }}
                  variant="p"
                >
                  R${order.orderPrice}
                </Typography>
              </Box>
            </div>
          </Box>
        ))}
    </>
  );
};

export default OrdersBox;
