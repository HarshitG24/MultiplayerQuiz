import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/slices/auth-slice";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { SIGN_UP_GOOGLE } from "./mutation.js";
import { useMutation } from "@apollo/client";
import { setJWT } from "../../util/auth";

export default function GoogleLogin() {
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const [signUpGoogle] = useMutation(SIGN_UP_GOOGLE);

  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    if (accessToken) {
      signUpGoogle({ variables: { accessToken } }).then((res) => {
        const { data } = res;
        if (data.signUpGoogle.email !== "") {
          setJWT(data.signUpGoogle.accessToken);
          dispatch(authActions.setEmail(data.signUpGoogle.email));
          naviagte("categories");
        }
      });
    }
  }, [accessToken, dispatch, signUpGoogle, naviagte]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (response) => {
      setAccessToken(response.access_token);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <>
      {" "}
      <PrimaryButton type="secondary" onClick={handleGoogleLogin}>
        <FcGoogle />
        <span>Login</span>
      </PrimaryButton>
    </>
  );
}
