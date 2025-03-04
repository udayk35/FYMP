import React,{useState, useEffect} from "react";
import { Header } from "../../components/Header/Header.jsx";
import { GaugeMeter } from "../../components/GaugeMeter/GaugeMeter.jsx";
import { Provider } from "../../components/Provider/Provider.jsx";
import { providers } from "./ProvidersList.js";
import "./ProvidersList.css";

export const ProvidersList = ({
    active,
    setActive,
    navItems,
    href,
    token
})=>{
    const [providersList, setProvidersList] = useState(providers);
    const [expanded, setExpanded] = useState(null);
    useEffect(() => {
        setActive(navItems[1]);
      }, []);
  return (
    <>
    <Header active={active} setActive={setActive} navItems={navItems} href={href}/>
    <div className="providers-listflex flex-col justify-center items-center">
      {providers.map((provider) => (
          <Provider provider={provider}/>
        ))}
    </div>
    </>
  );
}