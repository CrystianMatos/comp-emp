import { useState } from "react";

export function useAuthModal() {
  const [open, setOpen] = useState(false);

  function requireAuth(action: () => void) {
    const token = localStorage.getItem("token");
    if (!token) {
      setOpen(true);
      return;
    }
    action();
  }

  return { open, setOpen, requireAuth };
}
