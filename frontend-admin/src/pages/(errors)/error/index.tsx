import { Button } from "@/components/ui/button";
import { AlertCircle, Rotate3D } from "lucide-react";
import React from "react";

interface ErrorPageProps {
  status?: number; // e.g., 500, 403
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  status = 500,
  message = "Something went wrong!",
}) => {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="text-center space-y-4">
        <AlertCircle className="mx-auto w-16 h-16 text-destructive" />
        <h1 className="text-6xl font-bold">{status}</h1>
        <p className="text-xl">{message}</p>
        <Button
          onClick={() => window.location.reload()} // reloads the current page
          className="flex items-center gap-2 w-fit mx-auto"
        >
          <Rotate3D size={18} /> Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
