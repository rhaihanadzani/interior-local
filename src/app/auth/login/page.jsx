import AuthForm from "@/components/slug/Auth/LoginForm";
export const metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return <AuthForm type="login" />;
}
