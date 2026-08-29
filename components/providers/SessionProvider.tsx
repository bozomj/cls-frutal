import { ReactNode, useEffect, useState } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await fetch("/api/v1/sessions");
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();
  }, []);

  if (!sessionChecked) {
    return null;
  }

  return <>{children}</>;
}
