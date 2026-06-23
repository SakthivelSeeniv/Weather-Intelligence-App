/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { HourlyWeatherData } from "../types";
import { getWeatherInfo, celsiusToFahrenheit } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcons";

interface HourlyForecastProps {
  hourly: HourlyWeatherData;
  isMetric: boolean;
  currentTimeStr?: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, isMetric, currentTimeStr }) => {
  const formatTemp = (celsius: number) => {
    if (typeof celsius !== "number" || isNaN(celsius)) return "--";
    if (isMetric) {
      return `${Math.round(celsius)}°`;
    }
    return `${celsiusToFahrenheit(celsius)}°`;
  };

  const formatHourLabel = (timeStr: string) => {
    if (!timeStr) return "--:--";
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return "--:--";
    const options: Intl.DateTimeFormatOptions = { hour: "numeric", hour12: true };
    return date.toLocaleTimeString("en-US", options);
  };

  // Find index of the current hour to start the timeline
  const getCurrentHourIndex = () => {
    if (!currentTimeStr) return 0;
    
    // Parse hour parts
    const dateParsed = new Date(currentTimeStr);
    if (isNaN(dateParsed.getTime())) return 0;
    const currentHour = dateParsed.getHours();
    const todayStr = currentTimeStr.split("T")[0];

    const hourlyTimeList = hourly?.time || [];

    for (let i = 0; i < hourlyTimeList.length; i++) {
      const timeVal = hourlyTimeList[i] || "";
      const hourlyDate = timeVal.split("T")[0];
      const timeDateParsed = new Date(timeVal);
      const hourlyHour = !isNaN(timeDateParsed.getTime()) ? timeDateParsed.getHours() : -1;
      
      if (hourlyDate === todayStr && hourlyHour === currentHour) {
        return i;
      }
    }
    return 0;
  };

  const startIndex = getCurrentHourIndex();
  const hourlyTimeList = hourly?.time || [];
  
  // Get next 24 hours of data
  const next24Hours = hourlyTimeList.slice(startIndex, startIndex + 24).map((_, idx) => {
    const actualIdx = startIndex + idx;
    return {
      time: hourlyTimeList[actualIdx] || "",
      temp: hourly?.temperature_2m?.[actualIdx] ?? 0,
      code: hourly?.weather_code?.[actualIdx] ?? 0,
      prob: hourly?.precipitation_probability?.[actualIdx] ?? 0,
    };
  });

  return (
    <div id="hourly-forecast-card" className="bg-gradient-to-br from-indigo-950/40 to-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl font-sans overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 rounded-2xl">
          <WeatherIcon name="TrendingUp" className="h-5.5 w-5.5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Hourly Timeline</h3>
          <p className="text-xs text-indigo-200/60 mt-0.5">Atmospheric progression and temperature charts for the next 24 hours</p>
        </div>
      </div>

      {/* Horizontal Scroll Area with premium styling */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {next24Hours.map((hourData, index) => {
          const isNow = index === 0;
          const weatherInfo = getWeatherInfo(hourData.code, 1); // standard day representation

          return (
            <motion.div
              id={`hourly-step-${index}`}
              key={hourData.time}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: index * 0.02 }}
              className={`flex flex-col items-center justify-between p-4 rounded-2xl min-w-[80px] transition-all border ${
                isNow 
                  ? "bg-white border-white text-indigo-950 shadow-xl shadow-white/5 scale-[1.03]" 
                  : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 text-white"
              }`}
            >
              <p className={`text-[10px] font-bold tracking-wider font-mono uppercase ${isNow ? "text-indigo-900/70" : "text-indigo-200/50"}`}>
                {isNow ? "NOW" : formatHourLabel(hourData.time)}
              </p>

              <div className={`my-3 text-2xl ${isNow ? "text-indigo-950" : "text-white"}`}>
                <WeatherIcon name={weatherInfo.iconName} className="h-6 w-6" />
              </div>

              <div className="text-center">
                <p className="text-base font-extrabold font-mono leading-none">
                  {formatTemp(hourData.temp)}
                </p>
                {hourData.prob > 20 ? (
                  <p className={`text-[9px] font-bold mt-1.5 font-mono ${isNow ? "text-indigo-600" : "text-blue-400"}`}>
                    ☔ {hourData.prob}%
                  </p>
                ) : (
                  <p className="text-[9px] opacity-0 font-mono mt-1.5">-</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
