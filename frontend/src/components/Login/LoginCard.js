import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginCard.css";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/slices/auth-slice";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      statusCode
      message
    }
  }
`;

function LoginCard() {
  const dispatch = useDispatch();

  const [user, setUser] = useState({ email: "", password: "" });
  const [addUser] = useMutation(LOGIN);
  const navigate = useNavigate();

  function handleInputChange(event, key) {
    setUser((user) => {
      return {
        ...user,
        [key]: event?.target?.value || "",
      };
    });
  }

  function onSubmitHandler(event) {
    event.preventDefault();

    const { email, password } = user;

    addUser({
      variables: { email, password },
    })
      .then(() => {
        dispatch(authActions.setEmail(email));
        navigate("/categories");
      })
      .catch((err) => {
        throw err;
      });
  }

  return (
    <div className="card-container">
      <div className="login-image">
        <div>
          <img
            src="https://img.freepik.com/premium-vector/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.jpg"
            alt="This is an illustration for login"
            className="login-illustration"
          />
        </div>
      </div>
      <div className="login-form">
        <p className="title">QuizScript</p>
        <form>
          <input
            type="email"
            className="login-input"
            placeholder="Username"
            value={user.email}
            onChange={(event) => handleInputChange(event, "email")}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={user.password}
            onChange={(event) => handleInputChange(event, "password")}
          />
          <div className="login-btn">
            <button type="submit" onClick={onSubmitHandler}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginCard;
