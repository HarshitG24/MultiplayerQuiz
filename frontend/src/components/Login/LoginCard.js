import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginCard.css";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/slices/auth-slice";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      statusCode
      message
    }
  }
`;

const SIGN_UP_GOOGLE = gql`
  mutation ($accessToken: String!) {
    signUpGoogle(accessToken: $accessToken) {
      accessToken
      refreshToken
      email
    }
  }
`;

function LoginCard() {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(null);

  // const [user, setUser] = useState({ email: "", password: "" });
  const [addUser] = useMutation(LOGIN);
  const navigate = useNavigate();
  const [signUpGoogle] = useMutation(SIGN_UP_GOOGLE);
  const [validationErrors, setValidationErrors] = useState("");

  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  useEffect(() => {
    if (accessToken) {
      signUpGoogle({ variables: { accessToken } }).then((res) => {
        const { data } = res;
        if (data.signUpGoogle.email !== "") {
          dispatch(authActions.setEmail(data.signUpGoogle.email));
          navigate("/categories");
        }
      });
    }
  }, [accessToken, dispatch, navigate, signUpGoogle]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (response) => {
      setAccessToken(response.access_token);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function onFieldChange(event) {
    const enteredEmail = event.target.value;

    const emailInvalid = enteredEmail !== "" && !enteredEmail.includes("@");
    setIsEmailInvalid(emailInvalid);
  }

  function onChangeHandler() {
    setIsEmailInvalid(false);
    setValidationErrors("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const { email, password } = data;

    addUser({
      variables: { email, password },
    })
      .then((res) => {
        if (res?.data?.login?.statusCode !== 200) {
          setValidationErrors(res.data.login.message);
        } else {
          dispatch(authActions.setEmail(email));
          navigate("/categories");
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  function onSignUpHandler(e) {
    e.preventDefault();
    navigate("/signup");
  }

  return (
    <form className="card-container" onSubmit={handleSubmit}>
      <div className="login-image">
        <img
          src="https://img.freepik.com/premium-vector/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.jpg"
          alt="This is an illustration for login"
          className="login-illustration"
        />
      </div>
      <div className="login-form">
        <p className="title">QuizScript</p>
        {validationErrors !== "" && (
          <p style={{ fontSize: "1rem" }}>{validationErrors}</p>
        )}
        <div>
          <div>
            <input
              type="email"
              className="login-input"
              name="email"
              placeholder="Username"
              onBlur={onFieldChange}
              onChange={onChangeHandler}
              required
            />
            {isEmailInvalid && (
              <p style={{ fontSize: "1rem" }}>Please enter valid email</p>
            )}
          </div>
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            name="password"
            onChange={onChangeHandler}
            required
            minLength={6}
          />
          <div id="login">
            <button className="login-btn">Login</button>
          </div>
        </div>
        <div className="google-sign-in" onClick={handleGoogleLogin}>
          <div id="google-login">
            <div id="google-login">
              <FcGoogle />
              <span>Login</span>
            </div>
          </div>
        </div>

        <div id="signup" onClick={onSignUpHandler}>
          <span>Don't have an account?</span>
          <button>Sign Up</button>
        </div>
      </div>
    </form>
  );
}

export default LoginCard;
