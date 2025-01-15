import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "../header/header";
import styles from "./user-dashboard.module.scss";

interface TableSectionProps {
  title: string;
  data: Array<Record<string, any>>;
  tableType: string;
}

export const UserDashboard = () => {
  const navigate = useNavigate();
  const [gadgets, setGadgets] = useState<Array<Record<string, any>>>([]);
  const [reservations, setReservations] = useState<Array<Record<string, any>>>([]);
  const [borrowedGadgets, setBorrowedGadgets] = useState<Array<Record<string, any>>>([]);
  const [loadingGadgets, setLoadingGadgets] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [loadingBorrowed, setLoadingBorrowed] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication error! Please log in again.");
      navigate("/login");
      return;
    }

    const fetchGadgets = async () => {
      setLoadingGadgets(true);
      try {
        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/user",
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch gadgets. Status: ${response.status}`);
        }

        const data = await response.json();
        setGadgets(data);

        
        const borrowed = data.filter((gadget: any) => gadget.status === "BORROWED");
        setBorrowedGadgets(borrowed);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching gadgets:", error.message);
        } else {
          console.error("Error fetching gadgets:", error);
        }
        alert("Failed to load gadgets.");
      } finally {
        setLoadingGadgets(false);
      }
    };

    const fetchReservations = async () => {
      setLoadingReservations(true);
      try {
        const response = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/transactions/user/${userId}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch reservations. Status: ${response.status}`);
        }

        const data = await response.json();

        
        const reservationsWithNames = await Promise.all(
          data.map(async (reservation: any) => {
            const gadget = await fetchGadgetById(reservation.gadgetId, token);
            return {
              id: `Z${String(reservation.id).padStart(3, "0")}`,
              gadgetName: gadget?.gadgetName || "Unknown Gadget",
              startDate: reservation.startDate,
              endDate: reservation.endDate,
            };
          })
        );

        setReservations(reservationsWithNames);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        alert("Failed to load reservations.");
      } finally {
        setLoadingReservations(false);
      }
    };

    
    const fetchGadgetById = async (gadgetId: number, token: string) => {
      try {
        const response = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/all`,
          {
            method: "GET",
            mode: "cors",
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

    const fetchUserBorrowedGadgets = async (token: string) => {
      setLoadingBorrowed(true);
      try {
        
        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/user",
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user gadgets.");
        }

        const userGadgets = await response.json();
        console.log("✅ All User Gadgets:", userGadgets);

        
        const transactionsResponse = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/transactions/user/${userId}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!transactionsResponse.ok) {
          throw new Error("Failed to fetch transactions.");
        }

        const userTransactions = await transactionsResponse.json();
        console.log("✅ User Transactions:", userTransactions);

        
        const borrowedGadgets = userGadgets
          .filter((gadget: any) => gadget.status === "borrowed")
          .map((gadget: any) => {
            
            const matchingTransaction = userTransactions.find(
              (transaction: any) => transaction.gadgetId === gadget.id
            );

            return {
              id: `Y${String(gadget.id).padStart(3, "0")}`,
              gadgetName: gadget.gadgetName || "Neznámy gadget",
              
              startDate: matchingTransaction
                ? matchingTransaction.startDate
                : null,
              endDate: matchingTransaction
                ? matchingTransaction.endDate
                : null,
            };
          });

        console.log("✅ Filtered Borrowed Gadgets:", borrowedGadgets);

        
        setBorrowedGadgets(borrowedGadgets);
      } catch (error) {
        console.error("❌ Error fetching borrowed gadgets:", error);
      } finally {
        setLoadingBorrowed(false);
      }
    };

    fetchGadgets();
    fetchReservations();
    fetchUserBorrowedGadgets(token);
  }, [navigate, userId]);

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <h2>{gadgets.length}</h2>
          <p>Kusov Vybavenia</p>
        </div>
        <div className={styles.stat}>
          <h2>{reservations.length}</h2>
          <p>Požičané Veci</p>
        </div>
        <div className={styles.stat}>
          <h2>{borrowedGadgets.length}</h2>
          <p>Rezervácie na Gadgety</p>
        </div>
      </div>
      <div className={styles.tables}>
        {loadingGadgets ? (
          <p>Loading gadgets data...</p>
        ) : (
          <TableSection title="Zoznam Vybavenia" data={gadgets} tableType="equipment" />
        )}
        {loadingReservations ? (
          <p>Loading reservations data...</p>
        ) : (
          <TableSection title="Požičané Veci" data={reservations} tableType="reservations" />
        )}
        {loadingBorrowed ? (
          <p>Loading gadget reservations...</p>
        ) : (
          <TableSection title="Rezervácie Gadgetov" data={borrowedGadgets} tableType="borrowed" />
        )}
      </div>
    </div>
  );

  function TableSection({ title, data, tableType }: TableSectionProps) {
    return (
      <section className={styles.tableSection}>
        <h3>{title}</h3>
        <div className={styles.scrollableTable}>
          <table>
            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      {tableType === "equipment"
                        ? `K${String(row.id).padStart(3, "0")}`
                        : row.id}
                    </td>

                    <td>{row.gadgetName || row.name || "Neznámy názov"}</td>

                    <td>
                      {row.startDate &&
                       row.endDate &&
                       !isNaN(new Date(row.startDate).getTime()) &&
                       !isNaN(new Date(row.endDate).getTime()) ? (
                        <>
                          {new Date(row.startDate).toLocaleDateString("sk-SK")}
                          {" - "}
                          {new Date(row.endDate).toLocaleDateString("sk-SK")}
                        </>
                      ) : (
                        <span
                          className={`${styles.statusDot} ${
                            row.status === "available" ? styles.green : styles.yellow
                          }`}
                        ></span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button
          className={styles.showMore}
          onClick={() => navigate(`/show-more/${tableType}`)}
        >
          + Zobraziť Viac
        </button>
      </section>
    );
  }
};