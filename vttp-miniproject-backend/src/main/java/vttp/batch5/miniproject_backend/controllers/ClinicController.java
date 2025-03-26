package vttp.batch5.miniproject_backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.batch5.miniproject_backend.models.Clinic;
import vttp.batch5.miniproject_backend.services.ClinicService;

@RestController
@RequestMapping(path="/api", produces=MediaType.APPLICATION_JSON_VALUE)
public class ClinicController {

    @Autowired
    private ClinicService clinicService;

    @GetMapping(path="/clinics")
    public ResponseEntity<String> getAllClinics() {
        List<Clinic> clinics = clinicService.getAllClinics();

        JsonArrayBuilder clinicArray = Json.createArrayBuilder();
        for(Clinic clinic: clinics){
            JsonObject clinicObject = Json.createObjectBuilder()
                                        .add("id",clinic.getId())
                                        .add("name",clinic.getName())
                                        .add("lat",clinic.getLat())
                                        .add("lon",clinic.getLon())
                                        .add("postalCode",clinic.getPostalCode())
                                        .add("address",clinic.getAddress())
                                        .build();
            clinicArray.add(clinicObject);
        }
        return ResponseEntity.ok(clinicArray.build().toString());
    }
    
    @GetMapping(path="clinics/locations")
    public ResponseEntity<String> getClinicLocations() {
        List<String> locations = clinicService.getLocations();

        return ResponseEntity.ok(Json.createArrayBuilder(locations).build().toString());
    }

    @GetMapping(path="/clinic")
    public ResponseEntity<String> getSectorsByLocation(@RequestParam("location") String location) {
        List<String> sectors = clinicService.getSectors(location);

        return ResponseEntity.ok(Json.createArrayBuilder(sectors).build().toString());
    }
}
