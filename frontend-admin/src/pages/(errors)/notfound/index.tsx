import React from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button"; // Optional: if you have a Button component

export const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl">
          Oops! The page you are looking for does not exist.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2"
          >
            <Home size={18} /> Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
