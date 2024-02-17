import { useState } from "react";
import NumberFormat from "react-number-format";

const CurrencyTextField = (props) => {
  function currencyFormatter(value) {
    if (!Number(value)) return "";

    const amount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);

    return `${amount}`;
  }

  const { value, inputRef, onChange, ...other } = props;
  const [internalValue, setInternalValue] = useState(value * 100);
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      format={currencyFormatter}
      value={internalValue}
      onValueChange={(values) => {
        setInternalValue(values.value);
        onChange({
          target: {
            name: props.name,
            value: String(Number(values.value) / 100),
          },
        });
      }}
      thousandSeparator
    />
  );
};

export default CurrencyTextField;
