import React from "react";
import "./card.css"
export const AuthCard = (
  {isLogin, 
   setIsLogin,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    login,
    signup
})=>{
    return (
        <div className="authcard bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Access Account" : "Create Account"}
        </h2>
        <p className="text-gray-500 mb-6">
          {isLogin ? "Access your account to share and manage resources" : "Sign up to start sharing and managing resources"}
        </p>
        <form className="space-y-4" >
          {!isLogin && (
            <div className="relative">
              <input type="text" placeholder="Your name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={name} onChange={(e)=>{setName(e.target.value)}}/>
            </div>
          )}
          <div className="relative">
            <input type="email" placeholder="Your email address" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
          </div>
          <div className="relative">
            <input type="password" placeholder="Enter your password" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
          </div>
          {!isLogin && (
            <div className="relative">
              <input type="password" placeholder="Confirm your password" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value ={confirmPassword} onChange={setConfirmPassword(e.target.value)}/>
            </div>
          )}
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600" onClick={()=>{isLogin?login(email,password):signup(name,email,password)}}>
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4">
          {isLogin ? "Need to create an account? " : "Already have an account? "}
          <span className="text-blue-500 cursor-pointer">{isLogin ? <a href="/signup">Sign Up</a> :<a href="/login">Log in</a> }</span>
        </p>
      </div>
      );
    };