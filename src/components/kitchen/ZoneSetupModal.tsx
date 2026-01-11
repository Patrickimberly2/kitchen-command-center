import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Ruler, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const zoneTypes = [
  { value: "upper_cabinet", label: "Upper Cabinet", icon: "🗄️" },
  { value: "lower_cabinet", label: "Lower Cabinet", icon: "📦" },
  { value: "drawer", label: "Drawer", icon: "🗃️" },
  { value: "pantry", label: "Pantry", icon: "🚪" },
  { value: "refrigerator", label: "Refrigerator", icon: "🧊" },
  { value: "freezer", label: "Freezer", icon: "❄️" },
  { value: "island", label: "Island Storage", icon: "🏝️" },
  { value: "peninsula", label: "Peninsula", icon: "📐" },
  { value: "appliance", label: "Appliance", icon: "⚡" },
  { value: "shelf", label: "Open Shelf", icon: "📚" },
  { value: "countertop", label: "Countertop", icon: "🔲" },
];

const presetColors = ["#e8dfd5", "#d4ccc2", "#c9c1b7", "#f5f5f5", "#e8f4f8", "#d4a574", "#c9956c", "#bf8a5e", "#a8d5e5", "#7bc4dc"];

type Position = { x: number; y: number; z: number };
type Dimensions = { width: number; height: number; depth: number };

type KitchenZone = {
  id: string;
  name: string;
  zone_type: string;
  position: Position;
  dimensions: Dimensions;
  color: string;
  notes?: string | null;
};

type ZoneSetupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<KitchenZone>) => Promise<void> | void;
  zone: KitchenZone | null;
};

export default function ZoneSetupModal({ isOpen, onClose, onSave, zone }: ZoneSetupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = "zone-setup-form";
  const [formData, setFormData] = useState({
    name: "",
    zone_type: "lower_cabinet",
    position: { x: 0, y: 0, z: 0 } as Position,
    dimensions: { width: 1, height: 1, depth: 0.6 } as Dimensions,
    color: "#e8dfd5",
    notes: "",
  });

  useEffect(() => {
    if (!zone) {
      setFormData({
        name: "",
        zone_type: "lower_cabinet",
        position: { x: 0, y: 0, z: 0 },
        dimensions: { width: 1, height: 1, depth: 0.6 },
        color: "#e8dfd5",
        notes: "",
      });
      return;
    }

    setFormData({
      name: zone.name || "",
      zone_type: zone.zone_type || "lower_cabinet",
      position: zone.position || { x: 0, y: 0, z: 0 },
      dimensions: zone.dimensions || { width: 1, height: 1, depth: 0.6 },
      color: zone.color || "#e8dfd5",
      notes: zone.notes || "",
    });
  }, [zone]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{zone ? "Edit Zone" : "Add Storage Zone"}</h2>
                <p className="text-sm text-gray-500 mt-1">Configure your kitchen storage area</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Zone Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="e.g., Upper Left Cabinet, Spice Drawer..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Zone Type *</nLabel>
                            <Label className="text-sm font-medium text-gray-700">Zone Type *</Label>
                        <form id={formId} onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
              <Select value={formData.zone_type} onValueChange={(value) => setFormData((prev) => ({ ...prev, zone_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {zoneTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Position (3D coordinates)
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {["x", "y", "z"].map((axis) => (
                  <div key={axis}>
                    <Label className="text-xs text-gray-500 uppercase">{axis}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.position[axis as keyof Position]}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          position: {
                            ...prev.position,
                            [axis]: parseFloat(event.target.value) || 0,
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Dimensions
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ["width", 1],
                    ["height", 1],
                    ["depth", 0.6],
                  ] as Array<[keyof Dimensions, number]>
                ).map(([dimension, fallback]) => (
                  <div key={dimension}>
                    <Label className="text-xs text-gray-500 capitalize">{dimension}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.dimensions[dimension]}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          dimensions: {
                            ...prev.dimensions,
                            [dimension]: parseFloat(event.target.value) || fallback,
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      formData.color === color ? "border-amber-500 scale-110" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(event) => setFormData((prev) => ({ ...prev, color: event.target.value }))}
                  className="w-8 h-8 p-0 border-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="What do you typically store here?"
                rows={2}
              />
            </div>
          </form>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting || !formData.name}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? "Saving..." : zone ? "Update Zone" : "Add Zone"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
