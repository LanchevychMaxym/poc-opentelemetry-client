import React, { useState } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import Weather from './Weather';
import { WeatherForecast } from './types';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { FrontendTracer } from './otel';

function App() {
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(false);

//   const fetchWeather = async () => {
//   const span = FrontendTracer().startSpan('Fetch WeatherForecast');

//   await context.with(trace.setSpan(context.active(), span), async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/weatherforecast', {
//         headers: {
//           'traceparent': span.spanContext().traceId // треба щоб бекенд це читав
//         }
//       });

//       if (!response.ok) throw new Error('Failed to fetch data');
//       const data: WeatherForecast[] = await response.json();
//       setWeather(data);
//       span.setStatus({ code: SpanStatusCode.OK });
//     } catch (error) {
//       console.error(error);
//       span.setStatus({ code: SpanStatusCode.ERROR });
//     } finally {
//       span.end();
//       setLoading(false);
//     }
//   });
// };

const fetchWeather = async () => {
  setLoading(true);
  try {
    const response = await fetch('/weatherforecast');

    if (!response.ok) throw new Error('Failed to fetch data');

    const data: WeatherForecast[] = await response.json();
    setWeather(data);
  } catch (error) {
    console.error(error);
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
