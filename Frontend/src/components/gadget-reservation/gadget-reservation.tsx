import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../header/header";
import styles from "./gadget-reservation.module.scss";
import { ButtonComponent } from "../button-component/button-component";
import { DayPicker } from "../day-picker/day-picker";

export const GadgetReservation = () => {
  const navigate = useNavigate();
  const { gadgetId } = useParams<{ gadgetId: string }>();

  const [form, setForm] = useState({
    gadgetName: "",
    pricePerDay: "",
    gadgetDescription: "",
    location: "Calvary Camp, Trenčianska 2097/1, Košice",
    additionalServices: {
      setupTent: true,
      basicCampSupplies: false,
      fireStarter: false,
    },
  });

  const [gadgetImage, setGadgetImage] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  
  useEffect(() => {
    const fetchGadgetData = async () => {
      if (!gadgetId) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${gadgetId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch gadget data.");
        const data = await response.json();

        setForm((prev) => ({
          ...prev,
          gadgetName: data.gadgetName,
          pricePerDay: data.pricePerDay.toString(),
          gadgetDescription: data.gadgetDescription,
          location: data.location || prev.location,
        }));

        const imageResponse = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${gadgetId}/photos`
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setGadgetImage(imageData.urls?.[0] || "https://via.placeholder.com/150");
        } else {
          setGadgetImage("https://via.placeholder.com/150");
        }
      } catch (error) {
        console.error("Error fetching gadget data:", error);
      }
    };

    fetchGadgetData();
  }, [gadgetId, navigate]);

  
  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await fetch(
          `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/transactions/gadget/${gadgetId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reserved dates.");
        }

        const data = await response.json();

        const flattenedDates = data.flatMap(
          ({ startDate, endDate }: { startDate: string; endDate: string }) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const range: Date[] = [];
            let currentDate = new Date(start);
            while (currentDate <= end) {
              range.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }
            return range;
          }
        );

        setReservedDates(flattenedDates);
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };

    fetchReservedDates();
  }, [gadgetId]);

  
  useEffect(() => {
    const storedPlace = localStorage.getItem("selectedPlace");
    if (storedPlace) {
      try {
        const placeObj = JSON.parse(storedPlace);
        if (placeObj?.name) {
          setForm((prev) => ({ ...prev, location: placeObj.name }));
        }
      } catch (err) {
        console.error("Error parsing storedPlace:", err);
      }
    }
  }, []);

  
  useEffect(() => {
    const calculatedPrice = parseFloat(form.pricePerDay) * selectedDays.length;
    setTotalPrice(selectedDays.length > 0 ? calculatedPrice : 0);
  }, [selectedDays, form.pricePerDay]);

  const handleDaySelect = (day: Date) => {
    if (selectedDays.length === 0) {
      setSelectedDays([day]);
    } else if (selectedDays.length === 1) {
      if (day < selectedDays[0]) {
        setSelectedDays([day]);
      } else {
        const range = [];
        let currentDate = new Date(selectedDays[0]);
        while (currentDate <= day) {
          range.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setSelectedDays(range);
      }
    } else {
      setSelectedDays([day]);
    }
  };

  const handleServiceChange = (service: keyof typeof form.additionalServices) => {
    setForm((prev) => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [service]: !prev.additionalServices[service],
      },
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication error! Please log in again.");
        navigate("/login");
        return;
      }

      if (!gadgetId) {
        throw new Error("Gadget ID is missing. Cannot proceed with the reservation.");
      }

      if (selectedDays.length === 0) {
        alert("Please select reservation dates.");
        return;
      }

      const startDate = selectedDays[0]?.toISOString();
      const endDate = selectedDays[selectedDays.length - 1]?.toISOString();

      const requestBody = {
        gadgetId: parseInt(gadgetId),
        startDate,
        endDate,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
      };

      const response = await fetch(
        "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/transactions/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.status === 201) {
        localStorage.removeItem("selectedPlace");
        localStorage.removeItem("selectedGadgetId")
        navigate("/success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to make the reservation.");
      }
    } catch (error) {
      console.error("Error saving reservation:", error);
      localStorage.removeItem("selectedPlace");
      localStorage.removeItem("selectedGadgetId")
      navigate("/error");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLocationClick = () => {
    navigate("/find-place");
  };

  return (
    <div className={styles.container}>
      <Header className={styles.header} />

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.imagePicker}>
            <div className={styles.imagePreview}>
              {gadgetImage && (
                <img
                  src={gadgetImage}
                  alt="Gadget"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "20px",
                  }}
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                />
              )}
            </div>
          </div>

          <div className={styles.imagePicker}>
          <DayPicker
  selectedDays={selectedDays}
  onDaySelect={handleDaySelect}
  reservedDates={reservedDates}
/>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="gadgetName"
              name="gadgetName"
              value={form.gadgetName}
              disabled
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="pricePerDay"
              name="pricePerDay"
              value={`${totalPrice} EUR`}
              disabled
            />
          </div>

          <div className={styles.inputGroup}>
            <textarea
              id="gadgetDescription"
              name="gadgetDescription"
              value={form.gadgetDescription}
              disabled
            />
          </div>

          <div
            className={styles.locationPicker}
            onClick={handleLocationClick}
            style={{ cursor: "pointer" }}
          >
            <img
              src="/campsharing.svg"
              alt="Location Icon"
              className={styles.locationIcon}
            />
            <span className={styles.locationText}>
              {form.location || "Prosím vyberte lokalitu"}
            </span>
          </div>

          <div className={styles.additionalServices}>
            <h3>Doplnkové služby</h3>
            {Object.entries(form.additionalServices).map(([key, value]) => (
              <div key={key} className={styles.serviceOption}>
                <label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      handleServiceChange(key as keyof typeof form.additionalServices)
                    }
                  />
                  {key === "setupTent" && " Zostavenie stanu na mieste kempovania"}
                  {key === "basicCampSupplies" &&
                    " Zabezpečenie základných kempingových potrieb (príbor, poháre, atď.)"}
                  {key === "fireStarter" && " Poskytnutie vybavenia na založenie ohňa"}
                </label>
              </div>
            ))}
          </div>

          <div className={styles.buttons}>
            <ButtonComponent
              cancelLabel="Zrušiť"
              submitLabel="Prenajať"
              onCancel={handleCancel}
              onSubmit={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};