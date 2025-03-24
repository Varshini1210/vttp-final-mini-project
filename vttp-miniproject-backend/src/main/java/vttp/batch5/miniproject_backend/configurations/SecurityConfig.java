package vttp.batch5.miniproject_backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import vttp.batch5.miniproject_backend.security.FirebaseAuthFilter;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // Public endpoints
                .anyRequest().authenticated() // All others require authentication
            )
            .addFilterBefore(new FirebaseAuthFilter(), UsernamePasswordAuthenticationFilter.class); // Add Firebase Filter

        return http.build();
    }
    
}
