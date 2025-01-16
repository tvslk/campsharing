

import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../header/header";
import styles from "./show-more-admin.module.scss";
import { useState, useEffect } from "react";

export const ShowMoreAdmin = () => {
  const { tableType } = useParams<{ tableType: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Nie ste prihlásený.");
          navigate("/login");
          return;
        }

        let endpoint = "";
        if (tableType === "reservations") {
          endpoint = `/api/transactions/all`;
        } else if (tableType === "equipment") {
          endpoint = `/api/gadgets/all`;
        } else if (tableType === "users") {
          endpoint = `/api/user/all`; 
        } else {
          console.error("Neplatný typ tabuľky:", tableType);
          return;
        }

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
          throw new Error("Nepodarilo sa načítať dáta.");
        }

        let result = await response.json();

        
        if (tableType === "users") {
          result = result.filter((user: any) => user.status !== "inactive");
        }

        setData(result);
      } catch (error) {
        console.error("Chyba pri načítaní dát:", error);
        alert("Nepodarilo sa načítať dáta.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableType, navigate]);

  
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
      totalCost: "Celková cena",
    };
    return translations[key] || key;
  };

  
  
  
  
  const handleEdit = (id: string) => {
    if (tableType === "equipment") {
      navigate(`/edit-gadget/${id}`);
    } else if (tableType === "reservations") {
      navigate(`/edit-reservation/${id}`);
    }
  };

  
  
  const fetchPhotoUrls = async (id: string, token: string) => {
    try {
      console.log("Fetching photo URLs for gadget ID:", id);
      const photoResponse = await fetch(
        `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${id}/photos`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!photoResponse.ok) {
        const errorText = await photoResponse.text();
        console.error("Error fetching photo URLs:", errorText);
        alert(`Error fetching photo URLs: ${errorText}`);
        return [];
      }
  
      const photoData = await photoResponse.json();
      console.log("Fetched photo data:", photoData);
  
      if (!Array.isArray(photoData.urls) || photoData.urls.length === 0) {
        console.warn("No photos found in the response.");
        return [];
      }
  
      return photoData.urls;
    } catch (error) {
      console.error("Error during photo fetch:", error);
      return [];
    }
  };
  
  const deletePhoto = async (photoUrl: string, id: string, token: string) => {
    try {
      console.log("Attempting to delete photo with URL:", photoUrl);
  
      const formData = new FormData();
      formData.append("photoUrl", photoUrl);
  
      const deletePhotoResponse = await fetch(
        `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${id}/delete-photo`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
  
      console.log(
        "DELETE photo request sent. Response status:",
        deletePhotoResponse.status
      );
  
      if (!deletePhotoResponse.ok) {
        const deletePhotoError = await deletePhotoResponse.text();
        console.error("Error deleting photo:", deletePhotoError);
        return false;
      }
  
      const deletePhotoSuccess = await deletePhotoResponse.json();
      console.log("Photo deletion response:", JSON.stringify(deletePhotoSuccess, null, 2));
  
      return true;
    } catch (error) {
      console.error("Error during photo deletion:", error);
      return false;
    }
  };
  
  const deleteGadget = async (id: string, token: string) => {
    try {
      console.log("Attempting to delete gadget with ID:", id);
  
      const deleteGadgetResponse = await fetch(
        `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/delete/${id}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(
        "DELETE gadget request sent. Response status:",
        deleteGadgetResponse.status
      );
  
      if (!deleteGadgetResponse.ok) {
        const deleteGadgetError = await deleteGadgetResponse.text();
        console.error("Error deleting gadget:", deleteGadgetError);
        return false;
      }
  
      const deleteGadgetSuccess = await deleteGadgetResponse.json();
      console.log("Gadget deletion response:", JSON.stringify(deleteGadgetSuccess, null, 2));
  
      return true;
    } catch (error) {
      console.error("Error during gadget deletion:", error);
      return false;
    }
  };
  
  const handleRemove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in.");
        return;
      }
  
      console.log("Starting removal process for gadget ID:", id);
  
      // Fetch photo URLs
      const photoUrls = await fetchPhotoUrls(id, token);
  
      if (photoUrls.length === 0) {
        console.log("No photos to delete. Proceeding to delete the gadget.");
      } else {
        // Delete each photo
        for (const photoUrl of photoUrls) {
          const photoDeleted = await deletePhoto(photoUrl, id, token);
          if (!photoDeleted) {
            console.error("Photo deletion failed. Stopping the removal process.");
            return;
          }
        }
      }
  
      // Delete the gadget
      const gadgetDeleted = await deleteGadget(id, token);
      if (gadgetDeleted) {
        console.log("Gadget was successfully deleted!");
        setData((prev) => prev.filter((item) => String(item.id) !== String(id)));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during deletion process:", error.message);
        alert(`Error during deletion process: ${error.message}`);
      } else {
        console.error("Unexpected error during deletion process:", error);
        alert("Unexpected error during deletion process.");
      }
    }
  };

  const filteredKeys = (row: any) =>
    Object.keys(row).filter(
      (key) =>
        ![
          "gadgetDescription",
          "availableFrom",
          "availableTo",
          "returnDate",
        ].includes(key)
    );

  
  
  
  
  const showActions = tableType === "equipment" || tableType === "reservations";

  
  const renderButtons = (id: string) => {
    if (tableType === "equipment") {
      
      return (
        <>
          <button className="edit" onClick={() => handleEdit(id)}>
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
          <button className="remove" onClick={() => handleRemove(id)}>
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
        </>
      );
    } else if (tableType === "reservations") {
      
      return (
        <button className="edit" onClick={() => handleEdit(id)}>
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
      );
    } else {
      
      return null;
    }
  };

  return (
    <div className={styles.showMorePage}>
      <Header />
      <h2 style={{ fontFamily: "Merge One", color: "#77726a" }}>
        {tableType === "equipment"
          ? "Vybavenie"
          : tableType === "reservations"
          ? "Rezervácie"
          : tableType === "users"
          ? "Používatelia"
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
                              row[key] === "Dostupné" ||
                              row[key] === "available" ||
                              row[key] === "active"
                                ? styles.green
                                : styles.yellow
                            }`}
                          ></span>
                        ) : key === "startDate" || key === "endDate" ? (
                          row[key]
                            ? new Date(row[key]).toLocaleDateString("sk-SK")
                            : ""
                        ) : (
                          String(row[key])
                        )}
                      </td>
                    ))}
                    {showActions && (
                      <td>
                        <div className={styles.actionButtons}>
                          {renderButtons(row.id)}
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