

import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../header/header";
import styles from "./show-more-user.module.scss";
import { useState, useEffect } from "react";

export const ShowMoreUser = () => {
  const { tableType } = useParams<{ tableType: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Nie ste prihlásený.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        let endpoint = "";
        let rawData: any[] = [];

        if (tableType === "equipment") {
          
          endpoint = `/api/gadgets/user`;
          const response = await fetch(
            `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net${endpoint}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Nepodarilo sa načítať gadgets.");
          }
          rawData = await response.json();
        } else if (tableType === "reservations") {
          
          endpoint = `/api/transactions/user/${userId}`;
          const response = await fetch(
            `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net${endpoint}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Nepodarilo sa načítať rezervácie.");
          }
          const reservations = await response.json();

          
          const reservationsWithNames = await Promise.all(
            reservations.map(async (reservation: any) => {
              const gadget = await fetchGadgetById(reservation.gadgetId, token);
              return {
                id: `Z${String(reservation.id).padStart(3, "0")}`,
                gadgetName: gadget?.gadgetName || "Neznámy Gadget",
                startDate: reservation.startDate,
                endDate: reservation.endDate,
              };
            })
          );
          rawData = reservationsWithNames;
        } else if (tableType === "borrowed") {
          
          endpoint = `/api/gadgets/user`;
          const response = await fetch(
            `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net${endpoint}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Nepodarilo sa načítať gadgets používateľa.");
          }
          const userGadgets = await response.json();

          
          const borrowedGadgets = userGadgets.filter(
            (g: any) => g.status === "BORROWED" || g.status === "borrowed"
          );

          rawData = borrowedGadgets.map((gadget: any) => ({
            id: `Y${String(gadget.id).padStart(3, "0")}`,
            gadgetName: gadget.gadgetName,
            status: gadget.status,
          }));
        } else {
          console.error("Neznámy tableType:", tableType);
          return;
        }

        setData(rawData);
      } catch (error) {
        console.error("Chyba pri načítaní dát:", error);
        alert("Nepodarilo sa načítať dáta.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableType, navigate, token, userId]);

  
  const fetchGadgetById = async (gadgetId: number, token: string) => {
    try {
      const response = await fetch(
        `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch gadget by ID");
      const gadgetsData = await response.json();
      return gadgetsData.find((g: any) => g.id === gadgetId);
    } catch (error) {
      console.error("Error fetching gadget by ID:", error);
      return null;
    }
  };

  
  const translateKey = (key: string) => {
    const translations: { [key: string]: string } = {
      id: "ID",
      gadgetName: "Názov",
      status: "Stav",
          pricePerDay: "Cena za deň",
          width: "Šírka",
          height: "Výška",
          length: "Dĺžka",
          weight: "Hmotnosť",
          material: "Materiál",
          userEmail: "Majiteľ",
          startDate: "Dátum začiatku",
            endDate: "Dátum konca",
            userId: "Používateľ",
            gadgetId: "Gadget",

      
    };
    return translations[key] || key;
  };

  
  const filteredKeys = (row: any) =>
    Object.keys(row).filter(
      (key) =>
        !["gadgetDescription", "availableFrom", "availableTo"].includes(key)
    );

  
  const handleEdit = (id: number | string) => {
    if (tableType === "equipment") {
      navigate(`/edit-gadget/${id}`);
    }
  };

  
  const handleRemove = async (id: number | string) => {
    if (!token) {
      alert("Nie ste prihlásený.");
      return;
    }

    if (tableType !== "equipment") {
      
      return;
    }

    try {
      const response = await fetch(
        `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nepodarilo sa vymazať záznam.");
      }

      alert("Záznam bol úspešne vymazaný!");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Chyba pri odstraňovaní záznamu.");
      console.error("Chyba pri odstraňovaní:", error);
    }
  };

  
  const showActions = tableType === "equipment";

  return (
    <div className={styles.showMorePage}>
      <Header />
      <h2 style={{ fontFamily: "Merge One", color: "#77726a" }}>
        {tableType === "equipment"
          ? "Vybavenie"
          : tableType === "reservations"
          ? "Rezervácie"
          : tableType === "borrowed"
          ? "Požičané Gadgety"
          : "Detailné Zobrazenie"}
      </h2>

      {loading ? (
        <p>Načítavam dáta...</p>
      ) : (
        <div className={styles.bigTableContainer}>
          <table>
            <thead>
              <tr>
                {data.length > 0 &&
                  filteredKeys(data[0]).map((key) => (
                    <th key={key} style={{ fontFamily: "Merge One", color: "#77726a" }}>
                      {translateKey(key)}
                    </th>
                  ))}
                {showActions && (
                  <th style={{ fontFamily: "Merge One", color: "#77726a" }}>Akcie</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id}>
                    {filteredKeys(row).map((key) => (
                      <td key={key}>
                        {key === "status" ? (
                          <span
                            className={`${styles.statusDot} ${
                              row[key] === "available" || row[key] === "AVAILABLE"
                                ? styles.green
                                : styles.yellow
                            }`}
                          ></span>
                        ) : key === "startDate" || key === "endDate" ? (
                          new Date(row[key]).toLocaleDateString("sk-SK")
                        ) : (
                          String(row[key])
                        )}
                      </td>
                    ))}

                    {showActions && (
                      <td>
                        <div className={styles.actionButtons}>
                          <button className="edit" onClick={() => handleEdit(row.id)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#787269"
                              width="16"
                              height="16"
                            >
                              <path d="M3 21v-2.586l11.293-11.293 2.586 2.586L5.586 21H3zm19.707-17.707l-2-2a1 1 0 0 0-1.414 0l-2.586 2.586 2.586 2.586 2-2a1 1 0 0 0 0-1.414z"></path>
                            </svg>
                          </button>

                          <button className="remove" onClick={() => handleRemove(row.id)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#787269"
                              width="16"
                              height="16"
                            >
                              <path d="M5 7h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7zm9-4v1H9V3h5zM8 1h8a1 1 0 0 1 1 1v1h5a1 1 0 0 1 1 1v1H1V4a1 1 0 0 1 1-1h5V2a1 1 0 0 1 1-1z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showActions ? 6 : 5}>Žiadne dáta k zobrazeniu.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};