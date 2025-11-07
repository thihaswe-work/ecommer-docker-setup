import { useError } from "@/context/errorContext";
import ErrorPage from "@/pages/(errors)/error";

const GlobalErrorHandler = () => {
  const { error } = useError();

  if (!error) return null; // no error, render nothing

  return <ErrorPage status={error.status} message={error.message} />;
};

export default GlobalErrorHandler;
