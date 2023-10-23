export const formatPaymentMethods = (method) => {
  switch (method) {
    case "CREDIT_CARD":
      return "Cartão de credito";
    case "DEBIT_CARD":
      return "Cartão de débito";
    case "MONEY":
      return "Dinheiro";
    case "PIX":
      return "PIX";
    default:
      return "";
  }
};
