import React, { useState } from "react";
import styles from "./contact.module.scss";
import { Header } from "../header/header";

export const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    inquiryType: "Všeobecný dopyt",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Form:", form);
    alert("Správa bola odoslaná!");
  };

  return (
    <div className={styles.container}>
        <Header className={styles.header} />

      <div className={styles.heading}>
        <h1>Kontaktujte nás</h1>
        <p>Radi vás vypočujeme! Máte otázky, spätnú väzbu alebo sa nám len chcete ozvať? Neváhajte nás kontaktovať.</p>
      </div>

      <div className={styles.teamSection}>
        <h2>Náš tím</h2>
        <p>Tomáš Vasiľko - tomas.vasilko@kosickaakademia.sk</p>
        <p>Samuel Rožko - samuel.rozko@kosickaakademia.sk</p>
        <p>Patrik Lišivka - patrik.lisivka@kosickaakademia.sk</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Vaše meno</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Vaše meno"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Váš e-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Váš e-mail"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="inquiryType">Typ dopytu</label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={form.inquiryType}
            onChange={handleChange}
          >
            <option>Všeobecný dopyt</option>
            <option>Technická podpora</option>
            <option>Spätná väzba</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Vaša správa</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Vaša správa"
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>
          Odoslať správu
        </button>
      </form>
    </div>
  );
};