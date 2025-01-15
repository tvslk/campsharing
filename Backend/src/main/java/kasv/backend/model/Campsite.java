package kasv.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "camp_sites")
public class Campsite {

    @Id
    @Column(name = "osm_id") // match the column name
    private Long osmId;

    @Column(name = "name")
    private String name;

    @Column(name = "lat")
    private Double lat;

    @Column(name = "lon")
    private Double lon;

    // Constructors
    public Campsite() {
    }

    public Campsite(Long osmId, String name, Double lat, Double lon) {
        this.osmId = osmId;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
    }

    // Getters and Setters
    public Long getOsmId() {
        return osmId;
    }

    public void setOsmId(Long osmId) {
        this.osmId = osmId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }
}

