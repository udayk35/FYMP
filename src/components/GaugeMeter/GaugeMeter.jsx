import React from "react";
import { GaugeComponent } from "react-gauge-component";

export const GaugeMeter = ({ value, label }) => {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-2 text-2xl">{label}</p>
        <GaugeComponent
          value={value}
          type="radial"
          arc={{ width: 0.3, padding: 0.02, cornerRadius: 1 }}
          pointer={{ length: 0.75, width: 10 }}
          labels={{ valueLabel: { formatTextValue: (val) => `${val}%` } }}
        />
      </div>
    );
  };