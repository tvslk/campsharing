

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../header/header";
import styles from "./edit-reservation.module.scss";
import { ButtonComponent } from "../button-component/button-component";
import { DayPicker } from "../day-picker/day-picker";

export const EditReservation = () => {
  const navigate = useNavigate();

  
  const { resId } = useParams<{ resId: string }>(); 
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  
  const [reservationTitle, setReservationTitle] = useState("Rezervácia");
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);

  

  useEffect(() => {
    if (!resId) {
      console.warn("Nemáme param 'resId' v URL.");
      return;
    }

    
    
    let endpoint = "";
    if (role === "admin") {
      endpoint = "/api/transactions/all";
    } else {
      if (!userId) {
        console.warn("Nemáme userId v localStorage, user nemôže fetchnúť transakcie.");
        return;
      }
      endpoint = `/api/transactions/user/${userId}`;
    }

    const fetchTransactions = async () => {
      try {
        console.log(`⏳ Fetchujem transakcie z endpointu: ${endpoint} (role=${role})`);
        const response = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net${endpoint}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              
               Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Chyba pri fetchi transakcií: ${response.status}`);
        }

        
        const transactions = await response.json();
        console.log("✅ Získané transakcie:", transactions);

        
        const found = transactions.find((t: any) => t.id === Number(resId));
        console.log("🔍 Hľadám transakciu s ID =", resId, "; Nájdené =", found);

        if (!found) {
          alert(`Transakcia s ID=${resId} sa nenašla (role=${role}).`);
          return;
        }

        
        

        
        if (found.startDate && found.endDate) {
          const start = new Date(found.startDate);
          const end = new Date(found.endDate);
          setSelectedDays([start, end]);
        }

        
        setReservationTitle(`Rezervácia #${found.id}`);

      } catch (error) {
        console.error("Chyba pri načítaní transakcií:", error);
        alert("Nepodarilo sa načítať detaily transakcie.");
      }
    };

    fetchTransactions();
  }, [resId, role, userId, token]);

  
  const handleDaySelect = (day: Date) => {
    if (selectedDays.length === 0) {
      setSelectedDays([day]);
    } else if (selectedDays.length === 1) {
      const [startDay] = selectedDays;
      const range = startDay < day ? [startDay, day] : [day, startDay];
      setSelectedDays(range);
    } else {
      setSelectedDays([day]);
    }
  };

  
  const handleSubmit = async () => {
    try {
      if (selectedDays.length !== 2) {
        alert("Musíte vybrať rozsah dvoch dátumov.");
        return;
      }
      const [start, end] = selectedDays;

      
      const requestBody = {
        id: Number(resId), 
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        
      };

      const response = await fetch(
        "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/reservations/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Nepodarilo sa aktualizovať rezerváciu");
      }
      navigate("/");
    } catch (error) {
      console.error("Chyba pri aktualizácii:", error);
      alert("Chyba pri ukladaní zmien.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  
  const dateRangeLabel =
    selectedDays.length === 2
      ? `${selectedDays[0].toLocaleDateString("sk-SK")} - ${selectedDays[1].toLocaleDateString("sk-SK")}`
      : "Vyberte rozsah dátumov";

  return (
    <div className={styles.container}>
      <Header className={styles.header} />

      <div className={styles.content}>
        <div className={styles.imagePicker}>
          <DayPicker
            selectedDays={selectedDays}
            onDaySelect={handleDaySelect}
            reservedDates={selectedDays} 
          />
        </div>

        <div className={styles.right}>
          <label className={styles.label}>Rezervácia</label>
          <input
            type="text"
            value={reservationTitle}
            onChange={(e) => setReservationTitle(e.target.value)}
            className={styles.input}
          />

          <input
            type="text"
            readOnly
            className={styles.input}
            value={dateRangeLabel}
          />

        </div>
      </div>

      <div className={styles.buttons}>
        <ButtonComponent
          cancelLabel="Zrušiť"
          submitLabel="Uložiť"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};