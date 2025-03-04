import React,{useState} from "react";
import { Header } from "../../components/Header/Header.jsx";
import { HeroSection } from "../../components/HeroSection/HeroSection.jsx";
import { Dashboard } from "../../components/Dashboard/Dashboard.jsx";
export function Homepage({
    active,
    setActive,
    navItems,
    href,
    token
}){
    return (
        <div>
        <Header active={active} setActive={setActive} navItems={navItems} href={href}/>
        <HeroSection active={active} setActive={setActive}/>
        <Dashboard token = {token} active={active} setActive={setActive}/>
        </div>
    );
} 