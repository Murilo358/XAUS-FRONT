import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { colorModeContext, tokens } from "../../styles/Themes";
import { InputBase } from "@mui/material";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useContext, useEffect } from "react";
import UseAllRoutes from "../../Hooks/UseAllRoutes";
import { useState } from "react";
import AuthContext from "../../Contexts/AuthContext";
import UseWebSocketComponent from "../WebSocket";
import SideBarContext from "../../Contexts/SideBarContext";
import Notifications from "react-notifications-menu";
import Cookies from "universal-cookie";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(colorModeContext);
  const { HandleLogout, authenticated, roles } = useContext(AuthContext);
  const { isCollapsed, setIsCollapsed } = useContext(SideBarContext);
  const { messages, setMessages } = UseWebSocketComponent();
  const [openedMenu, setOpenedMenu] = useState(false);
  const cookies = new Cookies();
  const [data, setData] = useState([]);

  function setCollapsed() {
    setIsCollapsed(!isCollapsed);
  }

  const handleMenuClick = () => {
    setOpenedMenu(!openedMenu);
  };

  const formatProducts = (products) => {
    let formattedString = "";
    if (products.length > 0) {
      products.forEach((product, index) => {
        formattedString +=
          product.productName + (index < products.length - 1 ? "," : "");
      });
    }

    return formattedString;
  };

  const handleClearNotification = (id) => {
    setData((current) =>
      current.filter((value) => {
        return value.id !== id;
      })
    );
    let cookieName = "order_" + id;
    cookies.remove(cookieName);

    setMessages((current) =>
      current.filter((value) => {
        return value.id !== id;
      })
    );
  };

  const handleClearNotifications = () => {
    const allCookies = cookies.getAll(false);

    const orders = Object.keys(allCookies);

    orders
      .filter((cookieName) => cookieName.startsWith("order_"))
      .map((cookieName) => {
        cookies.remove(cookieName);
      });
    setData([]);
    setMessages([]);
  };

  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((order) => {
        const formattedOrder = "Produtos: " + formatProducts(order);
        if (data.length > 0) {
          if (!data.some((item) => item.id == order.id)) {
            setData((prevData) => [
              ...prevData,
              {
                id: order.id,
                image: import.meta.env.VITE_PUBLIC_XAUS_LOGO,
                message: formattedOrder,
                detailPage: "/orders?orderId=" + order.id,
              },
            ]);
          }
        } else {
          setData(() => [
            {
              id: order.id,
              image: import.meta.env.VITE_PUBLIC_XAUS_LOGO,
              message: formattedOrder,
              detailPage: "/orders?orderId=" + order.id,
            },
          ]);
        }
      });
    }
  }, [messages]);

  return (
    <>
      <div className="flex ">
        <IconButton className="mobile-menu-icon" onClick={() => setCollapsed()}>
          <MenuOutlinedIcon />
        </IconButton>
        <Box className="flex justify-between p-2 shadow-md w-full">
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
            className="flex rounded-sm"
            backgroundColor={colors.primary[400]}
          >
            {authenticated && (
              <>
                <Autocomplete
                  forcePopupIcon={false}
                  className="p-1"
                  onChange={(e, value) => (window.top.location = value.route)}
                  options={UseAllRoutes()}
                  getOptionLabel={(option) => option.title}
                  style={{ width: 200 }}
                  renderInput={(params) => {
                    const { ...rest } = params;
                    return (
                      <div className="flex">
                        <InputBase
                          placeholder="Busque por páginas"
                          sx={{
                            ml: 2,
                            flex: 1,
                            backgroundColor: colors.primary[400],
                          }}
                          {...params.InputProps}
                          {...rest}
                        />

                        <IconButton type="button" sx={{ p: 1 }}>
                          <SearchIcon />
                        </IconButton>
                      </div>
                    );
                  }}
                />
              </>
            )}
          </Box>
          <Box display="flex">
            {authenticated && roles.includes("ROLE_PACKAGER") && (
              <IconButton>
                <Box
                  sx={{
                    display: "flex",
                    "&  .items": {
                      backgroundColor: colors.primary[500],
                    },
                    "&  .card": {
                      padding: "0px",
                      backgroundColor: colors.primary[400],
                    },
                    "&  .text": {
                      color: colors.grey[100],
                    },
                  }}
                >
                  <Notifications
                    cardOption={(data) => handleClearNotification(data.id)}
                    headerBackgroundColor={colors.greenAccent[500]}
                    data={data}
                    icon={
                      data.length > 0
                        ? theme.palette.mode == "dark"
                          ? "WhiteNewNotification.png"
                          : "/BlackNewNotification.png"
                        : theme.palette.mode == "dark"
                        ? "WhiteNotification.png"
                        : "/BlackNotification.png"
                    }
                    height={300}
                    width={440}
                    header={{
                      title: "Novos pedidos",
                      option: {
                        text: "Remover todas notificações",
                        onClick: () => handleClearNotifications(),
                      },
                    }}
                  />{" "}
                  {data.length}
                </Box>
              </IconButton>
            )}
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode == "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlined />
              )}
            </IconButton>
            {authenticated && (
              <>
                <IconButton onClick={() => handleMenuClick()}>
                  <PersonOutlinedIcon />
                </IconButton>
                {openedMenu && (
                  <Box
                    backgroundColor={colors.blueAccent[800]}
                    className="absolute z-20 top-14  right-1  w-[150px] shadow-md flex flex-col justify-center items-center rounded-lg"
                  >
                    <Button
                      className="w-full h-full"
                      onClick={() => HandleLogout()}
                      variant="outlined"
                    >
                      <Typography color={colors.grey[100]}>Logout</Typography>
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Topbar;
