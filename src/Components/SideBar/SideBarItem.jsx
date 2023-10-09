import { useTheme } from "@emotion/react";
import { tokens } from "../../styles/Themes";
import { MenuItem } from "react-pro-sidebar";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const SideBarItem = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div>
      <MenuItem
        icon={icon}
        style={{ color: colors.grey[100] }}
        onClick={() => setSelected(title)}
        active={selected === title}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    </div>
  );
};

export default SideBarItem;
