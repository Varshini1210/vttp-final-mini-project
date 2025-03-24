package vttp.batch5.miniproject_backend.services;

import java.io.File;
import java.io.StringReader;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.batch5.miniproject_backend.repositories.ClinicRepository;

@Service
public class ClinicService {

    @Autowired
    private ClinicRepository clinicRepo;

    RestTemplate restTemplate = new RestTemplate();

  
    public void fetchData() {

        String datasetId = "d_3cd840069e95b6a521aa5301a084b25a";
        String url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId;

        try {

            ResponseEntity<String> responseData = restTemplate.getForEntity(url, String.class);
            
                String response = responseData.getBody();

                JsonReader responseReader = Json.createReader(new StringReader(response));
                JsonObject initialObject = responseReader.readObject();
                JsonArray clinicData = initialObject.getJsonObject("result").getJsonArray("records");
                System.out.println(clinicData);

                for(int i=0; i<clinicData.size();i++){
                    JsonObject clinicObject = clinicData.get(i).asJsonObject();
                    Boolean dataExists = clinicRepo.dataExists(clinicObject);
                    if(dataExists){
                        continue;
                    }
                    else{
                        int id = clinicObject.getInt("_id");
                        String name = clinicObject.getString("name");
                        clinicRepo.insertDataSQL(id, name);
                        clinicRepo.insertDataMongo(clinicObject);
                    }
                    
                }
               
            
        } catch (Exception e) {
            e.printStackTrace();
        }

   
    }

    

    
}
