import React, { useState } from "react";
import "./Settings.css"
export function Settings() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("uday62874@gmail.com");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    return (
        <div className="profile-settings shadow-xl rounded-2xl">
            <h1 className="text">Profile Settings</h1>
            <div >
                <input
                    id="Name"
                    name="Name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
            </div>
            <div className="text-2xl p-4 bg-gray-100" id="email">
                    {email}
            </div>
            <div >
                <input
                    id="current-password"
                    name="current-password"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e)=>setCurrentPassword(e.target.value)}
                />
            </div>
            <div >
                <input
                    id="new-password"
                    name="new-password"
                    type="text"
                    autoComplete="given-name"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)}
                />
            </div>
            <div >
                <input
                    id="confirm-password"
                    name="confirm-password"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="button-container flex ">
            <a href="" className="button save"> <span className="text-xl">Update Your Account</span></a>
            <a href="" className="button delete"> <span className="text-xl">Delete Your Account</span></a>
            </div>
        </div>
    );
}