const translateRoles = (role) => {
  switch (role) {
    case "ROLE_ADMIN":
      return "ADMIN";
    case "ROLE_PACKAGER":
      return "EMPACOTADOR";
    case "ROLE_SALES":
      return "VENDEDOR";
    default:
      return "";
  }
};
export default translateRoles;
