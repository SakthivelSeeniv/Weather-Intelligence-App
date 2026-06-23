/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { GeocodingCity, WeatherForecastResponse } from "../types";
import { getWeatherInfo, formatDateReadable, getDayName, celsiusToFahrenheit } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcons";

interface CurrentWeatherProps {
  city: GeocodingCity;
  weather: WeatherForecastResponse;
  isMetric: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ city, weather, isMetric }) => {
  const current = weather?.current || {} as any;
  const daily = weather?.daily || {} as any;
  const weatherInfo = getWeatherInfo(current?.weather_code ?? 0, current?.is_day ?? 1);

  const displayTemp = (celsius: number) => {
    if (typeof celsius !== "number" || isNaN(celsius)) return "--";
    if (isMetric) {
      return `${Math.round(celsius)}°C`;
    }
    return `${celsiusToFahrenheit(celsius)}°F`;
  };

  const displayWind = (kmh: number) => {
    if (typeof kmh !== "number" || isNaN(kmh)) return "--";
    if (isMetric) {
      return `${kmh} km/h`;
    }
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  };

  // Helper to format wind direction
  const getWindDirectionStr = (degree: number) => {
    if (typeof degree !== "number" || isNaN(degree)) return "N";
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
  };

  // Helper to determine UV status
  const getUvStatus = (uv: number) => {
    const val = uv ?? 0;
    if (val <= 2) return { text: "Low", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" };
    if (val <= 5) return { text: "Moderate", color: "text-amber-300 bg-amber-500/10 border-amber-500/20" };
    if (val <= 7) return { text: "High", color: "text-orange-300 bg-orange-500/10 border-orange-500/20" };
    if (val <= 10) return { text: "Very High", color: "text-rose-300 bg-rose-500/10 border-rose-500/20" };
    return { text: "Extreme", color: "text-purple-300 bg-purple-500/10 border-purple-500/20" };
  };

  const todayUv = daily?.uv_index_max?.[0] ?? 0;
  const uvStatus = getUvStatus(todayUv);

  const currentDateStr = (current?.time || "").split("T")[0] || new Date().toISOString().split("T")[0];

  return (
    <motion.div
      id="current-weather-dashboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-gradient-to-br from-white/12 via-white/8 to-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden"
    >
      {/* Dynamic colorful decorative blurs inside the card */}
      <div className={`absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br ${weatherInfo.gradientClass} rounded-full blur-3xl opacity-20 pointer-events-none`} />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

      {/* Top Section: City Information and Temperature display */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 border border-white/10 rounded-xl text-yellow-400">
              <WeatherIcon name="MapPin" className="h-5 w-5" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-white">
              {city.name}
            </h2>
          </div>
          <p className="text-sm text-indigo-200 mt-2 font-medium flex items-center gap-2">
            <span>{city.admin1 ? `${city.admin1}, ` : ""} {city.country}</span>
            <span>&bull;</span>
            <span className="font-mono text-xs uppercase tracking-wider text-white/50">
              {getDayName(currentDateStr)}, {formatDateReadable(currentDateStr)}
            </span>
          </p>
          <p className="text-lg text-indigo-300 font-semibold mt-2.5 flex items-center gap-2">
            <span>{weatherInfo.label}</span>
            <span className="text-indigo-400/60">&bull;</span>
            <span className="text-white/80">H: {displayTemp(daily?.temperature_2m_max?.[0] ?? 0)}</span>
            <span className="text-indigo-400/60">&bull;</span>
            <span className="text-white/70">L: {displayTemp(daily?.temperature_2m_min?.[0] ?? 0)}</span>
          </p>
        </div>

        <div className="flex items-center gap-6 self-end md:self-auto">
          <div className="text-right">
            <span className="text-7xl sm:text-8xl font-black tracking-tighter leading-none text-white block drop-shadow">
              {typeof current?.temperature_2m === "number" ? Math.round(current.temperature_2m) : "--"}°
            </span>
            <span className="text-xs text-white/50 font-mono tracking-widest uppercase">
              Current Feel
            </span>
          </div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="text-white drop-shadow-2xl"
          >
            <WeatherIcon name={weatherInfo.iconName} className="h-20 w-20 sm:h-24 sm:w-24 text-yellow-300" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Section: 6-column Grid of Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 relative z-10">
        {/* Apparent Temp */}
        <div className="bg-white/5 hover:bg-white/8 border border-white/5 rounded-3xl p-5 flex flex-col justify-between transition-all group">
          <div className="flex items-center gap-2 mb-3">
            <WeatherIcon name="Thermometer" className="h-4 w-4 text-indigo-300 group-hover:scale-110 transition-transform" />
            <p className="text-indigo-300 text-[10px] uppercase tracking-widest font-bold">Feels Like</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-mono">{displayTemp(current?.apparent_temperature ?? 0)}</p>
            <p className="text-[10px] text-white/40 mt-1 font-sans">Apparent thermal feel</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white/5 hover:bg-white/8 border border-white/5 rounded-3xl p-5 flex flex-col justify-between transition-all group">
          <div className="flex items-center gap-2 mb-3">
            <WeatherIcon name="Droplet" className="h-4 w-4 text-indigo-300 group-hover:scale-110 transition-transform" />
            <p className="text-indigo-300 text-[10px] uppercase tracking-widest font-bold">Humidity</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-mono">{current?.relative_humidity_2m ?? 0}%</p>
            <p className="text-[10px] text-white/40 mt-1 font-sans">Water vapor concentration</p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white/5 hover:bg-white/8 border border-white/5 rounded-3xl p-5 flex flex-col justify-between transition-all group">
          <div className="flex items-center gap-2 mb-3">
            <WeatherIcon name="Wind" className="h-4 w-4 text-indigo-300 group-hover:scale-110 transition-transform" />
            <p className="text-indigo-300 text-[10px] uppercase tracking-widest font-bold">Wind Speed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-mono">{displayWind(current?.wind_speed_10m ?? 0)}</p>
            <p className="text-[10px] text-white/40 mt-1 font-sans flex items-center gap-1">
              <span 
                className="inline-block transform" 
                style={{ transform: `rotate(${current?.wind_direction_10m ?? 0}deg)` }}
              >
                ↑
              </span>
              Direction: {getWindDirectionStr(current?.wind_direction_10m ?? 0)}
            </p>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-white/5 hover:bg-white/8 border border-white/5 rounded-3xl p-5 flex flex-col justify-between transition-all group">
          <div className="flex items-center gap-2 mb-3">
            <WeatherIcon name="SunDim" className="h-4 w-4 text-indigo-300 group-hover:scale-110 transition-transform" />
            <p className="text-indigo-300 text-[10px] uppercase tracking-widest font-bold">UV Index</p>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <p className="text-2xl font-bold text-white font-mono">{todayUv.toFixed(1)}</p>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border leading-none ${uvStatus.color}`}>
                {uvStatus.text}
              </span>
            </div>
            <p className="text-[10px] text-white/40 mt-1 font-sans">Peak solar UV exposure</p>
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-white/5 hover:bg-white/8 border border-white/5 rounded-3xl p-5 flex flex-col justify-between transition-all group">
          <div className="flex items-center gap-2 mb-3">
            <WeatherIcon name="Gauge" className="h-4 w-4 text-indigo-300 group-hover:scale-110 transition-transform" />
            <p className="text-indigo-300 text-[10px] uppercase tracking-widest font-bold">Pressure</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-mono">
              {Math.round(current?.pressure_msl ?? 1013)} <span className="text-xs font-normal opacity-50">hPa</span>
            </p>
            <p className="text-[10px] text-white/40 mt-1 font-sans">Mean sea-level pressure</p>
          </div>
        </div>

        {/* Sun Cycle */}
        <div className="bg-white/5 hover:bg-white/8 border border-white/5 rounded-3xl p-5 flex flex-col justify-between transition-all group">
          <div className="flex items-center gap-2 mb-3">
            <WeatherIcon name="Sunrise" className="h-4 w-4 text-indigo-300 group-hover:scale-110 transition-transform" />
            <p className="text-indigo-300 text-[10px] uppercase tracking-widest font-bold">Sun Cycle</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-amber-300 font-bold uppercase">SR:</span>
              <span className="text-xs font-bold text-white/95 font-mono">
                {daily?.sunrise?.[0]?.split("T")?.[1] || "06:00"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-indigo-300 font-bold uppercase">SS:</span>
              <span className="text-xs font-bold text-white/95 font-mono">
                {daily?.sunset?.[0]?.split("T")?.[1] || "18:00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
