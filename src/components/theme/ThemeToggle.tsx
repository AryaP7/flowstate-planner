
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useLocalStorage<"dark" | "light" | "system">("theme", "system");
  
  // Effect to apply theme on client-side only
  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.remove("dark", "light");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("dark", "light");
      root.classList.add(theme);
    }
  }, [theme]);

  if (!mounted) return null;

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="bg-transparent border-0" 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-all" />
      ) : (
        <Moon className="h-5 w-5 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
