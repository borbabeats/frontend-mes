"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function LoginError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    console.error("Login error:", error);
  }, [error]);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Credenciais inválidas. Verifique seu email e senha.";
      case "AccessDenied":
        return "Acesso negado. Você não tem permissão para acessar esta página.";
      case "Verification":
        return "Erro de verificação. Por favor, tente novamente.";
      case "Default":
        return "Ocorreu um erro durante o login. Por favor, tente novamente.";
      case "Callback":
        return "Erro de callback. Por favor, tente novamente.";
      case "OAuthCreateAccount":
        return "Erro ao criar conta OAuth. Por favor, tente novamente.";
      case "EmailCreateAccount":
        return "Erro ao criar conta com email. Por favor, tente novamente.";
      case "SessionRequired":
        return "Sessão requerida. Por favor, faça login novamente.";
      default:
        return `Erro desconhecido: ${error || 'undefined'}`;
    }
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
        display="flex"
        gap="24px"
        justifyContent="center"
        flexDirection="column"
        width="100%"
        maxWidth="400px"
        textAlign="center"
      >
        <Typography variant="h4" color="error" gutterBottom>
          Erro de Login
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          {getErrorMessage(error)}
        </Typography>
        
        <Box display="flex" gap="12px" justifyContent="center">
          <Button
            variant="contained"
            onClick={() => router.push("/login")}
          >
            Tentar Novamente
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/")}
          >
            Página Inicial
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
