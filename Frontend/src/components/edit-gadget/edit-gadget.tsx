import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../header/header";
import styles from "./edit-gadget.module.scss";
import { ButtonComponent } from "../button-component/button-component";

export const EditGadget = () => {
  const { gadgetId } = useParams<{ gadgetId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    gadgetName: "",
    gadgetDescription: "",
    pricePerDay: "",
  });

  
  const [existingImage, setExistingImage] = useState<string | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchGadgetData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Nie ste prihlásený!");
          navigate("/login");
          return;
        }

        
        const response = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${gadgetId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Nepodarilo sa načítať údaje o gadgete.");
        }

        const data = await response.json();
        setForm({
          gadgetName: data.gadgetName || "",
          gadgetDescription: data.gadgetDescription || "",
          pricePerDay: data.pricePerDay?.toString() || "",
        });

        
        const imageResponse = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${gadgetId}/photos`
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          if (imageData.urls && imageData.urls.length > 0) {
            setExistingImage(imageData.urls[0]);
          } else {
            setExistingImage(null);
          }
        } else {
          setExistingImage(null);
        }
      } catch (error) {
        console.error("Error fetching gadget:", error);
      }
    };

    fetchGadgetData();
  }, [gadgetId, navigate]);

  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  
  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Nie ste prihlásený!");
        return;
      }
  
      
      
      if (!existingImage) {
        alert("Žiadny obrázok na odstránenie.");
        return;
      }
  
      
      
      const encodedPhotoUrl = encodeURIComponent(existingImage);
  
      const deleteUrl = `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${gadgetId}/delete-photo?photoUrl=${encodedPhotoUrl}`;
  
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Nepodarilo sa vymazať obrázok: ${response.status} - ${errorText}`
        );
      }
  
      alert("Obrázok bol vymazaný!");
      setExistingImage(null);
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Chyba pri mazaní obrázka.");
    }
  };
  
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Nie ste prihlásený!");
        return;
      }

      const pricePerDayValue = parseFloat(form.pricePerDay).toFixed(2);
      const requestBody: Record<string, any> = {
        gadgetName: form.gadgetName,
        gadgetDescription: form.gadgetDescription,
        pricePerDay: Number(pricePerDayValue),
      };

      console.log("🔵 Odošiel sa nasledovný request body:", requestBody);

      
      const response = await fetch(
        `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/update/${gadgetId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();
      console.log("🟡 Server Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to edit gadget");
      }

      
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        console.log("Uploading new image for gadget ID:", gadgetId);

        const imageUploadResponse = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${gadgetId}/upload-photo`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!imageUploadResponse.ok) {
          const errorText = await imageUploadResponse.text();
          throw new Error(
            `Image upload failed: ${imageUploadResponse.status} - ${errorText}`
          );
        }

        const imageUploadResult = await imageUploadResponse.json();
        console.log("✅ Image Upload Successful:", imageUploadResult);
      }

      
      navigate("/success");
    } catch (error: any) {
      console.error("🔴 Error editing gadget:", error.message);
      navigate("/error");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <Header className={styles.header} />

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.imagePicker}>
            <div className={styles.imagePreview} style={{ position: "relative" }}>
              {existingImage && !selectedImage && (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <img
                    src={existingImage}
                    alt="Gadget"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "20px",
                    }}
                  />
                  <button
                    onClick={handleRemoveImage}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "none",
                      color: "red",
                      border: "none",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    ✖
                  </button>
                </div>
              )}

              {selectedImage && (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Gadget"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "20px",
                    }}
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "none",
                      color: "red",
                      border: "none",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    ✖
                  </button>
                </div>
              )}

              {!existingImage && !selectedImage && (
                <div>
                  <label htmlFor="imageInput" className={styles.imageinputButton}>
                    Nahrať obrázok
                  </label>
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="gadgetName"
              name="gadgetName"
              value={form.gadgetName}
              onChange={handleInputChange}
              placeholder="Názov gadgetu"
            />
          </div>

          <div className={styles.inputGroup}>
            <textarea
              id="gadgetDescription"
              name="gadgetDescription"
              value={form.gadgetDescription}
              onChange={handleInputChange}
              placeholder="Popis gadgetu"
            ></textarea>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inlineInputs}>
              <input
                type="text"
                id="pricePerDay"
                name="pricePerDay"
                value={form.pricePerDay}
                onChange={handleInputChange}
                placeholder="Cena za deň"
              />
              <span className={styles.currency}>EUR</span>
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
      </div>
    </div>
  );
};