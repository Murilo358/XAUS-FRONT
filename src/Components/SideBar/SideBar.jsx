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
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useEffect } from "react";
import SideBarContext from "../../Contexts/SideBarContext";

const SideBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { isCollapsed, setIsCollapsed } = useContext(SideBarContext);
  const { userName, roles } = useContext(AuthContext);
  const [width, setWidth] = useState(window.innerWidth);

  function getSize() {
    setWidth(window.innerWidth);
  }

  function setCollapsed() {
    setIsCollapsed(!isCollapsed);
  }

  function handleClick() {
    if (width < 600) {
      setIsCollapsed(true);
    }
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
            onClick={() => setCollapsed()}
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

                  <IconButton onClick={() => setCollapsed()}>
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
                    src={import.meta.env.VITE_PUBLIC_XAUS_LOGO}
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
              handleClick={handleClick}
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
              handleClick={handleClick}
              to="/products"
              icon={<Inventory2OutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Typography variant="h6" color={colors.grey[300]}>
              Usuários
            </Typography> */}

            <SideBarItem
              title="Pedidos"
              to="/orders"
              handleClick={handleClick}
              icon={<PointOfSaleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SideBarItem
              title="Clientes"
              to="/clients"
              handleClick={handleClick}
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SideBarItem
              title="Funcionários"
              to="/users"
              handleClick={handleClick}
              icon={<ManageAccountsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SideBarItem
              title="Novo funcionário"
              handleClick={handleClick}
              to="/register"
              icon={<PersonAddOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Typography variant="h6" color={colors.grey[300]}>
              Pedidos
            </Typography> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default SideBar;
