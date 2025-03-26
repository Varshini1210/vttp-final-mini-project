package vttp.batch5.miniproject_backend.services;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;


import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;

import com.google.api.client.json.gson.GsonFactory;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;

import com.google.api.services.calendar.model.EventDateTime;
import com.google.auth.http.HttpCredentialsAdapter;

import com.google.auth.oauth2.GoogleCredentials;

import vttp.batch5.miniproject_backend.models.ClinicBooking;

@Service
public class CalendarService {

    private static final String APPLICATION_NAME = "Clinic Booking System";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);

    @Value("${google.calendar.credentials.path}")
    private String credentialsPath;

    @Value("${google.calendar.id}")
    private String calendarId;



   
    public String addAppointment(ClinicBooking booking) throws IOException, GeneralSecurityException {

        // Load service account credentials
        GoogleCredentials credentials = GoogleCredentials
            .fromStream(new FileInputStream(credentialsPath))
            .createScoped(SCOPES);

        
      // Build Calendar service
      Calendar service = new Calendar.Builder(
        GoogleNetHttpTransport.newTrustedTransport(),
        JSON_FACTORY,
        new HttpCredentialsAdapter(credentials))
        .setApplicationName(APPLICATION_NAME)
        .build();
        
    
        // Create event
        Event event = new Event()
            .setSummary("Appointment at " + booking.getClinicName())
            .setDescription("Patient: " + booking.getUsername())
            .setStart(createEventDateTime(booking.getAppointmentTime()))
            .setEnd(createEventDateTime(booking.getEndTime()))
            .setLocation(booking.getClinicName())
            .setVisibility("public");
    
        return service.events()
            .insert("primary", event)
            .execute()
            .getHtmlLink();
    }
 
    private EventDateTime createEventDateTime(LocalDateTime dateTime) {
        return new EventDateTime()
            .setDateTime(new com.google.api.client.util.DateTime(
                dateTime.atZone(ZoneOffset.UTC).toInstant().toEpochMilli()));
    }
}


   
       