/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrentWeatherData, DailyWeatherData, WeatherInfo, WeatherRecommendation } from "../types";

/**
 * Maps WMO Weather Interpretation Codes to readable descriptions, icons, and styling themes.
 * WMO code reference: https://open-meteo.com/en/docs
 */
export function getWeatherInfo(code: number, isDay: number = 1): WeatherInfo {
  // Default fallback
  const fallback: WeatherInfo = {
    label: "Unknown",
    description: "Condition unavailable",
    iconName: "Cloud",
    gradientClass: "from-slate-500 to-slate-700",
    bgCardClass: "bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800",
    textAccentClass: "text-slate-600 dark:text-slate-400",
  };

  switch (code) {
    case 0: // Clear sky
      return {
        label: "Clear Sky",
        description: isDay ? "Sunny and clear skies" : "Clear starry night",
        iconName: isDay ? "Sun" : "Moon",
        gradientClass: isDay 
          ? "from-amber-400 via-orange-400 to-amber-500" 
          : "from-indigo-900 via-slate-900 to-black",
        bgCardClass: isDay 
          ? "bg-amber-50/70 border-amber-200" 
          : "bg-indigo-950/30 border-indigo-900/50",
        textAccentClass: isDay ? "text-amber-600" : "text-indigo-400",
      };

    case 1: // Mainly clear
    case 2: // Partly cloudy
    case 3: // Overcast
      if (code === 1) {
        return {
          label: "Mainly Clear",
          description: isDay ? "Mostly sunny skies" : "Mostly clear night",
          iconName: isDay ? "CloudSun" : "CloudMoon",
          gradientClass: isDay 
            ? "from-blue-400 via-sky-400 to-amber-300" 
            : "from-slate-800 via-indigo-900 to-slate-950",
          bgCardClass: isDay 
            ? "bg-sky-50/60 border-sky-100" 
            : "bg-slate-900/60 border-slate-800",
          textAccentClass: isDay ? "text-sky-600" : "text-indigo-300",
        };
      } else if (code === 2) {
        return {
          label: "Partly Cloudy",
          description: "Scattered clouds in the sky",
          iconName: isDay ? "CloudSun" : "CloudMoon",
          gradientClass: "from-sky-400 via-slate-300 to-blue-500",
          bgCardClass: "bg-slate-50/80 border-slate-200",
          textAccentClass: "text-sky-600",
        };
      } else {
        return {
          label: "Overcast",
          description: "Grey and completely cloudy",
          iconName: "Cloud",
          gradientClass: "from-slate-400 to-slate-600",
          bgCardClass: "bg-slate-100/80 border-slate-200",
          textAccentClass: "text-slate-600",
        };
      }

    case 45: // Fog
    case 48: // Depositing rime fog
      return {
        label: "Foggy",
        description: "Dense fog reduces visibility",
        iconName: "CloudFog",
        gradientClass: "from-slate-300 via-zinc-400 to-slate-400",
        bgCardClass: "bg-zinc-100/80 border-zinc-200",
        textAccentClass: "text-zinc-600",
      };

    case 51: // Light drizzle
    case 53: // Moderate drizzle
    case 55: // Dense drizzle
      return {
        label: "Drizzle",
        description: "Continuous light misty drizzle",
        iconName: "CloudDrizzle",
        gradientClass: "from-cyan-300 via-sky-400 to-blue-500",
        bgCardClass: "bg-cyan-50/70 border-cyan-200",
        textAccentClass: "text-cyan-600",
      };

    case 56: // Light freezing drizzle
    case 57: // Dense freezing drizzle
      return {
        label: "Freezing Drizzle",
        description: "Slippery freezing drizzle",
        iconName: "CloudSnow",
        gradientClass: "from-blue-200 via-cyan-300 to-indigo-400",
        bgCardClass: "bg-blue-50/70 border-blue-200",
        textAccentClass: "text-indigo-500",
      };

    case 61: // Slight rain
    case 63: // Moderate rain
    case 65: // Heavy rain
      return {
        label: code === 61 ? "Light Rain" : code === 63 ? "Rain" : "Heavy Rain",
        description: code === 65 ? "Torrential heavy rain" : "Steady rainfall",
        iconName: code === 65 ? "CloudRainWind" : "CloudRain",
        gradientClass: "from-blue-400 via-indigo-400 to-slate-700",
        bgCardClass: "bg-blue-50/70 border-blue-200",
        textAccentClass: "text-blue-600",
      };

    case 66: // Light freezing rain
    case 67: // Heavy freezing rain
      return {
        label: "Freezing Rain",
        description: "Rain freezing on contact",
        iconName: "CloudSnow",
        gradientClass: "from-cyan-400 to-indigo-600",
        bgCardClass: "bg-cyan-50/70 border-cyan-200",
        textAccentClass: "text-indigo-600",
      };

    case 71: // Slight snow fall
    case 73: // Moderate snow fall
    case 75: // Heavy snow fall
    case 77: // Snow grains
      return {
        label: "Snowfall",
        description: code === 75 ? "Heavy blizzard conditions" : "Gently falling snow",
        iconName: "Snowflake",
        gradientClass: "from-sky-100 via-blue-200 to-cyan-300",
        bgCardClass: "bg-sky-50/60 border-sky-200",
        textAccentClass: "text-sky-500",
      };

    case 80: // Slight rain showers
    case 81: // Moderate rain showers
    case 82: // Violent rain showers
      return {
        label: "Rain Showers",
        description: "Passing rain showers",
        iconName: "CloudRain",
        gradientClass: "from-sky-400 via-blue-500 to-slate-600",
        bgCardClass: "bg-sky-50/80 border-sky-200",
        textAccentClass: "text-blue-600",
      };

    case 85: // Slight snow showers
    case 86: // Heavy snow showers
      return {
        label: "Snow Showers",
        description: "Brief wintery snow showers",
        iconName: "CloudSnow",
        gradientClass: "from-blue-200 via-sky-300 to-slate-400",
        bgCardClass: "bg-blue-50/70 border-blue-200",
        textAccentClass: "text-sky-600",
      };

    case 95: // Thunderstorm
    case 96: // Thunderstorm with slight hail
    case 99: // Thunderstorm with heavy hail
      return {
        label: "Thunderstorm",
        description: "Lightning and severe thunderstorms",
        iconName: "CloudLightning",
        gradientClass: "from-slate-700 via-purple-900 to-slate-900",
        bgCardClass: "bg-purple-950/20 border-purple-900/40",
        textAccentClass: "text-purple-600",
      };

    default:
      return fallback;
  }
}

/**
 * Utility to convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Returns a day name of the week from an ISO date string (e.g. "Monday")
 */
export function getDayName(dateStr: string, format: "short" | "long" = "long"): string {
  if (!dateStr) return "N/A";
  try {
    const cleanDateStr = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`;
    const date = new Date(cleanDateStr);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("en-US", { weekday: format });
  } catch (e) {
    return "N/A";
  }
}

/**
 * Formats standard date string to dynamic readable format (e.g. "Jun 23, 2026")
 */
export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return "N/A";
  try {
    const cleanDateStr = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`;
    const date = new Date(cleanDateStr);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return "N/A";
  }
}

/**
 * Dynamic intelligent weather recommendations generator.
 * Analyzes multiple elements from current conditions and 7-day forecast to output tailored tips.
 */
export function generateRecommendations(
  current: CurrentWeatherData,
  daily: DailyWeatherData
): WeatherRecommendation[] {
  const recs: WeatherRecommendation[] = [];

  if (!current || !daily) return recs;

  // 1. Temperature Apparel Tips (Based on apparent temperature)
  const appTemp = current.apparent_temperature ?? 15;
  if (appTemp < 0) {
    recs.push({
      id: "clothing-extreme-cold",
      type: "clothing",
      title: "Freezing Cold Weather Alert",
      description: `It feels like ${appTemp}°C. Heavy winter clothing is critical. Dress in insulated layers, wear a thick down jacket, thermal gloves, a beanie, and a scarf.`,
      iconName: "Layers",
      severity: "danger",
    });
  } else if (appTemp < 10) {
    recs.push({
      id: "clothing-chilly",
      type: "clothing",
      title: "Warm Layers Recommended",
      description: `It feels crisp and chilly at ${Math.round(appTemp)}°C. We recommend wearing a warm coat, a sweater, or thermal underlayers to stay cozy.`,
      iconName: "Shirt",
      severity: "warning",
    });
  } else if (appTemp >= 10 && appTemp < 20) {
    recs.push({
      id: "clothing-mild",
      type: "clothing",
      title: "Mild & Comfortable apparel",
      description: `Apparent temperature is a pleasant ${Math.round(appTemp)}°C. A light jacket, cardigan, or hoodie is perfect. Great weather to layer comfortably.`,
      iconName: "Shirt",
      severity: "info",
    });
  } else if (appTemp >= 20 && appTemp < 28) {
    recs.push({
      id: "clothing-warm",
      type: "clothing",
      title: "Warm Weather Gear",
      description: `Pleasantly warm at ${Math.round(appTemp)}°C. Comfortable for light fabrics like cotton t-shirts, shorts, or summer dresses.`,
      iconName: "Shirt",
      severity: "success",
    });
  } else {
    recs.push({
      id: "clothing-hot",
      type: "clothing",
      title: "Extreme Heat Warning",
      description: `High temperatures feel like ${Math.round(appTemp)}°C! Wear extremely light, loose, breathable clothing. Stay in air-conditioned spaces where possible.`,
      iconName: "Flame",
      severity: "danger",
    });
  }

  // 2. Hydration Warning for high temperatures
  const currentTemp = current?.temperature_2m ?? 15;
  if (currentTemp >= 28) {
    recs.push({
      id: "activity-hydration",
      type: "caution",
      title: "Hydration Alert",
      description: "High temperature detected. Ensure you drink extra water throughout the day, even if you are not active. Avoid excessive alcohol or caffeine.",
      iconName: "Droplet",
      severity: "warning",
    });
  }

  // 3. Rain & Precipitation Intelligence (Umbrella Alert)
  const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const currentWeatherCode = current?.weather_code ?? 0;
  const isCurrentlyRaining = rainCodes.includes(currentWeatherCode);
  
  if (isCurrentlyRaining) {
    recs.push({
      id: "umbrella-now",
      type: "caution",
      title: "Umbrella Required Now",
      description: "Wet weather active outside! An umbrella, waterproof raincoat, and slip-resistant footwear are highly recommended before heading out.",
      iconName: "Umbrella",
      severity: "danger",
    });
  } else {
    // Check 7-day forecast for rain
    const wetDays: string[] = [];
    const dailyTime = daily?.time || [];
    for (let i = 0; i < dailyTime.length; i++) {
      const dailyCode = daily?.weather_code?.[i] ?? 0;
      const dailyProb = daily?.precipitation_probability_max?.[i] ?? 0;
      if (rainCodes.includes(dailyCode) && dailyProb >= 60) {
        const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : getDayName(dailyTime[i]);
        wetDays.push(`${dayName} (${dailyProb}% rain)`);
      }
    }

    if (wetDays.length > 0) {
      recs.push({
        id: "umbrella-forecast",
        type: "activity",
        title: "Rain Forecasted This Week",
        description: `Plan ahead! Showers or steady rain are highly likely on: ${wetDays.slice(0, 3).join(", ")}. Keep an umbrella or rain gear close by on these days.`,
        iconName: "Umbrella",
        severity: "warning",
      });
    }
  }

  // 4. UV Protection Alert (Sunscreen Tip)
  const todayUv = daily?.uv_index_max?.[0] ?? 0;
  if (todayUv >= 6) {
    let uvRisk = "high";
    let advice = "Apply SPF 30+ sunscreen, wear a wide-brimmed hat, and sport sunglasses. Try to seek shade during midday sun peaks (10 AM - 4 PM).";
    let severity: "warning" | "danger" = "warning";

    if (todayUv >= 8) {
      uvRisk = "very high to extreme";
      advice = "Vigorous protection needed! Apply SPF 50+ sunscreen, wear protective clothing, and strictly minimize direct sun exposure between 11 AM and 3 PM.";
      severity = "danger";
    }

    recs.push({
      id: "sun-protection",
      type: "caution",
      title: `High UV Exposure Risk (${todayUv.toFixed(1)})`,
      description: `Today's UV index is ${uvRisk}. ${advice}`,
      iconName: "Sun",
      severity: severity,
    });
  }

  // 5. Wind Warning
  const currentWindSpeed = current?.wind_speed_10m ?? 0;
  if (currentWindSpeed >= 25) {
    recs.push({
      id: "wind-alert",
      type: "caution",
      title: `High Winds Active (${currentWindSpeed} km/h)`,
      description: "Breezy or gale conditions present. Secure light outdoor objects, exercise caution when driving high-profile vehicles, and brace for wind chill.",
      iconName: "Wind",
      severity: "warning",
    });
  }

  // 6. Perfect Outdoor Weather Optimizer (Smart planning)
  const perfectDays: string[] = [];
  const dailyTime = daily?.time || [];
  for (let i = 1; i < dailyTime.length; i++) { // Skip index 0 (today)
    const dailyCode = daily?.weather_code?.[i] ?? 0;
    const dailyMaxTemp = daily?.temperature_2m_max?.[i] ?? 0;
    const dailyProb = daily?.precipitation_probability_max?.[i] ?? 0;

    const isNiceCode = [0, 1, 2].includes(dailyCode);
    const isNiceTemp = dailyMaxTemp >= 18 && dailyMaxTemp <= 26;
    const isLowRain = dailyProb < 20;

    if (isNiceCode && isNiceTemp && isLowRain) {
      perfectDays.push(getDayName(dailyTime[i]));
    }
  }

  const cloudCover = current?.cloud_cover ?? 0;
  if (!isCurrentlyRaining && currentTemp >= 18 && currentTemp <= 26 && cloudCover < 50) {
    recs.push({
      id: "activity-outdoor-perfect",
      type: "activity",
      title: "Excellent Outdoor Weather Now!",
      description: "The current conditions are perfect! Ideal time for a walk, bicycle ride, garden activities, outdoor sports, or dining alfresco.",
      iconName: "Sparkles",
      severity: "success",
    });
  } else if (perfectDays.length > 0) {
    recs.push({
      id: "activity-outdoor-future",
      type: "activity",
      title: "Upcoming Stellar Days Ahead",
      description: `Beautiful, sunny, and mild conditions are forecasted on: ${perfectDays.slice(0, 2).join(" & ")}. Plan your runs, picnics, or outdoor errands for these days!`,
      iconName: "Sparkles",
      severity: "success",
    });
  } else if (currentWeatherCode === 3 || isCurrentlyRaining) {
    recs.push({
      id: "activity-indigo-optimal",
      type: "activity",
      title: "Ideal Day for Cozy Indoor Plans",
      description: "With cloudy or wet conditions outside, today is prime for indoor pastimes—reading a book, visiting a museum, cinema, or organizing your home.",
      iconName: "Home",
      severity: "info",
    });
  }

  // 7. Freezing warnings / Slippery roads
  if (currentTemp <= 1) {
    recs.push({
      id: "caution-slippery",
      type: "caution",
      title: "Slippery Surfaces & Ice Watch",
      description: "Temperatures are hovering near or below freezing. Black ice could form on roads and sidewalks. Drive and walk with heightened awareness.",
      iconName: "ShieldAlert",
      severity: "warning",
    });
  }

  return recs;
}
