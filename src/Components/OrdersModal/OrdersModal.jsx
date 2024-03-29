import { useTheme } from "@emotion/react";
import { Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../styles/Themes";
import OrdersBox from "../OrdersBox/OrdersBox";
import Header from "../Header/Header";

const style = {
  position: "absolute",
  top: "40%",
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

// eslint-disable-next-line react/prop-types
const OrdersModal = ({ openModal, setOpenModal, orders }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClose = () => {
    setOpenModal(false);
  };

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
        <Header
          title={`Todos os pedidos do cliente ${
            // eslint-disable-next-line react/prop-types
            orders[0] ? ": " + orders[0].clientName : ""
          }`}
          subtitle="Visualize todos os pedidos deste cliente"
        />

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
        <OrdersBox orders={orders} fullsize={true} />
      </Box>
    </Modal>
  );
};

export default OrdersModal;
