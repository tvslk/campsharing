package kasv.backend.service;

import kasv.backend.dto.LoginRequestDTO;
import kasv.backend.dto.LoginResponseDTO;
import kasv.backend.dto.RegisterRequestDTO;
import kasv.backend.dto.RegisterResponseDTO;
import kasv.backend.model.User;
import kasv.backend.repository.UserRepository;
import kasv.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public boolean authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        return user != null && password.equals(user.getPassword());
    }

    public LoginResponseDTO loginUser(LoginRequestDTO loginRequest) {
        logger.info("Authenticating user: {}", loginRequest.getEmail());
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            return new LoginResponseDTO(null, "Password cannot be empty", null, null, null);
        }

        boolean isAuthenticated = authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (isAuthenticated) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            User user = userRepository.findByEmail(loginRequest.getEmail());
            String token = jwtUtil.generateToken(userDetails, user.getId().longValue());
            logger.info("User authenticated successfully: {}", loginRequest.getEmail());
            return new LoginResponseDTO(token, null, user.getRole(), user.getName(), user.getId().longValue());
        } else {
            logger.warn("Invalid credentials for user: {}", loginRequest.getEmail());
            return new LoginResponseDTO(null, "Invalid credentials", null, null, null);
        }
    }

    public RegisterResponseDTO registerUser(RegisterRequestDTO request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return new RegisterResponseDTO("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new RegisterResponseDTO("Password cannot be empty");
        }
        if (request.getName() == null || request.getName().isEmpty()) {
            return new RegisterResponseDTO("Name cannot be empty");
        }
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return new RegisterResponseDTO("Email is already registered");
        }

        try {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setName(request.getName());
            user.setRole("user"); // Set default role
            user.setActive(true); // Set default active status
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            userRepository.save(user);
            logger.info("User registered successfully: {}", request.getEmail());
            return new RegisterResponseDTO("User registered successfully");
        } catch (Exception e) {
            logger.error("User registration failed: {}", e.getMessage());
            return new RegisterResponseDTO("User registration failed: " + e.getMessage());
        }
    }
}