import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useSelect } from "@refinedev/core";

interface RefineSelectProps {
  resource: string;
  value?: string | number;
  onChange: (value: string | number) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  filters?: any[];
  defaultValue?: string | number;
}

export function RefineSelect({
  resource,
  value,
  onChange,
  error,
  helperText,
  label,
  required = false,
  disabled = false,
  fullWidth = true,
  filters,
  defaultValue,
}: RefineSelectProps) {
  const { options } = useSelect({
    resource,
    optionLabel: "nome",
    optionValue: "id",
    filters,
    defaultValue,
    pagination: {
      mode: "off", // Desabilita paginação para trazer todos os dados
    },
  });

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <FormControl 
      fullWidth={fullWidth} 
      error={error} 
      required={required}
      disabled={disabled}
    >
      <InputLabel>{label || resource}</InputLabel>
      <Select
        value={value || ""}
        onChange={handleChange}
        label={label || resource}
        disabled={disabled}
      >
        <MenuItem value="">Selecione um {label || resource}</MenuItem>
        {options?.map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
