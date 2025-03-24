package vttp.batch5.miniproject_backend.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    
    @Autowired
    private JdbcTemplate template;

    public static String SQL_GET_USER_TYPE = 
    """
        select user_type from users 
        where user_id = ?
    """;

    public static String SQL_SAVE_USER=
    """
        insert into users(user_id,email,user_type)
        values(?,?,?)
    """;
    
    public String getUserType (String uid) {
        String userType = template.queryForObject(SQL_GET_USER_TYPE,String.class,uid);
        return userType;
    }

    public void saveUser(String uid, String email){
        template.update(SQL_SAVE_USER,uid,email,"PATIENT");
    }
}
