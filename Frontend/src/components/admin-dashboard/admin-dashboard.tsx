import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "../header/header";
import styles from "./admin-dashboard.module.scss";

interface TableSectionProps {
  title: string;
  data: Array<Record<string, any>>;
  tableType: string;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [gadgets, setGadgets] = useState<Array<Record<string, any>>>([]);
  const [transactions, setTransactions] = useState<Array<Record<string, any>>>([]);
  const [users, setUsers] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchGadgets = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/all",
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
          throw new Error("Failed to fetch gadgets");
        }

        const data = await response.json();
        const transformedData = data.map((gadget: any) => ({
          id: `K${String(gadget.id).padStart(3, "0")}`,
          gadgetName: gadget.gadgetName,
          status: gadget.status === "AVAILABLE" ? "Dostupné" : "Nedostupné"
        }));

        setGadgets(transformedData);
      } catch (error) {
        console.error("Error fetching gadgets:", error);
        alert(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/transactions/all",
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
          throw new Error(`Failed to fetch transactions: ${response.status}`);
        }

        const data = await response.json();
        const transformedTransactions = data.map((transaction: any) => ({
          id: `T${String(transaction.id).padStart(3, "0")}`,
          gadgetName: transaction.gadgetName,
          userId: transaction.userId,
          startDate: formatDate(transaction.startDate),
          endDate: formatDate(transaction.endDate)
        }));

        setTransactions(transformedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert(`Error: ${error}`);
      } finally {
        setLoadingTransactions(false);
      }
    };

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/user/all",
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
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        const transformedUsers = data.map((user: any) => ({
          id: `U${String(user.id).padStart(3, "0")}`,
          name: user.name,
          email: user.email,
          username: user.username || "N/A"
       }));

        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert(`Error: ${error}`);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchGadgets();
    fetchTransactions();
    fetchUsers();
  }, []);

  
  const getUserNameById = (userId: string) => {
    const user = users.find(user => `U${String(user.id).padStart(3, "0")}` === userId);
    return user ? user.name : "Unknown User";
  };

  
  const formatDate = (date: string) => {
    if (!date) return "N/A";
    const formattedDate = new Date(date);
    return `${formattedDate.getDate()}.${formattedDate.getMonth() + 1}.${formattedDate.getFullYear()}`;
  };

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <h2>{gadgets.length}</h2>
          <p>Kusov vybavenia</p>
        </div>
        <div className={styles.stat}>
          <h2>{transactions.length}</h2>
          <p>Aktívne prenájmy</p>
        </div>
        <div className={styles.stat}>
          <h2>{users.length}</h2>
          <p>Registrovaných užívateľov</p>
        </div>
      </div>
      <div className={styles.tables}>
        {loading ? (
          <p>Loading gadgets data...</p>
        ) : (
          <TableSection title="Zoznam Vybavenia" data={gadgets} tableType="equipment" />
        )}
        {loadingTransactions ? (
          <p>Loading transactions data...</p>
        ) : (
          <TableSection
            title="Aktuálne Rezervácie"
            data={transactions.map(transaction => ({
              ...transaction,
              user: getUserNameById(transaction.userId)
            }))}
            tableType="reservations"
          />
        )}
        {loadingUsers ? (
          <p>Loading users data...</p>
        ) : (
          <TableSection title="Zoznam Užívateľov" data={users} tableType="users" />
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
                    <td>{row.id}</td>
                    <td>{tableType === "users" ? row.name : row.gadgetName}</td>
                    {tableType === "reservations" ? (
                      <>
                        <td>{row.user}</td>
                        <td>{row.startDate} - {row.endDate}</td>
                      </>
                    ) : tableType === "users" ? (
                      <>
                        <td>{row.username}</td>
                        <td>{row.email}</td>
                      </>
                    ) : (
                      <td>
                        <span
                          className={`${styles.statusDot} ${
                            row.status === "available" ? styles.green : styles.yellow
                          }`}
                        ></span>
                      </td>
                    )}
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
        <button className={styles.showMore} onClick={() => navigate(`/show-more/${tableType}`)}>
          + Zobraziť Viac
        </button>
      </section>
    );
  }
};