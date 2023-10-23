const translateRoles = (role) => {
  switch (role) {
    case "ADMIN":
      return "ADMIN";
    case "PACKAGER":
      return "EMPACOTADOR";
    case "SALES":
      return "VENDEDOR";
    default:
      return "";
  }
};
export default translateRoles;
