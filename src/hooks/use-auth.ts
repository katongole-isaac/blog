import { useEffect, useState } from "react";
import config from "@/config/default.json";

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(config.checkAuthenticated)
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(data.isAuthenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return isAuthenticated;
}

export default useAuth;
