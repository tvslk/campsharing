package kasv.backend.config;

import kasv.backend.service.CustomUserDetailsService;
import kasv.backend.util.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
                    config.addAllowedOriginPattern("*");
                    config.setAllowCredentials(true);
                    config.addAllowedHeader("*");
                    config.addAllowedMethod("*");
                    return config;
                }))
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        // swagger
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // public
                        .requestMatchers("/api/login",
                                        "/api/register",
                                        "/api/gadgets/all",
                                        "/api/gadgets/{id}",
                                        "/api/transactions/gadget/**",
                                        "/api/gadgets/{gadgetId}/photos",
                                        "/api/campsites",
                                        "/api/reviews/all",
                                        "/api/reviews/add"
                        ).permitAll()

                        // role-based
                        .requestMatchers("/api/user", "/api/user/update/{id}").hasAnyRole("admin", "user")
                        .requestMatchers("/api/user/all").hasRole("admin")
                        .requestMatchers("/api/gadgets/add", "/api/gadgets/update", "/api/gadgets/user", "/api/gadgets/delete/**", "api/gadgets/{gadgetId}/upload-photo", "/api/gadgets/{dagdetId}/delete-photo").hasAnyRole("admin", "user")
                        .requestMatchers("/api/transactions/add", "/api/transactions/all", "/api/transactions/user/**").hasAnyRole("admin", "user")

                        .requestMatchers("/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        .anyRequest().authenticated()
                )

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
