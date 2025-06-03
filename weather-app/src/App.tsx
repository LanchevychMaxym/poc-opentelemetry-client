import React, { useState } from 'react';
import './App.css';
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
    <div className="App">
      <h1>Weather Forecast</h1>
      <button onClick={fetchWeather} disabled={loading}>
        {loading ? 'Loading...' : 'Update Forecast'}
      </button>
      <Weather forecasts={weather} />
    </div>
  );
}

export default App;
