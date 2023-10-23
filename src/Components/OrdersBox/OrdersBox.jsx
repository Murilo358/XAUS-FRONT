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
              <div>
                <Typography color={colors.grey[100]}>
                  Usuário: {order.userName}
                </Typography>
                <Typography>Cliente: {order.clientName}</Typography>
              </div>
              <Box
                className="flex items-center justify-center rounded-sm"
                sx={{
                  width: "80px",
                  backgroundColor: order.itsPayed ? "GREEN" : "RED",
                }}
              >
                <Typography>{order.itsPayed ? "PAGO" : "PENDENTE"} </Typography>
              </Box>
            </div>
            <div className="flex justify-between lg:flex-nowrap flex-wrap">
              <div className="flex">
                <Typography fontWeight="bold" variant="h5">
                  Produtos:
                </Typography>

                {order.products.map((product, index) => (
                  <Box
                    sx={{
                      marginTop: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                    key={product.productName}
                  >
                    <Typography
                      sx={{
                        marginLeft: "3px",
                      }}
                      variant="p"
                    >
                      {product.productName}
                      {index < order.products.length - 1 ? "," : ""}
                    </Typography>
                  </Box>
                ))}
              </div>
              <div className="flex">
                <Typography fontWeight="bold" variant="h5">
                  Valor total:
                </Typography>

                <Typography
                  sx={{ marginLeft: "3px", marginTop: "2px" }}
                  variant="p"
                >
                  R${order.orderPrice}
                </Typography>
              </div>
            </div>
          </Box>
        ))}
    </>
  );
};

export default OrdersBox;
