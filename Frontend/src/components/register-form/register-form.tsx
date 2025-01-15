import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register-form.module.scss";
import { LoginInput } from "../login-input/login-input";
import { LoginButton } from "../login-button/login-button";
import EmailIcon from "../../assets/icons/email-icon.png";
import PasswordIcon from "../../assets/icons/password-icon.png";
import NameIcon from "../../assets/icons/name-icon.png";
import AgainIcon from "../../assets/icons/again-icon.png";

export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        passwordRepeat: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        passwordRepeat: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    
    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        
        if (!formData.name.trim()) {
            newErrors.name = "Meno je povinné.";
            isValid = false;
        } else {
            newErrors.name = "";
        }

        
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

        if (formData.password !== formData.passwordRepeat) {
            newErrors.passwordRepeat = "Heslá sa nezhodujú.";
            isValid = false;
        } else {
            newErrors.passwordRepeat = "";
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
                "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }

            alert("Registrácia bola úspešná!");
            navigate("/login");
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    return (
        <form method="post" className={styles.formAndButton} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <LoginInput
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Meno"
                    iconSrc={NameIcon}
                    value={formData.name}
                    onChange={handleChange}
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}

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

                <LoginInput
                    type="password"
                    id="passwordRepeat"
                    name="passwordRepeat"
                    placeholder="Zopakujte heslo"
                    iconSrc={AgainIcon}
                    value={formData.passwordRepeat}
                    onChange={handleChange}
                />
                {errors.passwordRepeat && (
                    <p className={styles.error}>{errors.passwordRepeat}</p>
                )}
            </div>

            {errorMessage && <div className={`${styles.errorMessage} error-message`}>{errorMessage}</div>}
            <div className={styles.buttonGroup}>
                <LoginButton type="submit">Registrovať sa</LoginButton>
            </div>
        </form>
    );
};