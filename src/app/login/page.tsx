"use client";

import { useLogin } from "@refinedev/core";
import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemedTitle } from "@refinedev/mui";
import FactoryIcon from "@mui/icons-material/Factory";

export default function Login() {
  const { mutate: login } = useLogin<{ email: string; senha: string }>();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login({ email, senha }, {
      onSettled: () => setIsLoading(false),
    });
  };

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        gap="24px"
        justifyContent="center"
        flexDirection="column"
        width="100%"
        maxWidth="400px"
      >
        <ThemedTitle
          collapsed={false}
          text="Sistema MES"
          icon={<FactoryIcon />}
          wrapperStyles={{
            fontSize: "22px",
            justifyContent: "center",
          }}
        />
        
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        
        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          fullWidth
        />
        
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <Typography align="center" color={"text.secondary"} fontSize="12px">
          MES System
        </Typography>
      </Box>
    </Container>
  );
}
