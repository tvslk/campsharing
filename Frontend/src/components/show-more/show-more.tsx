

import { useEffect, useState } from "react";
import { ShowMoreAdmin } from "../show-more-admin/show-more-admin";
import { ShowMoreUser } from "../show-more-user/show-more-user";


export const ShowMorePage = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  if (!role) {
    return <p>Načítavam údaje o role...</p>;
  }

  return role === "admin" ? <ShowMoreAdmin /> : <ShowMoreUser />;
};