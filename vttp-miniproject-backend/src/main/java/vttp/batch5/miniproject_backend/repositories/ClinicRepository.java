package vttp.batch5.miniproject_backend.repositories;

import java.util.ArrayList;
import java.util.List;




import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoExpression;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationExpression;

import org.springframework.data.mongodb.core.aggregation.AggregationResults;

import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;
import vttp.batch5.miniproject_backend.models.Clinic;

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

    public static String SQL_GET_LOCATIONS = """
            select distinct(location) from postal_districts
            """;

    public static String SQL_GET_SECTORS = """
            select sector from postal_districts
            where location = ?
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

    // db.clinics.aggregate([
    //     {
    //         $project: {
    //             _id: 1,
    //             name: 1,
    //             postal_code: 1,
    //            
    //                 $concat: [
    //                     "Block ", { $ifNull: ["$block", ""] }, ", ",
    //                     { $ifNull: ["$street_name", ""] }, ", ",
    //                     { $ifNull: ["$building_name", ""] }, 
    //                     { $cond: { if: { $and: [{ $ne: ["$floor_number", ""] }, { $ne: ["$unit_number", ""] }] }, then: ", #", else: "" } },
    //                     { $ifNull: ["$floor_number", ""] },
    //                     { $cond: { if: { $ne: ["$unit_number", ""] }, then: "-", else: "" } },
    //                     { $ifNull: ["$unit_number", ""] }
    //                 ]
    //             },
    //             longitude: {
    //                 $toDouble: {
    //                     $arrayElemAt: [
    //                         { $split: [
    //                             { $trim: { input: { $arrayElemAt: [ { $split: ["$coordinates", "POINT("] }, 1 ] }, chars: ")" } },
    //                             " "
    //                         ] },
    //                         0
    //                     ]
    //                 }
    //             },
    //             latitude: {
    //                 $toDouble: {
    //                     $arrayElemAt: [
    //                         { $split: [
    //                             { $trim: { input: { $arrayElemAt: [ { $split: ["$coordinates", "POINT("] }, 1 ] }, chars: ")" } },
    //                             " "
    //                         ] },
    //                         1
    //                     ]
    //                 }
    //             }
    //         }
    //     }
    // ])
    

    public List<Clinic> getAllClinics() {
        // Define the projection operation

        ProjectionOperation project = Aggregation.project("_id","name","postal_code")
            
            .and(
                AggregationExpression.from(
                    MongoExpression.create(
                        "{ $concat: [ 'Block ', { $ifNull: ['$block', ''] }, ', ', { $ifNull: ['$street_name', ''] }, ', ', " +
                        "{ $ifNull: ['$building_name', ''] }, { $cond: { if: { $and: [{ $ne: ['$floor_number', ''] }, { $ne: ['$unit_number', ''] }] }, then: ', #', else: '' } }, " +
                        "{ $ifNull: ['$floor_number', ''] }, { $cond: { if: { $ne: ['$unit_number', ''] }, then: '-', else: '' } }, { $ifNull: ['$unit_number', ''] } ] }"
                    )
                )
            ).as("address")
            .and(
                AggregationExpression.from(
                    MongoExpression.create(
                        "{ $toDouble: { $arrayElemAt: [ { $split: [ { $trim: { input: { $arrayElemAt: [ { $split: ['$coordinates', 'POINT('] }, 1 ] }, chars: ')' } }, ' ' ] }, 0 ] } }"
                    )
                )
            ).as("longitude")
            .and(
                AggregationExpression.from(
                    MongoExpression.create(
                        "{ $toDouble: { $arrayElemAt: [ { $split: [ { $trim: { input: { $arrayElemAt: [ { $split: ['$coordinates', 'POINT('] }, 1 ] }, chars: ')' } }, ' ' ] }, 1 ] } }"
                    )
                )
            ).as("latitude");
            

        Aggregation aggregation = Aggregation.newAggregation(project);
        // Execute query
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "clinics", Document.class);

        List<Clinic> clinics = results.getMappedResults()
                                        .stream()
                                        .map(doc -> {
                                            Clinic clinic = new Clinic();
                                            clinic.setId(doc.getInteger("_id"));
                                            clinic.setName(doc.getString("name"));
                                            clinic.setLat(doc.getDouble("latitude"));
                                            clinic.setLon(doc.getDouble("longitude"));
                                            clinic.setAddress(doc.getString("address"));
                                            clinic.setPostalCode(Integer.parseInt(doc.getString("postal_code")));
                                            return clinic;
                                        }). toList();
        System.out.println(clinics.isEmpty());
        return clinics;
    }

    public List<String> getLocations() {
        SqlRowSet rs = sqlTemplate.queryForRowSet(SQL_GET_LOCATIONS);

        List<String> locations = new ArrayList<>();
        while(rs.next()){
            locations.add(rs.getString("location"));
        }
        return locations;
    }

    public List<String> getSectors(String location) {
        SqlRowSet rs = sqlTemplate.queryForRowSet(SQL_GET_SECTORS,location);

        List<String> locations = new ArrayList<>();
        while(rs.next()){
            locations.add(rs.getString("sector"));
        }
        return locations;
    }
    
    
}
