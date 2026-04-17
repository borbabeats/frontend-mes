import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  unit?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  loading?: boolean;
  format?: 'number' | 'percentage' | 'currency';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  unit = '',
  icon,
  color = 'primary',
  loading = false,
  format = 'number'
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val}%`;
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(val);
      case 'number':
      default:
        return new Intl.NumberFormat('pt-BR').format(val);
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp />;
    if (trend < 0) return <TrendingDown />;
    return <TrendingFlat />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'success.main';
    if (trend < 0) return 'error.main';
    return 'text.secondary';
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={120}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography color="textSecondary" variant="body2" fontWeight={500}>
            {title}
          </Typography>
          {icon && (
            <Box color={`${color}.main`}>
              {icon}
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="baseline" mb={1}>
          <Typography variant="h4" component="div" fontWeight="bold">
            {formatValue(value)}
          </Typography>
          {unit && (
            <Typography variant="body2" color="textSecondary" ml={1}>
              {unit}
            </Typography>
          )}
        </Box>

        {change !== undefined && (
          <Box display="flex" alignItems="center" gap={1}>
            <Box display="flex" alignItems="center" color={getTrendColor(change)}>
              {getTrendIcon(change)}
            </Box>
            <Typography
              variant="body2"
              color={getTrendColor(change)}
              fontWeight={500}
            >
              {Math.abs(change)}% vs mês anterior
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
