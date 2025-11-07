import { useAuthStore } from "@/store/authStore";
import AuthForm from "@/components/AuthForm";

const LoginPage = () => {
  const login = useAuthStore((state) => state.login);

  const handleLogin = async ({
    email,
    password,
    remember,
  }: {
    email: string;
    password?: string;
    remember?: boolean;
  }) => {
    if (!password) throw new Error("Password is required");
    await login(email, password, remember as boolean);
  };

  return <AuthForm mode="login" onSubmit={handleLogin} />;
};

export default LoginPage;
