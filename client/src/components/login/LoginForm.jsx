import Card from "../../ui/Card";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import "./LoginForm.css";
import GoogleLogin from "./GoogleLogin";
import { authActions } from "../../store/slices/auth-slice.js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "./mutation.js";
import Error from "../error/Error";
import PageHeader from "../../ui/PageHeader/PageHeader";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addUser] = useMutation(LOGIN);
  const [validationErrors, setValidationErrors] = useState("");

  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

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
          console.log("reached here, ", data);
          dispatch(authActions.setEmail(email));
          navigate("categories");
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  function onSignUpHandler(e) {
    e.preventDefault();
    navigate("signup");
  }

  return (
    <>
      <Card onSubmit={handleSubmit}>
        <div id="login-form">
          <div className="login-image">
            <img
              src="https://img.freepik.com/premium-vector/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.jpg"
              alt="This is an illustration for login"
              className="login-image"
            />
          </div>
          <div className="form-control">
            <div className="title">
              <PageHeader>QuizScript</PageHeader>
            </div>
            {validationErrors !== "" && <Error>{validationErrors}</Error>}
            <div>
              <div>
                <input
                  className="form-imput"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onBlur={onFieldChange}
                  onChange={onChangeHandler}
                  required
                />
                {isEmailInvalid && (
                  <p style={{ fontSize: "1rem" }}>Please enter valid email</p>
                )}
              </div>
              <div>
                <input
                  className="form-imput"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  minLength={6}
                />
              </div>
              <div className="login-options">
                <GoogleLogin />
                <PrimaryButton type="primary">Login</PrimaryButton>
              </div>
            </div>
            <div className="sign-up" onClick={onSignUpHandler}>
              <label>Dont have an account?</label>
              <button type="button">SignUp</button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
