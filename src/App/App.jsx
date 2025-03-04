import React,{useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Homepage } from '../pages/Homepage/Homepage.jsx'
import { AuthPage } from "../pages/Authpage/Authpage.jsx";
import { Profilepage } from "../pages/profilepage/profilepage.jsx";
import { ProvidersList } from "../pages/ProvidersList/ProvidersList.jsx";
import { LogsTable} from "../pages/Logspage/Logspage.jsx";
import "./App.css";

export function App() {
  const [active, setActive] = useState("Home");
  const navItems = ["Home", "Dashboard", "Logs", "Profile", "About"]
  const href = ["/", "/#dashboard", "/logs", "/profile", "/#"];
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Homepage
            active={active}
            setActive={setActive}
            navItems={navItems}
            href={href}
          />} />
        <Route path="/login" element={<AuthPage login={true} />} />
        <Route path="/signup" element={<AuthPage login={false} />} />
        <Route path="/profile" element={
          <Profilepage
            active={active}
            setActive={setActive}
            navItems={navItems}
            href={href}
          />} />
        <Route path="/providers" element={
          <ProvidersList
            active={active}
            setActive={setActive}
            navItems={navItems}
            href={href}
          />} />
          <Route path="/logs" element={
            <LogsTable/>
          }></Route>
      </Routes>
    </Router>
  );
}