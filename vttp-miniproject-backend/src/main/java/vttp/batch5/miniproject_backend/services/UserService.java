package vttp.batch5.miniproject_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.batch5.miniproject_backend.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public String getUserType(String uid){
        return userRepo.getUserType(uid);
    }

    public void saveUser (String uid, String email, String username){
        userRepo.saveUser(uid, email, username);
    }

    public String getUsername(String uid){
        return userRepo.getUsername(uid);
    }

    public String getEmail(String uid){
        return userRepo.getEmail(uid);
    }
    
}
