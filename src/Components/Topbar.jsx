import React from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { colorModeContext, tokens } from "../styles/Themes";
import { InputBase } from "@mui/material";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(colorModeContext);
  const { HandleLogout } = useContext(AuthContext);

  const [openedMenu, setOpenedMenu] = useState(false);

  const handleMenuClick = () => {
    setOpenedMenu(!openedMenu);
  };

  return (
    <div className="flex justify-between p-2">
      <Box
        sx={{
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
        <InputBase
          sx={{ ml: 2, flex: 1, backgroundColor: colors.primary[400] }}
          placeholder="Buscar"
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode == "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon onClick={() => handleMenuClick()} />
        </IconButton>
        {openedMenu && (
          <div className="absolute  z-20 top-14 bg-dark-primary-400 right-1  w-[150px] p-2 border-solid border-grayPrimary shadow-md flex flex-col justify-center items-center rounded-lg">
            <button
              className="text-primary text-sm font-semibold"
              onClick={() => HandleLogout()}
            >
              LogOut
            </button>
          </div>
        )}
      </Box>
    </div>
  );
};

export default Topbar;
