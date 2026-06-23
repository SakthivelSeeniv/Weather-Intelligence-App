/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GeocodingCity, WeatherForecastResponse } from "./types";
import { CitySearch } from "./components/CitySearch";
import { CurrentWeather } from "./components/CurrentWeather";
import { WeeklyForecast } from "./components/WeeklyForecast";
import { HourlyForecast } from "./components/HourlyForecast";
import { RecommendationCard } from "./components/RecommendationCard";
import { WeatherIcon } from "./components/WeatherIcons";

const DEFAULT_CITY: GeocodingCity = {
  id: 5128581,
  name: "New York",
  latitude: 40.71427,
  longitude: -74.00597,
  country: "United States",
  country_code: "US",
  admin1: "New York",
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeocodingCity>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMetric, setIsMetric] = useState<boolean>(true);

  const fetchWeather = async (city: GeocodingCity) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to retrieve forecasting data. Open-Meteo servers are busy or unreachable.");
      }
      
      const data: WeatherForecastResponse = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      console.error("Weather fetching error:", err);
      setError(err?.message || "An unexpected error occurred while collecting meteorological forecasts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch weather automatically on city change
  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-[#06060c] text-white selection:bg-indigo-500/30 selection:text-indigo-200 pb-16 relative overflow-x-hidden">
      {/* Immersive Background Ambient Blur Nodes */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/15 blur-[120px] -top-80 -left-60 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/5 to-blue-500/10 blur-[120px] bottom-10 right-0 pointer-events-none" />

      {/* Glassmorphic Header */}
      <header className="border-b border-white/5 bg-slate-950/20 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand Logo & Taglines */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-500/20 border border-indigo-400/30 rounded-xl flex items-center justify-center text-indigo-300 shadow-md">
              <WeatherIcon name="Compass" className="h-5.5 w-5.5 animate-pulse text-indigo-300" />
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                Weather Intelligence
              </h1>
              <p className="text-[9px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
                Insight-Driven Meteorological Advisory
              </p>
            </div>
          </div>

          {/* Premium Rounded Switch Selector */}
          <div className="flex items-center bg-white/5 border border-white/15 p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => setIsMetric(true)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                isMetric 
                  ? "bg-white text-slate-950 shadow-md" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              Metric (°C)
            </button>
            <button
              onClick={() => setIsMetric(false)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                !isMetric 
                  ? "bg-white text-slate-950 shadow-md" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              Imperial (°F)
            </button>
          </div>
        </div>
      </header>

      {/* Primary Grid Layout container */}
      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-6 relative z-10">
        {/* Sleek Search bar row */}
        <div className="mb-8">
          <CitySearch onSelectCity={setSelectedCity} isLoadingWeather={isLoading} />
        </div>

        {/* Dynamic Transition States */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl"
            >
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-400 animate-spin" />
                <div className="absolute">
                  <WeatherIcon name="RefreshCw" className="h-6 w-6 text-indigo-400 animate-spin [animation-duration:3s]" />
                </div>
              </div>
              <h3 className="text-white font-bold mt-6 text-base tracking-tight">Syncing Atmosphere Profiles</h3>
              <p className="text-xs text-indigo-200/50 mt-1.5 font-sans font-medium">
                Fetching geocodes and real-time precipitation models...
              </p>
            </motion.div>
          )}

          {/* Clean Redundant Error panel */}
          {!isLoading && error && (
            <motion.div
              key="error-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 bg-rose-500/5 border border-rose-500/25 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl text-center max-w-xl mx-auto"
            >
              <div className="h-12 w-12 bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <WeatherIcon name="ShieldAlert" className="h-6 w-6" />
              </div>
              <h3 className="text-rose-100 font-extrabold text-lg tracking-tight">Data Synchronization Failed</h3>
              <p className="text-rose-200/70 text-sm mt-2 leading-relaxed">{error}</p>
              <button
                onClick={() => fetchWeather(selectedCity)}
                className="mt-6 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Retry Request
              </button>
            </motion.div>
          )}

          {/* Completed Visual Layout Grid */}
          {!isLoading && !error && weatherData && (
            <motion.div
              key="loaded-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Row 1: Current Weather Dashboard (frosted wide container) */}
              <CurrentWeather city={selectedCity} weather={weatherData} isMetric={isMetric} />

              {/* Row 2: Weather Recommendations (Insight Hub) */}
              <RecommendationCard current={weatherData.current} daily={weatherData.daily} />

              {/* Row 3: Hourly Progression Chart */}
              <HourlyForecast 
                hourly={weatherData.hourly} 
                isMetric={isMetric} 
                currentTimeStr={weatherData.current.time} 
              />

              {/* Row 4: 7-Day Forecast */}
              <WeeklyForecast daily={weatherData.daily} isMetric={isMetric} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
