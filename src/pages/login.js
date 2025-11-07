import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      console.log("Signed in:", response.account.username);
      navigate("/dashboard"); // ✅ 登录成功后跳转
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to My App</h1>
        <p>Please sign in using Azure AD</p>
        <button className="login-button" onClick={handleLogin}>
          Sign in with Azure AD
        </button>
      </div>
    </div>
  );
}

export default Login;
