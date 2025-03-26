package vttp.batch5.miniproject_backend.models;

import java.time.LocalDateTime;

public class ClinicBooking {
    private int clinicId;
    private String clinicName;
    private String username;
    private String email;
    private long position;
    private LocalDateTime appointmentTime;  
    private LocalDateTime endTime;          
    
    public ClinicBooking(int clinicId, String clinicName, String username, String email, long position,
            LocalDateTime appointmentTime, LocalDateTime endTime) {
        this.clinicId = clinicId;
        this.clinicName = clinicName;
        this.username = username;
        this.email = email;
        this.position = position;
        this.appointmentTime = appointmentTime;
        this.endTime = endTime;
    }

    public ClinicBooking(int clinicId, String clinicName, String username, String email, long position) {
        this.clinicId = clinicId;
        this.clinicName = clinicName;
        this.username = username;
        this.email = email;
        this.position = position;
    }

    public ClinicBooking(int clinicId, String clinicName, String username, String email) {
        this.clinicId = clinicId;
        this.clinicName = clinicName;
        this.username = username;
        this.email = email;
    }

    public ClinicBooking() {
    }

    public int getClinicId() {
        return clinicId;
    }

    public void setClinicId(int clinicId) {
        this.clinicId = clinicId;
    }

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getPosition() {
        return position;
    }

    public void setPosition(long position) {
        this.position = position;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
}
