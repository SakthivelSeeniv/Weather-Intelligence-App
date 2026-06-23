/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { DailyWeatherData } from "../types";
import { getWeatherInfo, getDayName, formatDateReadable, celsiusToFahrenheit } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcons";

interface WeeklyForecastProps {
  daily: DailyWeatherData;
  isMetric: boolean;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ daily, isMetric }) => {
  // Find absolute max and min temperatures for the week's visual bar range
  const maxTemps = (daily?.temperature_2m_max || []).filter((t): t is number => typeof t === "number" && !isNaN(t));
  const minTemps = (daily?.temperature_2m_min || []).filter((t): t is number => typeof t === "number" && !isNaN(t));
  const absoluteMax = maxTemps.length > 0 ? Math.max(...maxTemps) : 30;
  const absoluteMin = minTemps.length > 0 ? Math.min(...minTemps) : 10;
  const totalRange = absoluteMax - absoluteMin;

  const formatTemp = (celsius: number) => {
    if (typeof celsius !== "number" || isNaN(celsius)) return "--";
    if (isMetric) {
      return `${Math.round(celsius)}°`;
    }
    return `${celsiusToFahrenheit(celsius)}°`;
  };

  const dailyTime = daily?.time || [];

  return (
    <div id="weekly-forecast-card" className="bg-gradient-to-br from-indigo-950/40 to-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 rounded-2xl">
            <WeatherIcon name="Calendar" className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">7-Day Forecast</h3>
            <p className="text-xs text-indigo-200/60 mt-0.5">Extended weekly outlook and daily temperature spreads</p>
          </div>
        </div>
        <div className="text-xs text-indigo-300/60 font-mono bg-white/5 border border-white/5 px-3 py-1 rounded-full">
          Range: {formatTemp(absoluteMin)} to {formatTemp(absoluteMax)}
        </div>
      </div>

      <div className="space-y-3">
        {dailyTime.map((time, index) => {
          const isToday = index === 0;
          const isTomorrow = index === 1;
          const dayTitle = isToday ? "Today" : isTomorrow ? "Tomorrow" : getDayName(time);
          const dateStr = formatDateReadable(time).split(",")[0]; // Just Month & Day e.g. "Jun 23"
          
          const code = daily?.weather_code?.[index] ?? 0;
          const weatherInfo = getWeatherInfo(code, 1); // Default to day icon for forecast lists
          const minTemp = daily?.temperature_2m_min?.[index] ?? 0;
          const maxTemp = daily?.temperature_2m_max?.[index] ?? 0;
          const rainProb = daily?.precipitation_probability_max?.[index] ?? 0;

          // Calculate temperature bar positions
          const barLeftOffset = totalRange > 0 ? ((minTemp - absoluteMin) / totalRange) * 100 : 0;
          const barWidth = totalRange > 0 ? ((maxTemp - minTemp) / totalRange) * 100 : 100;

          return (
            <motion.div
              id={`weekly-day-${index}`}
              key={time}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between py-4 px-5 rounded-2xl transition-all duration-300 gap-4 border ${
                isToday 
                  ? "bg-white/10 border-white/15 ring-1 ring-indigo-400/30 shadow-lg" 
                  : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
              }`}
            >
              {/* Day & Date info */}
              <div className="flex items-center sm:w-1/4 min-w-[120px] gap-3">
                <div className={`h-2 w-2 rounded-full ${isToday ? "bg-indigo-400 shadow-md shadow-indigo-400 animate-pulse" : "bg-transparent"}`} title={isToday ? "Current Day" : ""} />
                <div>
                  <h4 className={`text-sm ${isToday ? "text-indigo-300 font-extrabold" : "text-white font-semibold"}`}>
                    {dayTitle}
                  </h4>
                  <p className="text-xs text-indigo-200/50 font-medium">{dateStr}</p>
                </div>
              </div>

              {/* Weather Condition Icon & Title */}
              <div className="flex items-center gap-3 sm:w-1/4">
                <div className="p-2 rounded-xl bg-white/10 border border-white/5 group-hover:bg-white/15 text-white">
                  <WeatherIcon name={weatherInfo.iconName} className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block line-clamp-1">
                    {weatherInfo.label}
                  </span>
                  {rainProb > 25 && (
                    <span className="text-xs text-blue-400 font-bold flex items-center gap-1 mt-0.5">
                      ☔ {rainProb}%
                    </span>
                  )}
                </div>
              </div>

              {/* Temperature Bar Visualizer (Only visible on screens with enough space) */}
              <div className="hidden md:flex items-center flex-1 mx-4 gap-3">
                <span className="text-xs font-mono font-bold text-indigo-200/50 w-8 text-right">
                  {formatTemp(minTemp)}
                </span>
                
                {/* Apple-style gradient range bar */}
                <div className="relative flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 shadow-sm"
                    style={{
                      left: `${barLeftOffset}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-mono font-bold text-white w-8">
                  {formatTemp(maxTemp)}
                </span>
              </div>

              {/* Min/Max Text Fallback for Mobile */}
              <div className="flex md:hidden items-center gap-2 font-mono text-sm self-end sm:self-auto">
                <span className="text-indigo-200/60 font-medium">Low: {formatTemp(minTemp)}</span>
                <span className="text-white/10">|</span>
                <span className="text-white font-bold">High: {formatTemp(maxTemp)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
