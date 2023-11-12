import React from "react";
import { gql, useMutation } from "@apollo/client";
import "./SignUp.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/slices/auth-slice";
import { useNavigate } from "react-router-dom";

const SIGN_UP = gql`
  mutation ($email: String!, $password: String!, $confirmPassword: String!) {
    signup(
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      statusCode
      message
    }
  }
`;

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState("");
  const [arePasswordEqual, setArePasswordEqual] = useState(true);
  const [addUser] = useMutation(SIGN_UP);

  function handleFormSubmit(e) {
    e.preventDefault();

    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);

    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setArePasswordEqual(false);
      return;
    }

    addUser({
      variables: {
        email,
        password,
        confirmPassword,
      },
    })
      .then((resp) => {
        console.log(resp);

        if (resp?.data?.signup?.statusCode !== 200) {
          setValidationErrors(resp.data.signup.message);
        } else {
          dispatch(authActions.setEmail(email));
          navigate("/categories");
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  function onChangeHandler() {
    setValidationErrors("");
    setArePasswordEqual(true);
  }

  return (
    <form onSubmit={handleFormSubmit} className="signup-form">
      <div className="signup-container">
        <div className="form-content">
          {validationErrors !== "" && (
            <p className="validation-error">{validationErrors}</p>
          )}
          <div className="signup-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={onChangeHandler}
            />
          </div>
          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              onChange={onChangeHandler}
            />
          </div>
          <div className="signup-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              onChange={onChangeHandler}
            />
            {!arePasswordEqual && (
              <p className="validation-error">Passwords not equal</p>
            )}
          </div>
          <div className="signup-btn-div">
            <button className="signup-button">SignUp</button>
          </div>
        </div>
      </div>
    </form>
  );
}
