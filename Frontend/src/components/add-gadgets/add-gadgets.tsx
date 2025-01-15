import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../header/header";
import styles from "./add-gadgets.module.scss";
import { ButtonComponent } from "../button-component/button-component";

export const AddGadgets = () => {
  const [form, setForm] = useState({
    gadgetName: "",
    gadgetDescription: "",
    pricePerDay: "",
    width: "",
    height: "",
    depth: "",
    weight: "",
    materials: "",
    category: "stanovačka",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setSelectedImage(imageFile);
    }
};

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleCategoryChange = (category: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      category, 
    }));
  };


  const handleSubmit = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication error! Please log in again.");
            navigate("/login");
            return;
        }

        
        const requestBody = {
            gadgetName: form.gadgetName,
            gadgetDescription: form.gadgetDescription,
            pricePerDay: parseFloat(form.pricePerDay),
            width: parseFloat(form.width),
            height: parseFloat(form.height),
            length: parseFloat(form.depth),
            weight: parseFloat(form.weight),
            material: form.materials,
            category: form.category,
            availableFrom: new Date().toISOString(),
            availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            status: "available"
        };

        console.log("Sending Gadget Data:", requestBody);

        const response = await fetch(
            "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/add",
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
            const errorText = await response.text();
            throw new Error(`Failed to add gadget: ${response.status} - ${errorText}`);
        }

        
        const createdGadget = await response.json();
        const createdGadgetId = createdGadget.gadget?.id;

        if (!createdGadgetId) {
            throw new Error("Gadget ID not found in the response.");
        }

        console.log("Gadget Created Successfully:", createdGadgetId);

        
        if (selectedImage) {
            const formData = new FormData();
            formData.append("file", selectedImage);  

            console.log("Uploading Image for Gadget ID:", createdGadgetId);

            const imageUploadResponse = await fetch(
                `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${createdGadgetId}/upload-photo`,
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
                throw new Error(`Image upload failed: ${imageUploadResponse.status} - ${errorText}`);
            }

            const imageUploadResult = await imageUploadResponse.json();
            console.log("Image Upload Successful:", imageUploadResult);
        }

        setForm({
            gadgetName: "",
            gadgetDescription: "",
            pricePerDay: "",
            width: "",
            height: "",
            depth: "",
            weight: "",
            materials: "",
            category: "stanovačka",
        });
        setSelectedImage(null);
        navigate("/success");
    } catch (error: any) {
        console.error("Error adding gadget:", error.message);
        navigate("/error");
    }
};
  const handleCancel = () => {
    setForm({
      gadgetName: "",
      gadgetDescription: "",
      pricePerDay: "",
      width: "",
      height: "",
      depth: "",
      weight: "",
      materials: "",
      category: "stanovačka",

    });
    setSelectedImage(null);
    navigate("/");
  };


  return (
    <div className={styles.container}>
      <Header className={styles.header} />

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.imagePicker}>
          <div className={styles.imagePreview}>
              {selectedImage ? (
                <div className={styles.imagePreview} style={{ position: "relative" }}>
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
                onClick={handleRemoveImage}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "none",
                  color: "red",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>
    ) : (
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

          <div className={styles.dimensions}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="width"
                name="width"
                value={form.width}
                onChange={handleInputChange}
                placeholder="Šírka"
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="height"
                name="height"
                value={form.height}
                onChange={handleInputChange}
                placeholder="Výška"
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="depth"
                name="depth"
                value={form.depth}
                onChange={handleInputChange}
                placeholder="Dĺžka"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="weight"
              name="weight"
              value={form.weight}
              onChange={handleInputChange}
              placeholder="Hmotnosť"
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="materials"
              name="materials"
              value={form.materials}
              onChange={handleInputChange}
              placeholder="Materiály"
            />
          </div>
          <div className={styles.switchContainer}>
    <button
        className={`${styles.switchButton} ${form.category === "stanovačka" ? styles.active : ""}`}
        onClick={() => handleCategoryChange("stanovačka")}
    >
        Stanovačka
    </button>
    <button
        className={`${styles.switchButton} ${form.category === "rybačka" ? styles.active : ""}`}
        onClick={() => handleCategoryChange("rybačka")}
    >
        Rybačka
    </button>
</div>

          <div className={styles.buttons}>
            <ButtonComponent 
              cancelLabel="Zrušiť"
              submitLabel="Pridať"
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 