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

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.models);
  const colorMode = useContext(colorModeContext);

  return (
    <div className="flex justify-between p-2">
      <Box className="flex rounded-sm" backgroundColor={colors.primary[400]}>
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
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </div>
  );
};

export default Topbar;
