import React from 'react';
import { WeatherForecast } from './types';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from '@mui/material';

interface WeatherProps {
  forecasts: WeatherForecast[];
}

const Weather: React.FC<WeatherProps> = ({ forecasts }) => {
  if (!forecasts.length)
    return <Typography align="center">No weather data available.</Typography>;

  return (
    <Stack spacing={3}>
      {forecasts.map((f, index) => (
        <Card key={index} elevation={3}>
          <CardContent>
            <Typography variant="h6">
              {new Date(f.date).toLocaleDateString()}
            </Typography>
            <Typography color="text.secondary">{f.summary}</Typography>
            <Typography>
              {f.temperatureC}°C / {f.temperatureF}°F
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default Weather;
