package vttp.batch5.miniproject_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import vttp.batch5.miniproject_backend.services.ClinicService;

@SpringBootApplication
public class MiniprojectBackendApplication implements CommandLineRunner{

	@Autowired
	ClinicService clinicSvc;

	public static void main(String[] args) {
		SpringApplication.run(MiniprojectBackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
		clinicSvc.fetchData();
	}

}
