import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../header/header";
import styles from "./edit-profile.module.scss";
import { ButtonComponent } from "../button-component/button-component";

export const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication error! Please log in again.");
          navigate("/login");
          return;
        }

        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setProfileData({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };


  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication error! Please log in again.");
        navigate("/login");
        return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const requestBody = {
        username: profileData.username,
        email: profileData.email,
      };

      const response = await fetch(
        `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/user/update/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      navigate("/success");
    } catch (error: any) {
      console.error("Error saving profile:", error.message);
      navigate("/error");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading profile data...</div>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
       
        <div className={styles.right}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Používateľské meno
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
              placeholder="Používateľské meno"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="E-mail"
              className={styles.input}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <ButtonComponent
          cancelLabel="Zrušiť"
          submitLabel="Uložiť"
          onCancel={handleCancel}
          onSubmit={handleSave}
        />
      </div>
    </div>
  );
};