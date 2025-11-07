import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar"; // import SidebarTrigger
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { motion } from "framer-motion";
import { LogOut, Menu, Moon, Sun, User } from "lucide-react"; // Menu icon optional
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    // Perform logout logic here (clear token, call API, etc.)
    await logout(); // redirect to login page
  };
  const { theme, toggleTheme } = useThemeStore();
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className=" bg-white dark:bg-muted shadow-md px-6 py-4 flex justify-between items-center z-10"
    >
      <div className="flex items-center gap-4">
        {/* Sidebar Trigger Button */}
        <SidebarTrigger>
          <button className="p-2 rounded hover:bg-gray-200">
            <Menu className="w-5 h-5" />
          </button>
        </SidebarTrigger>

        {/* App title */}
        <div className="text-2xl font-bold light:text-gray-800">
          Admin Dashboard
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={toggleTheme}
          className="flex items-center gap-2"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4" /> Profile
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 dark:bg-red-500"
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>
    </motion.nav>
  );
}
