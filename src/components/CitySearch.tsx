/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GeocodingCity, GeocodingResponse } from "../types";
import { WeatherIcon } from "./WeatherIcons";

interface CitySearchProps {
  onSelectCity: (city: GeocodingCity) => void;
  isLoadingWeather: boolean;
}

const POPULAR_CITIES: GeocodingCity[] = [
  { id: 5128581, name: "New York", latitude: 40.71427, longitude: -74.00597, country: "United States", country_code: "US", admin1: "New York" },
  { id: 2643743, name: "London", latitude: 51.50853, longitude: -0.12574, country: "United Kingdom", country_code: "GB", admin1: "England" },
  { id: 1850147, name: "Tokyo", latitude: 35.6895, longitude: 139.6917, country: "Japan", country_code: "JP", admin1: "Tokyo" },
  { id: 2988507, name: "Paris", latitude: 48.85341, longitude: 2.3488, country: "France", country_code: "FR", admin1: "Île-de-France" },
  { id: 2147714, name: "Sydney", latitude: -33.86785, longitude: 151.20732, country: "Australia", country_code: "AU", admin1: "New South Wales" },
];

export const CitySearch: React.FC<CitySearchProps> = ({ onSelectCity, isLoadingWeather }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch cities from Open-Meteo Geocoding API
  const searchCities = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=8&language=en&format=json`
      );
      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }
      const data: GeocodingResponse = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Geocoding API error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search trigger
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim() === "") {
      setResults([]);
      setIsSearching(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      searchCities(query);
    }, 450);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const handleSelect = (city: GeocodingCity) => {
    onSelectCity(city);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleDetectLocation = () => {
    setGpsError(null);
    try {
      if (typeof window === "undefined" || typeof navigator === "undefined" || !navigator) {
        setGpsError("Geolocation is not supported in this environment.");
        return;
      }
      
      const geo = navigator.geolocation;
      if (!geo) {
        setGpsError("Geolocation is not supported by your browser or is blocked in this environment.");
        return;
      }

      setGpsLoading(true);

      geo.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use bigdatacloud's free, keyless reverse-geocode API
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            
            let cityName = "Your Location";
            let countryName = "Unknown";
            let countryCode = "LOC";
            let principalSubdivision = "";

            if (response.ok) {
              const data = await response.json();
              cityName = data.city || data.locality || data.principalSubdivision || "Your Location";
              countryName = data.countryName || "Unknown";
              countryCode = data.countryCode || "LOC";
              principalSubdivision = data.principalSubdivision || "";
            }

            const currentCity: GeocodingCity = {
              id: Date.now(), // Generate virtual ID
              name: cityName,
              latitude,
              longitude,
              country: countryName,
              country_code: countryCode,
              admin1: principalSubdivision,
            };

            onSelectCity(currentCity);
            setIsOpen(false);
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            // Fallback to coordinates labeled "Your Location"
            onSelectCity({
              id: Date.now(),
              name: "Detected Location",
              latitude,
              longitude,
              country: "GPS Coordinates",
              country_code: "GPS",
            });
            setIsOpen(false);
          } finally {
            setGpsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMsg = "Unable to retrieve location";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = "Location permission denied. Please search manually.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = "Location information is unavailable.";
          } else if (error.code === error.TIMEOUT) {
            errorMsg = "Location request timed out.";
          }
          setGpsError(errorMsg);
          setGpsLoading(false);
        },
        { timeout: 8000 }
      );
    } catch (err: any) {
      console.error("Synchronous geolocation error:", err);
      setGpsError("Location access is restricted in this environment or sandbox.");
      setGpsLoading(false);
    }
  };

  return (
    <div id="city-search-container" ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50">
            {isSearching ? (
              <WeatherIcon name="RefreshCw" className="h-5 w-5 animate-spin text-indigo-400" />
            ) : (
              <WeatherIcon name="Search" className="h-5 w-5" />
            )}
          </div>
          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search city (e.g. San Francisco)..."
            className="w-full pl-11 pr-10 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/50 font-sans text-base transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
            disabled={isLoadingWeather}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/80 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <button
          id="btn-detect-location"
          type="button"
          onClick={handleDetectLocation}
          disabled={gpsLoading || isLoadingWeather}
          className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white rounded-full flex items-center gap-2 font-medium shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shrink-0"
          title="Detect my current location"
        >
          {gpsLoading ? (
            <WeatherIcon name="Loader2" className="h-5 w-5 animate-spin" />
          ) : (
            <WeatherIcon name="Compass" className="h-5 w-5 text-indigo-300" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {gpsError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-rose-400 font-sans px-3 flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 py-2 rounded-xl"
        >
          <WeatherIcon name="ShieldAlert" className="h-3.5 w-3.5 shrink-0 text-rose-400" />
          {gpsError}
        </motion.p>
      )}

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 max-h-[420px] overflow-y-auto"
          >
            {/* Search results */}
            {query.trim().length >= 2 && results.length > 0 && (
              <div className="py-2">
                <div className="px-5 py-2 text-xs font-mono font-medium text-indigo-300 uppercase tracking-wider border-b border-white/5 mb-1">
                  Search Results
                </div>
                {results.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full px-5 py-3.5 hover:bg-white/5 flex items-center justify-between text-left transition-colors border-b border-white/5 last:border-b-0 text-white"
                  >
                    <div>
                      <span className="font-sans font-semibold text-white text-base">{city.name}</span>
                      <span className="text-sm text-indigo-200/60 ml-2">
                        {city.admin1 ? `${city.admin1}, ` : ""}
                        {city.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 bg-indigo-500/20 border border-indigo-400/20 text-indigo-200 rounded">
                        {city.country_code}
                      </span>
                      <WeatherIcon name="ChevronRight" className="h-4 w-4 text-indigo-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Empty state of search */}
            {query.trim().length >= 2 && results.length === 0 && !isSearching && (
              <div className="py-10 text-center text-slate-300">
                <WeatherIcon name="CloudFog" className="h-10 w-10 mx-auto mb-3 text-white/30" />
                <p className="font-sans text-sm font-semibold text-white">No cities found matching "{query}"</p>
                <p className="text-xs text-white/55 mt-1">Check spelling or try typing a larger city nearby</p>
              </div>
            )}

            {/* Popular/Recent list when no query */}
            {(!query || query.trim().length < 2) && (
              <div className="py-4">
                <div className="px-5 py-2 text-xs font-mono font-medium text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <WeatherIcon name="Sparkles" className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
                  Popular Global Cities
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-3">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelect(city)}
                      className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-all"
                    >
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/25 border border-indigo-400/20 flex items-center justify-center text-indigo-300 shrink-0 font-sans font-bold text-xs">
                        {city.country_code}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-sans font-semibold text-sm text-white truncate">{city.name}</p>
                        <p className="text-xs text-white/60 truncate">{city.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
