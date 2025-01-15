package kasv.backend.dto;

import kasv.backend.repository.GadgetStatus;

public class GadgetResponseDTO {
    private Long id;
    private String gadgetName;
    private String gadgetDescription;
    private Double pricePerDay;
    private Double width;
    private Double height;
    private Double length;
    private Double weight;
    private String material;
    private GadgetStatus status;
    private String category;
    private String username;

    // Getters and setters for all fields including username
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(Double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public GadgetStatus getStatus() {
        return status;
    }

    public void setStatus(GadgetStatus status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}