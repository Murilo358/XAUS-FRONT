import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../styles/Themes";
// eslint-disable-next-line react/prop-types
const Header = ({ title, subtitle, margin = "20px" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m={margin}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box mb="30px">
          <Typography
            variant="h2"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            {title}
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
