// ResetPage.tsx
import AuthForm from "@/components/AuthForm";
import { useAuthStore } from "@/store/authStore";

const ResetPasswordPage = () => {
  const reset = useAuthStore((state) => state.resetPassword);

  const handleReset = async ({ email }: { email: string }) => {
    await reset(email);
  };

  return <AuthForm mode="reset" onSubmit={handleReset} />;
};

export default ResetPasswordPage;
