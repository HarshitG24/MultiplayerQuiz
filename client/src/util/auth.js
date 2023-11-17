import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export function setJWT(token) {
  localStorage.setItem("token", token);
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);

  localStorage.setItem("expiration", expiry.toISOString());
}

export function getTokenDuration() {
  const storedExpirations = localStorage.getItem("expiration");
  const expiryDate = new Date(storedExpirations);
  const now = new Date();
  const duration = expiryDate.getTime() - now.getTime();

  return duration;
}

export function getJWT() {
  const token = localStorage.getItem("token");

  if (!token) return;

  const tokenduration = getTokenDuration();

  if (tokenduration < 0) {
    return "EXPIRED";
  }
  return token;
}
