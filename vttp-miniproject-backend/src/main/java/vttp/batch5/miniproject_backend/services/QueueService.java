package vttp.batch5.miniproject_backend.services;



import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.data.redis.core.RedisTemplate;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import vttp.batch5.miniproject_backend.models.ClinicBooking;

@Service
public class QueueService {

   @Autowired
   @Qualifier("template")
   private RedisTemplate<String,String> redisTemplate;

   @Autowired
   SimpMessagingTemplate messagingTemplate;

   @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private CalendarService calendarService;

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    
   @Value("${spring.mail.username}")
   private String fromEmail;

   public ClinicBooking joinQueue(ClinicBooking booking, HttpServletRequest request) {
    // Add to Redis queue
        String queueKey = "queue:" + booking.getClinicId();
        redisTemplate.opsForList().rightPush(queueKey, booking.getEmail());
        
        // Get queue position
        Long position = redisTemplate.opsForList().size(queueKey);
        
        // Create booking confirmation
        ClinicBooking confirmation = new ClinicBooking(
            booking.getClinicId(),
            booking.getClinicName(),
            booking.getUsername(),
            booking.getEmail(),
            position
        );
        String link = addToGoogleCalendarAsync(confirmation);
        // Send email confirmation
        sendConfirmationEmail(confirmation, link);

        
        
        // Notify admin via WebSocket
        String notificationMessage = " New Booking: " +
                                    confirmation.getUsername() +
                                    " has booked at " +
                                    confirmation.getClinicName() +
                                    ". Queue Position: " + confirmation.getPosition();
       
       webSocketNotificationService.notifyAdmin(notificationMessage);

       return confirmation;
    }

    private String addToGoogleCalendarAsync(ClinicBooking booking)  {

      
            // Set appointment times before sending
            booking.setAppointmentTime(LocalDateTime.now().plusHours(1));
            booking.setEndTime(LocalDateTime.now().plusHours(1).plusMinutes(30));
            
            String calendarLink ="";
            
            try {
                calendarLink = calendarService.addAppointment(booking);
                System.out.println("Added to calendar: {}" + calendarLink);
                
            } catch (IOException e) {
                // TODO Auto-generated catch block
                System.err.println("Calendar integration failed" + e.getMessage());
                e.printStackTrace();
            } catch (GeneralSecurityException e) {
                // TODO Auto-generated catch block
                System.err.println("Calendar integration failed" + e.getMessage());
                e.printStackTrace();
            }catch (Exception e) {
                // TODO Auto-generated catch block
                System.err.println("Calendar integration failed" + e.getMessage());
                e.printStackTrace();
            }
            return calendarLink;
            
        
}


     private void sendConfirmationEmail(ClinicBooking confirmation, String link) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        
        try {
            helper.setFrom(fromEmail);
            helper.setTo(confirmation.getEmail());
            helper.setSubject("Your Clinic Queue Booking");
            
            String emailContent = String.format(
                "<html><body>" +
                "<h2>Hello %s,</h2>" +
                "<p>You have successfully booked a queue at <strong>%s</strong>.</p>" +
                "<p>Your queue position: <strong>%d</strong></p>" +
                "<p>Estimated wait time: 30 minutes</p>" +
                "<p> Here is your calendar invite link: %s" +
                "<p>Thank you!</p>" +
                "</body></html>",
                confirmation.getUsername(),
                confirmation.getClinicName(),
                confirmation.getPosition(),
                link
            );
            
            helper.setText(emailContent, true); 
            
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }
    }


    public Long getQueuePosition(String clinicId, String userEmail) {
        String queueKey = "queue:" + clinicId;
        
        Long position = redisTemplate.opsForList().indexOf(queueKey, userEmail);
        
        
        return position != null ? position + 1 : -1;
    }
    
    public Long getNextQueueNumber(String clinicId) {
        String queueKey = "queue:" + clinicId;
        
        // Get the current queue size 
        Long nextNumber = redisTemplate.opsForList().size(queueKey);
        
        return nextNumber != null ? nextNumber + 1 : 1;
    }

    public Duration getEstimatedWaitTime(String clinicId, Long position) {
        
        return Duration.ofMinutes(position * 5);
    }

    
    
}
