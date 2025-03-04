import React, { useState } from "react";
import { AuthCard } from "../../components/card/card.jsx";

export const AuthPage = ({login}) =>{
    const [isLogin, setIsLogin] = useState(login);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div 
      className="relative h-screen bg-cover bg-center overflow-hidden flex flex-col justify-center items-center  p-10"
      style={{ backgroundImage: "url('/signup-in.png')" }}
    >
        <AuthCard 
        isLogin={isLogin} 
        setIsLogin={setIsLogin}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword = {confirmPassword}
        setConfirmPassword = {setConfirmPassword}
        />
        </div>
    );
}