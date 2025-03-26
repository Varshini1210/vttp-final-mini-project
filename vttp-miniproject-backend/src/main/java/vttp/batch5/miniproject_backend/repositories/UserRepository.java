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
        insert into users(user_id,username,email,user_type)
        values(?,?,?,?)
    """;

    public static String SQL_GET_USERNAME = 
    """
            select username from users
            where user_id = ?
            """;

    public static String SQL_GET_EMAIL = """
            select email from users 
            where user_id = ?
            """;

    
    
    public String getUserType (String uid) {
        String userType = template.queryForObject(SQL_GET_USER_TYPE,String.class,uid);
        return userType;
    }

    public void saveUser(String uid, String email, String username){
        template.update(SQL_SAVE_USER,uid,username,email,"PATIENT");
    }

    public String getUsername (String uid) {
        String username = template.queryForObject(SQL_GET_USERNAME, String.class, uid);
        return username;
    }

    public String getEmail (String uid) {
        String email = template.queryForObject(SQL_GET_EMAIL, String.class, uid);
        return email;
    }
}
