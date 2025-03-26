package vttp.batch5.miniproject_backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import vttp.batch5.miniproject_backend.models.ClinicBooking;
import vttp.batch5.miniproject_backend.services.QueueService;

@RestController
@RequestMapping("/api")
public class QueueController {
    
    @Autowired
    private QueueService queueService;

    
    @PutMapping("queue/bookings")
    public ResponseEntity<String> joinQueue(@RequestBody Map<String,String> payload, HttpServletRequest request) {
      
        
        ClinicBooking newBooking = new ClinicBooking(
            Integer.parseInt(payload.get("clinicId")),
            payload.get("clinicName"),
            payload.get("userName"),
            payload.get("userEmail")
        );
        ClinicBooking confirmBooking =queueService.joinQueue(newBooking, request);



        JsonObject response = Json.createObjectBuilder()
                                .add("clinicId",confirmBooking.getClinicId())
                                .add("clinicName",confirmBooking.getClinicName())
                                .add("userName",confirmBooking.getUsername())
                                .add("userEmail",confirmBooking.getEmail())
                                .add("queuePosition",confirmBooking.getPosition())
                                .build();
        
        return ResponseEntity.ok(response.toString());
    }
    
    @GetMapping("queue/{clinicId}/position")
    public ResponseEntity<Long> getQueuePosition(@PathVariable String clinicId, @RequestParam String userEmail) {
        Long position = queueService.getQueuePosition(clinicId, userEmail);
        return ResponseEntity.ok(position);
    }
    
    @GetMapping("queue/{clinicId}/next-number")
    public ResponseEntity<Long> getNextQueueNumber(@PathVariable String clinicId) {
        Long nextNumber = queueService.getNextQueueNumber(clinicId);
        return ResponseEntity.ok(nextNumber);
    }
}