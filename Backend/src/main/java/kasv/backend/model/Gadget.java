package kasv.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import kasv.backend.repository.GadgetStatus;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "gadgets")
public class Gadget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String gadgetName;

    @Column(name = "description")
    private String gadgetDescription;

    @Column(name = "price_per_day")
    private double pricePerDay;

    @Column(name = "width")
    private double width;

    @Column(name = "height")
    private double height;

    @Column(name = "length")
    private double length;

    @Column(name = "weight")
    private double weight;

    @Column(name = "material")
    private String material;

    @Column(name = "available_from")
    private LocalDateTime availableFrom;

    @Column(name = "available_to")
    private LocalDateTime availableTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private GadgetStatus status;

    @Column(name = "created_at", columnDefinition = "DATETIME2 DEFAULT SYSDATETIME()")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "DATETIME2 DEFAULT SYSDATETIME()")
    private LocalDateTime updatedAt;

    @Column(name = "category")
    private String category;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User user;

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getGadgetName() {
        return gadgetName;
    }

    public void setGadgetName(String gadgetName) {
        this.gadgetName = gadgetName;
    }

    public String getGadgetDescription() {
        return gadgetDescription;
    }

    public void setGadgetDescription(String gadgetDescription) {
        this.gadgetDescription = gadgetDescription;
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public LocalDateTime getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(LocalDateTime availableFrom) {
        this.availableFrom = availableFrom;
    }

    public LocalDateTime getAvailableTo() {
        return availableTo;
    }

    public void setAvailableTo(LocalDateTime availableTo) {
        this.availableTo = availableTo;
    }

    public GadgetStatus getStatus() {
        return status;
    }

    public void setStatus(GadgetStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCategory() { return category; }

    public void setCategory(String category) { this.category = category; }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}