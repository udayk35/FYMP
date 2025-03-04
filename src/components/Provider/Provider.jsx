import React, { useState } from "react";
import { ImPower } from "react-icons/im"
import { VscVmActive } from "react-icons/vsc";
import { FaHourglassStart, FaRegStar } from "react-icons/fa";
import { GaugeMeter } from "../../components/GaugeMeter/GaugeMeter.jsx";
import "./Provider.css";
export const Provider = ({
    provider
}) => {
    const [expanded, setExpanded] = useState(null);
    return (
        <div key={provider.ip} className="provider shadow-lg rounded-2xl bg-white border border-gray-200">
            <div className="flex justify-evenly items-center">
                <div className="flex flex-col justify-center items-center">
                    <span className="text">{provider.name}</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <ImPower className="text-3xl text-cyan-500" />
                    <span>Power Shared</span>
                    <span className="text">{provider.powerShared}</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <VscVmActive className="text-3xl text-orange-700" />
                    <span>Active Time</span>
                    <span className="text">{provider.activeTime}</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <FaHourglassStart className="text-3xl text-indigo-700" />
                    <span>Sharing Time</span>
                    <span className="text">{provider.workingTime}</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <FaRegStar className="text-3xl text-amber-500" />
                    <span>Activity Score</span>
                    <span className="text">{provider.activityScore}</span>
                </div>
                <button
                    onClick={() => setExpanded(expanded === provider.ip ? null : provider.ip)}
                    className="button">
                    {expanded === provider.ip ? "Hide" : "Details"}
                </button>
            </div>

            {expanded === provider.ip && (
                <div className="provider-stats rounded-lg flex flex-col">
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(provider.stats).map(([key, value]) => (
                            <div key={key} className="flex flex-col items-center">
                                <GaugeMeter value={value} label={key.toUpperCase()} />
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg text-xl"
                        onClick={() => alert(`Requesting from ${provider.ip}`)}>
                        Request Resources
                    </button>
                </div>
            )}
        </div>
    );
}
