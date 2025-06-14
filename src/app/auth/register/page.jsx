import AuthForm from "@/components/slug/Auth/LoginForm";
export const metadata = {
  title: "Register",
  description: "Sign up to your account",
};

export default function LoginPage() {
  return <AuthForm type="register" />;
}
