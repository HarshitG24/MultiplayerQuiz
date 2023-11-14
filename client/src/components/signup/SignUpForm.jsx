import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/slices/auth-slice";
import Card from "../../ui/Card";
import PageHeader from "../../ui/PageHeader/PageHeader";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import Error from "../error/Error";
import { SIGN_UP } from "./mutation.js";
import "./SignUpForm.css";

export default function SignUpForm() {
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
    <Card onSubmit={handleFormSubmit}>
      <div className="signup-container">
        {validationErrors !== "" && <Error>{validationErrors}</Error>}
        <div className="signup-header">
          <PageHeader>Create Account</PageHeader>
          <p>We just need a few details</p>
        </div>
        <div className="input-container">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={onChangeHandler}
            required
          />
        </div>
        <div className="input-container">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onChangeHandler}
            required
            minLength={6}
          />
        </div>
        <div className="input-container">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={onChangeHandler}
            required
            minLength={6}
          />
          {!arePasswordEqual && (
            <p className="validation-error">Passwords not equal</p>
          )}
        </div>
        <div className="signup-option">
          <div>
            <PrimaryButton type="primary">Sign Up</PrimaryButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
