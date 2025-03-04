import React from "react";
import { ImPower } from "react-icons/im"
import { MdGetApp } from "react-icons/md";
import { VscVmActive } from "react-icons/vsc";
import { FaHourglassStart, FaRegStar } from "react-icons/fa";
import "./Profile.css";

export const Profile = () => {
    return (
        <div className="profile-page">
        <div className="flex flex-col justify-center items-center ">
            <img src="/logo.svg" alt="" height={100}/>
        </div>
        <div className="profile ">
            <div className="flex justify-evenly items-center gap-10">
                <div className="flex flex-col justify-center items-center">
                    <ImPower className="text-3xl text-cyan-500" />
                    <span>Power Shared</span>
                    <span className="text">99</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <MdGetApp className="text-3xl text-emerald-500" />
                    <span>Power Used</span>
                    <span className="text">99</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <VscVmActive className="text-3xl text-orange-700" />
                    <span>Active Time</span>
                    <span className="text">99</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <FaHourglassStart className="text-3xl text-indigo-700" />
                    <span>Sharing Time</span>
                    <span className="text">99</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <FaRegStar className="text-3xl text-amber-500" />
                    <span>Activity Score</span>
                    <span className="text">99</span>
                </div>
            </div>
        </div>
        </div>
    );
}