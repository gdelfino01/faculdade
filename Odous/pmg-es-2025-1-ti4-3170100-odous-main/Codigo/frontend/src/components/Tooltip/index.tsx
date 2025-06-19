import React, { FC } from "react";
import {
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps,
} from "@mui/material";

export interface TooltipProps extends MuiTooltipProps {
  placement?: MuiTooltipProps["placement"];
}

const Tooltip: FC<TooltipProps> = ({ title, children, placement }) => {
  return (
    <MuiTooltip
      title={title}
      placement={placement}
      PopperProps={{
        sx: {
          "& .MuiTooltip-tooltip": {
            backgroundColor: "var(--tooltip-background)",
            color: "var(--tooltip-text)",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Inter",
            textAlign: "center",
          },
        },
      }}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
