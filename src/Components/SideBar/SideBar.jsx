import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../styles/Themes";
import { useContext, useState } from "react";
import translateRoles from "../../Permissions/TranslateRoles";
import AuthContext from "../../Contexts/AuthContext";
import SideBarItem from "./SideBarItem";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import { useEffect } from "react";

const SideBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { userName, roles } = useContext(AuthContext);
  const [width, setWidth] = useState(window.innerWidth);

  function getSize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", getSize);

    if (width < 600) {
      setIsCollapsed(true);
    }
  }, [window.innerWidth]);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]}!important `,
        },
        "& .pro-icon-wrapper": {
          background: `transparent !important `,
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important ",
        },
        "& .pro-inner-:hover": {
          color: `#868dfb !important`,
        },
        "& .pro-menu-item.active": {
          color: `#6870fa !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            active={false}
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : null}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box className="mb-6">
                <Box className="flex justify-between items-center">
                  <Typography
                    color={colors.grey[100]}
                    className="font-bold"
                    variant="h3"
                  >
                    Xaus
                  </Typography>

                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOpenOutlinedIcon />
                  </IconButton>
                </Box>
                <Box
                  className="mt-5"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <img
                    className="cursor-pointer rounded-md"
                    width="100px"
                    height="100px"
                    src="/Xaus-icon.png"
                    alt="XAUS-Logo"
                  />
                </Box>

                <Box textAlign="center">
                  <Typography
                    className="font-bold"
                    variant="h2"
                    color={colors.grey[100]}
                  >
                    {userName}
                  </Typography>

                  <div className="flex flex-wrap">
                    {roles.length > 0 &&
                      roles.map((item) => (
                        <Typography
                          key={item}
                          className="w-full "
                          style={{ margin: "10px 0 0 0 " }}
                          variant="h6"
                          color={colors.greenAccent[300]}
                        >
                          {translateRoles(item)}
                        </Typography>
                      ))}
                  </div>
                </Box>
              </Box>
            )}
          </MenuItem>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <SideBarItem
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* <Typography variant="h6" color={colors.grey[300]}>
              Produtos
            </Typography> */}
            <SideBarItem
              title="Produtos"
              to="/products"
              icon={<ShoppingCartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Typography variant="h6" color={colors.grey[300]}>
              Usuários
            </Typography> */}
            <SideBarItem
              title="Registrar"
              to="/register"
              icon={<PersonAddOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Typography variant="h6" color={colors.grey[300]}>
              Pedidos
            </Typography> */}

            <SideBarItem
              title="Pedidos"
              to="/orders"
              icon={<PointOfSaleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SideBarItem
              title="Clientes"
              to="/clients"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
          {/* <MenuItem>Dashboard</MenuItem>
          <SubMenu title="Components">
            <MenuItem>Component 1</MenuItem>
            <MenuItem>Component 2</MenuItem>
          </SubMenu> */}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default SideBar;
