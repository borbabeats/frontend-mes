"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, useTheme } from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";

interface CustomTitleProps {
  collapsed?: boolean;
  text?: string;
  icon?: React.ReactNode;
  wrapperStyles?: React.CSSProperties;
}

export const CustomTitle: React.FC<CustomTitleProps> = ({
  collapsed = false,
  text = "Sistema MES",
  icon = <FactoryIcon />,
  wrapperStyles,
}) => {
  const router = useRouter();
  const theme = useTheme();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? 0 : 1,
        fontSize: collapsed ? "20px" : "22px",
        fontWeight: "bold",
        color: theme.palette.primary.main,
        cursor: "pointer",
        padding: collapsed ? "8px" : "12px 16px",
        borderRadius: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        ...wrapperStyles,
      }}
    >
      {icon}
      {!collapsed && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontSize: "inherit",
            fontWeight: "inherit",
            color: "inherit",
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};
