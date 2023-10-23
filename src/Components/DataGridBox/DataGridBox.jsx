import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { tokens } from "../../styles/Themes";

// eslint-disable-next-line react/prop-types
const DataGridBox = ({ children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      sx={{
        "& .css-1mx81p6-MuiDataGrid-root .MuiDataGrid-row--editing .MuiDataGrid-cell":
          {
            backgroundColor: colors.blueAccent[700],
          },
        "& .css-1mx81p6-MuiDataGrid-root .MuiDataGrid-cell.MuiDataGrid-cell--editing":
          {
            backgroundColor: colors.blueAccent[600],
          },

        "& .MuiDataGrid-root": {
          border: "none",
        },

        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .name-column--cell": {
          color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[800],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[800],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.greenAccent[200]} !important`,
        },
      }}
      style={{ width: "100%" }}
      className=" flex items-center flex-col justify-center "
    >
      {children}
    </Box>
  );
};

export default DataGridBox;
