package vttp.batch5.miniproject_backend.controllers;

import java.io.StringReader;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.firebase.auth.FirebaseAuthException;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

import vttp.batch5.miniproject_backend.services.AuthService;
import vttp.batch5.miniproject_backend.services.UserService;

@RestController
@RequestMapping(path="/api", produces=MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/authenticate")
    public ResponseEntity<String> authenticate(@RequestBody String payload){
        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject tokenObject = reader.readObject();
        String token = tokenObject.getString("token");
        try{
            String uid = authService.verifyToken(token);
            String userType = userService.getUserType(uid);
            String username = userService.getUsername(uid);
            String email = userService.getEmail(uid);

            JsonObject response = Json.createObjectBuilder()
                                    .add("user_type",userType)
                                    .add("username", username)
                                    .add("email",email)
                                    .add("user_id",uid)
                                    .build();
            return ResponseEntity.ok(response.toString());
        }

        catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String,String> payload) throws FirebaseAuthException{
        

        String email = payload.get("email");
        String password = payload.get("password");
        String username = payload.get("username");

        try{
            String uid = authService.createUser(email, password);
            userService.saveUser(uid, email, username);

            JsonObject response = Json.createObjectBuilder()
                                    .add("message","Record is inserted")
                                    .build();
            return ResponseEntity.ok(response.toString());

        }
        catch (Exception e){
            return ResponseEntity.status(500).body("Error: "+ e.getMessage());
        }
        



    }
    
}
