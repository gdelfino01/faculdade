import React from "react";
import { MenuItem, Select, Typography } from "@mui/material";

export interface SelectorProps {
  options?: {
    value: string;
    label: string;
  }[];
  value?: string;
  onChange?: (value: string) => void;
  defaultText?: string;
}

export const Selector: React.FC<SelectorProps> = ({
  options,
  value,
  onChange,
  defaultText = "Selecione",
}) => {
  return (
    <Select
      disabled={!options?.length}
      value={options?.length && value ? value : "default"}
      onChange={(event) => onChange?.(event.target.value)}
      variant="outlined"
      sx={{
        width: "200px",
        height: "40px",
        maxWidth: "100%",
        padding: "8px 10px",
        borderRadius: "8px",
        border: "1px solid var(--selector-border)",
        boxSizing: "border-box",
        boxShadow: "none",
        backgroundColor: "var(--selector-bg)", // 👈 Aqui o fundo do Select

        ".MuiTypography-root": {
          fontFamily: "Roboto",
          fontSize: 14,
          fontWeight: 500,
          color: "var(--selector-text)",
          letterSpacing: "initial",
        },
        ".MuiSelect-outlined": {
          display: "flex",
          padding: "8px 10px",
          margin: 0,
          alignItems: "center",
        },
      }}
      MenuProps={{
        sx: {
          maxHeight: "300px",
          ".MuiList-root": {
            padding: 0,
            backgroundColor: "var(--selector-bg)", // 👈 Fundo do dropdown também
          },
        },
      }}
      onClick={(e) => e.preventDefault()}
    >
      <MenuItem
        value="default"
        disabled
        sx={{
          padding: "8px 10px",
          "&.Mui-selected": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "12px",
            color: "var(--selector-placeholder)",
          }}
        >
          {defaultText}
        </Typography>
      </MenuItem>

      {options?.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            padding: "8px 10px",
            "&.Mui-selected": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "12px",
              color: "var(--selector-text)",
            }}
          >
            {option.label}
          </Typography>
        </MenuItem>
      ))}
    </Select>
  );
};
