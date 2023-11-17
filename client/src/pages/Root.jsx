import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Outlet, redirect, useSubmit } from "react-router-dom";
import { getJWT, getTokenDuration } from "../util/auth";

export const AUTHENTICATE = gql`
  mutation ($token: String!) {
    verifyJWT(token: $token) {
      statusCode
      message
    }
  }
`;

export default function Root() {
  const token = getJWT();
  const submit = useSubmit();
  const [authUser] = useMutation(AUTHENTICATE);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
      return;
    }

    const tokenDuration = getTokenDuration();

    authUser({
      variables: { token },
    }).then((resp) => {
      if (resp?.data?.verifyJWT?.statusCode === 400) {
        return redirect("/");
      }
    });

    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);

  return (
    <>
      <Outlet />
    </>
  );
}
