/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { CurrentWeatherData, DailyWeatherData, WeatherRecommendation } from "../types";
import { generateRecommendations } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcons";

interface RecommendationCardProps {
  current: CurrentWeatherData;
  daily: DailyWeatherData;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ current, daily }) => {
  const recommendations = generateRecommendations(current, daily);

  // Map severity to high-fidelity glassy dark styles
  const getSeverityClasses = (severity: WeatherRecommendation["severity"]) => {
    switch (severity) {
      case "danger":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15",
          text: "text-rose-100",
          subText: "text-rose-200/85",
          iconBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          accentLine: "bg-rose-500",
          badge: "bg-rose-500/25 text-rose-300 border-rose-500/30",
        };
      case "warning":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15",
          text: "text-amber-100",
          subText: "text-amber-200/85",
          iconBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          accentLine: "bg-amber-500",
          badge: "bg-amber-500/25 text-amber-300 border-amber-500/30",
        };
      case "success":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15",
          text: "text-emerald-100",
          subText: "text-emerald-200/85",
          iconBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          accentLine: "bg-emerald-400",
          badge: "bg-emerald-500/25 text-emerald-300 border-emerald-500/30",
        };
      case "info":
      default:
        return {
          bg: "bg-white/5 border-white/10 hover:bg-white/10",
          text: "text-white",
          subText: "text-indigo-200/80",
          iconBg: "bg-white/10 text-indigo-300 border-white/10",
          accentLine: "bg-indigo-400",
          badge: "bg-indigo-500/30 text-indigo-200 border-indigo-400/25",
        };
    }
  };

  const getRecommendationBadge = (type: WeatherRecommendation["type"]) => {
    switch (type) {
      case "activity":
        return "Plan Advisory";
      case "clothing":
        return "Clothing Guide";
      case "caution":
        return "Safety Warning";
      case "general":
      default:
        return "General Intel";
    }
  };

  return (
    <div id="weather-recommendations-section" className="bg-gradient-to-br from-indigo-950/40 to-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 rounded-2xl">
            <WeatherIcon name="Compass" className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Intelligence Insights</h3>
            <p className="text-xs text-indigo-200/60 mt-0.5">Dynamic planning, lifestyle, and wardrobe advisories</p>
          </div>
        </div>
        <span className="self-start sm:self-center text-[10px] font-mono bg-indigo-500/20 text-indigo-200 px-3 py-1.5 rounded-full border border-indigo-400/30 font-semibold uppercase tracking-wider">
          AI Advisory Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          const styles = getSeverityClasses(rec.severity);
          return (
            <motion.div
              id={`recommendation-card-${index}`}
              key={rec.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className={`relative overflow-hidden rounded-3xl border ${styles.bg} p-5 flex gap-4 transition-all duration-300 shadow-md`}
            >
              {/* Decorative side accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.accentLine}`} />

              {/* Icon Container */}
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${styles.iconBg}`}>
                <WeatherIcon name={rec.iconName} className="h-5.5 w-5.5" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${styles.badge} tracking-wider uppercase font-mono`}>
                    {getRecommendationBadge(rec.type)}
                  </span>
                </div>
                <h4 className={`font-bold ${styles.text} text-base leading-snug`}>
                  {rec.title}
                </h4>
                <p className={`${styles.subText} text-sm mt-1.5 leading-relaxed`}>
                  {rec.description}
                </p>
              </div>
            </motion.div>
          );
        })}

        {recommendations.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white/5 rounded-3xl border border-white/5 text-white/60">
            <WeatherIcon name="Sparkles" className="h-10 w-10 mx-auto mb-3 text-indigo-400/70" />
            <p className="font-semibold text-white text-base">Perfect Weather Profile</p>
            <p className="text-xs text-indigo-200/50 mt-1">Conditions are completely stable. No special weather warnings or wardrobe advisories are active.</p>
          </div>
        )}
      </div>
    </div>
  );
};
