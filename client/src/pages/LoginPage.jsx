import LoginForm from "../components/login/LoginForm";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function LoginPage() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_API_KEY}>
        <LoginForm />
      </GoogleOAuthProvider>
    </>
  );
}
