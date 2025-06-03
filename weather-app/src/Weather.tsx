import React from 'react';
import { WeatherForecast } from './types';

interface WeatherProps {
  forecasts: WeatherForecast[];
}

const Weather: React.FC<WeatherProps> = ({ forecasts }) => {
  if (!forecasts.length) return <p>No weather data available.</p>;

  return (
    <ul>
      {forecasts.map((f, index) => (
        <li key={index}>
          <strong>{new Date(f.date).toLocaleDateString()}</strong>: {f.summary} –
          {` ${f.temperatureC}°C / ${f.temperatureF}°F`}
        </li>
      ))}
    </ul>
  );
};

export default Weather;
