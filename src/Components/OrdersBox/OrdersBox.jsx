import { useTheme } from "@emotion/react";
import { Box, Paper, Typography } from "@mui/material";

import { tokens } from "../../styles/Themes";

const OrdersBox = ({ orders, fullsize }) => {
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
                <div>
                  <Typography fontSize={15} className="flex ">
                    Usuario: {order.userName}
                  </Typography>
                </div>
                <div>
                  <Typography fontSize={15} className="flex ">
                    Cliente: {order.clientName}
                  </Typography>
                </div>
              </div>
              <Box
                className="flex rounded-sm shadow-md items-center justify-center rounded-sm"
                sx={{
                  width: "80px",
                  height: "25px",
                  backgroundColor: order.itsPayed ? "#4AA96C" : "#F55C47",
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
                  classame="flex flex-wrap md:flex-nowrap"
                  sx={{
                    fontSize: "15px",
                    marginTop: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: fullsize ? "100%" : "43vw",
                    width: "100%",
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
