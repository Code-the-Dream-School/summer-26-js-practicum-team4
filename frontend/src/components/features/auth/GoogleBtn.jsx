import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../../services/authService";
import { useAuth } from "../../../state/auth/useAuth";
import { useNavigate } from "react-router-dom";

function GoogleBtn() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  async function handleGoogle(googleToken) {
    try {
      dispatch({ type: "SET_LOADING" });
      const response = await googleAuth(googleToken);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.user,
      });
      navigate("/generate");
    } catch (error) {
      console.error("Error during Google authentication:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }
  return (
    <div className="flex w-full justify-center">
      <GoogleLogin
        text="continue_with"
        size="large"
        width={304}

        onSuccess={(credentialResponse) => {
          handleGoogle(credentialResponse.credential);
        }}
        onError={() => {
          dispatch({
            type: "SET_ERROR",
            payload: "Google authentication failed",
          });
        }}
      />{" "}
    </div>
  );
}

export default GoogleBtn;
