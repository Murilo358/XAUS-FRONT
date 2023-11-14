import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { colorModeContext, tokens } from "../styles/Themes";
import { InputBase } from "@mui/material";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useContext } from "react";
import UseAllRoutes from "../Hooks/UseAllRoutes";
import { useState } from "react";
import AuthContext from "../Contexts/AuthContext";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(colorModeContext);
  const { HandleLogout, authenticated } = useContext(AuthContext);

  const [openedMenu, setOpenedMenu] = useState(false);

  const handleMenuClick = () => {
    setOpenedMenu(!openedMenu);
  };

  return (
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
  );
};

export default Topbar;
