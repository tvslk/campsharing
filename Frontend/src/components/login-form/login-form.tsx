import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./login-form.module.scss";
import { LoginInput } from "../login-input/login-input";
import { LoginButton } from "../login-button/login-button";
import EmailIcon from "../../assets/icons/email-icon.png";
import PasswordIcon from "../../assets/icons/password-icon.png";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = "Email je povinný.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Zadajte platný email.";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (!formData.password) {
      newErrors.password = "Heslo je povinné.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Heslo musí mať minimálne 8 znakov.";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage("Prosím, opravte chyby vo formulári.");
      return;
    }

    try {
      const response = await fetch(
        "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      navigate(redirectTo);
    } catch (error: any) {
      console.error("Error during login:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <form method="post" className={styles.formAndButton} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <LoginInput
          type="email"
          id="email"
          name="email"
          placeholder="E-mail"
          iconSrc={EmailIcon}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <LoginInput
          type="password"
          id="password"
          name="password"
          placeholder="Heslo"
          iconSrc={PasswordIcon}
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}
      </div>

      <div className={styles.buttonGroup}>
        <LoginButton type="submit">Prihlásiť sa</LoginButton>
      </div>

      {errorMessage && <div className={`${styles.errorMessage} error-message`}>{errorMessage}</div>}
    </form>
  );
};