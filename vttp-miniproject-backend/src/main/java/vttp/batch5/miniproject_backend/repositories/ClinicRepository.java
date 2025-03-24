package vttp.batch5.miniproject_backend.repositories;

import java.util.List;
import java.util.Optional;



import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

@Repository
public class ClinicRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private JdbcTemplate sqlTemplate;

    public static String SQL_INSERT_CLINIC = """
            insert into clinics(clinic_id, clinic_name)
            values (?,?)
            """;

    public Boolean dataExists (JsonObject clinicObject){
        int id = clinicObject.getInt("_id");
        Criteria criteria = Criteria.where("_id").is(id);
        Query query = Query.query(criteria);
        List<Document> results = mongoTemplate.find(query, Document.class,"clinics");
        if(results.isEmpty()){
            return false;
        }
        else{
            return true;
        }
    }


    public void insertDataMongo (JsonObject clinicObject){
        String clinicStr = clinicObject.toString();
        Document doc = Document.parse(clinicStr);
        mongoTemplate.insert(doc,"clinics");

    }

    public void insertDataSQL (int id, String name){
        sqlTemplate.update(SQL_INSERT_CLINIC,id,name);
    }

    
    
}
