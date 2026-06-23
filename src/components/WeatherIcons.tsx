/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Layers,
  Shirt,
  Flame,
  Droplet,
  Umbrella,
  Wind,
  Sparkles,
  Home,
  ShieldAlert,
  Search,
  Compass,
  MapPin,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  Calendar,
  TrendingUp,
  Check,
  Loader2,
  ChevronRight,
  Info,
  RefreshCw,
  SunDim
} from "lucide-react";
import type { LucideProps } from "lucide-react";

interface WeatherIconProps extends Omit<LucideProps, "ref"> {
  name: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, ...props }) => {
  switch (name) {
    // Weather icons
    case "Sun":
      return <Sun {...props} />;
    case "Moon":
      return <Moon {...props} />;
    case "CloudSun":
      return <CloudSun {...props} />;
    case "CloudMoon":
      return <CloudMoon {...props} />;
    case "Cloud":
      return <Cloud {...props} />;
    case "CloudFog":
      return <CloudFog {...props} />;
    case "CloudDrizzle":
      return <CloudDrizzle {...props} />;
    case "CloudRain":
      return <CloudRain {...props} />;
    case "CloudRainWind":
      return <CloudRainWind {...props} />;
    case "CloudSnow":
      return <CloudSnow {...props} />;
    case "Snowflake":
      return <Snowflake {...props} />;
    case "CloudLightning":
      return <CloudLightning {...props} />;

    // Recommendation/UI icons
    case "Layers":
      return <Layers {...props} />;
    case "Shirt":
      return <Shirt {...props} />;
    case "Flame":
      return <Flame {...props} />;
    case "Droplet":
      return <Droplet {...props} />;
    case "Umbrella":
      return <Umbrella {...props} />;
    case "Wind":
      return <Wind {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
    case "Home":
      return <Home {...props} />;
    case "ShieldAlert":
      return <ShieldAlert {...props} />;
    case "Search":
      return <Search {...props} />;
    case "Compass":
      return <Compass {...props} />;
    case "MapPin":
      return <MapPin {...props} />;
    case "Thermometer":
      return <Thermometer {...props} />;
    case "Gauge":
      return <Gauge {...props} />;
    case "Sunrise":
      return <Sunrise {...props} />;
    case "Sunset":
      return <Sunset {...props} />;
    case "Calendar":
      return <Calendar {...props} />;
    case "TrendingUp":
      return <TrendingUp {...props} />;
    case "Check":
      return <Check {...props} />;
    case "Loader2":
      return <Loader2 {...props} />;
    case "ChevronRight":
      return <ChevronRight {...props} />;
    case "Info":
      return <Info {...props} />;
    case "RefreshCw":
      return <RefreshCw {...props} />;
    case "SunDim":
      return <SunDim {...props} />;
    default:
      return <Cloud {...props} />;
  }
};
