// RegisterPage.tsx
import AuthForm from "@/components/AuthForm";
import { useAuthStore } from "@/store/authStore";

const RegisterPage = () => {
  const register = useAuthStore((state) => state.register);

  const handleRegister = async ({
    email,
    password,
    confirmPassword,
  }: {
    email: string;
    password?: string;
    confirmPassword?: string;
  }) => {
    if (!password) throw new Error("Password is required");
    if (!confirmPassword) throw new Error("Confirm Password is required");
    await register(email, password, confirmPassword);
  };

  return <AuthForm mode="register" onSubmit={handleRegister} />;
};

export default RegisterPage;
