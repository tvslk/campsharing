package kasv.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "gadget_photos")
public class GadgetPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gadget_id", nullable = false)
    private Long gadgetId;

    @Column(name = "photo_url", nullable = false)
    private String imageUrl;

    // Constructors, getters, setters
    public GadgetPhoto() {
    }

    public GadgetPhoto(Long gadgetId, String imageUrl) {
        this.gadgetId = gadgetId;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public Long getGadgetId() {
        return gadgetId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setGadgetId(Long gadgetId) {
        this.gadgetId = gadgetId;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
