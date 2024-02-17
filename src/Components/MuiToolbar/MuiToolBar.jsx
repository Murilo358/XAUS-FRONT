import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { tokens } from "../../styles/Themes";

const MuiToolBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Box>
        <GridToolbarFilterButton
          sx={{
            fontSize: "0.8571428571428571rem",
            height: "32.578px",
            color: colors.grey[100],
          }}
        />
      </Box>
      <Box>
        <GridToolbarExport
          sx={{
            fontSize: "0.8571428571428571rem",
            height: "32.578px",
            color: colors.grey[100],
          }}
        />
      </Box>
      <Box>
        <GridToolbarDensitySelector
          sx={{
            fontSize: "0.8571428571428571rem",
            height: "32.578px",
            color: colors.grey[100],
          }}
        />
      </Box>
    </>
  );
};

export default MuiToolBar;
