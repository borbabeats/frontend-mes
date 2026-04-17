import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';

interface DashboardErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

class DashboardErrorBoundary extends React.Component<DashboardErrorBoundaryProps, DashboardErrorBoundaryState> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />;
      }

      return (
        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <BugReportIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Erro no Dashboard</AlertTitle>
              Ocorreu um erro inesperado ao carregar o dashboard. Por favor, tente novamente.
            </Alert>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Detalhes do Erro:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                    {this.state.error.message}
                    {this.state.error.stack}
                  </Typography>
                </Paper>
              </Box>
            )}
            
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              size="large"
            >
              Tentar Novamente
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;
