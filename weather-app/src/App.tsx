import React, { useState } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import Weather from './Weather';
import { WeatherForecast } from './types';

function App() {
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch('/weatherforecast');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data: WeatherForecast[] = await response.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
      alert('Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Weather Forecast
      </Typography>

      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchWeather}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Loading...' : 'Update Forecast'}
        </Button>
      </Box>

      <Weather forecasts={weather} />
    </Container>
  );
}

export default App;
