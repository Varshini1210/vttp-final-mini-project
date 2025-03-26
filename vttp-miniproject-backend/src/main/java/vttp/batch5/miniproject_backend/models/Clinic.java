package vttp.batch5.miniproject_backend.models;

public class Clinic {
    private int id;
    private String name;
    private double lat;
    private double lon;
    private int postalCode;
    private String address;
    
    public Clinic(int id, String name, double lat, double lon, int postalCode, String address) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.postalCode = postalCode;
        this.address = address;
    }

    public Clinic() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public int getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(int postalCode) {
        this.postalCode = postalCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    

    
    
}
