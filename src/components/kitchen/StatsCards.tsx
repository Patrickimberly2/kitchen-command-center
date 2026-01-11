import React from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle, Calendar, Grid3X3 } from "lucide-react";

type StatsCardsProps = {
  totalItems: number;
  expiringItems: number;
  lowStockItems: number;
  totalZones: number;
};

export default function StatsCards({ totalItems, expiringItems, lowStockItems, totalZones }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      alert: false,
    },
    {
      label: "Expiring Soon",
      value: expiringItems,
      icon: Calendar,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      alert: expiringItems > 0,
    },
    {
      label: "Low Stock",
      value: lowStockItems,
      icon: AlertTriangle,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
      alert: lowStockItems > 0,
    },
    {
      label: "Storage Zones",
      value: totalZones,
      icon: Grid3X3,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      alert: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-xl p-4 relative overflow-hidden`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
          </div>

          {stat.alert && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
