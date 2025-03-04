import React from "react";
import "./HeroSection.css";
import {getStarted} from "./HeroSection.js";

export const HeroSection = ({active,setActive}) => {
   
    return (
        <div 
        id="Home"
            className="hero-section flex flex-col justify-center items-start text-left"
        >
            <div className="black-screen absolute inset-0 bg-black opacity-40 -z-1">
            </div>
            <img src="/Laptop-unsplash.jpg" alt="" className="absolute -z-5"/>
            <div className="hero-section-container flex flex-col justify-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white">Your computer can do more.</h1>
                <p className="text-lg md:text-2xl text-gray-300">Share its power or borrow from others</p>
                <a href="#dashboard" className="button" onClick={()=>setActive("Dashboard")}>Get Started</a>
            </div>
        </div>
    );
};