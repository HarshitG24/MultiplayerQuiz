import React from "react";
import "./Login.css";
import LoginCard from "./LoginCard";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Login() {
  return (
    <div className="container">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_API_KEY}>
        <LoginCard />
      </GoogleOAuthProvider>
    </div>
  );
}
