package kasv.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import kasv.backend.dto.LoginRequestDTO;
import kasv.backend.dto.LoginResponseDTO;
import kasv.backend.dto.RegisterRequestDTO;
import kasv.backend.dto.RegisterResponseDTO;
import kasv.backend.dto.UserDetailsDTO;
import kasv.backend.service.AuthService;
import kasv.backend.service.UserService;
import kasv.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        logger.info("Login request received for user: {}", loginRequest.getEmail());
        LoginResponseDTO response = authService.loginUser(loginRequest);
        if (response.getMessage() != null) {
            logger.warn("Login failed for user: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } else {
            logger.info("Login successful for user: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequestDTO request) {
        logger.info("Register request received for user: {}", request.getEmail());
        RegisterResponseDTO response = authService.registerUser(request);
        if (response.getMessage().equals("User registered successfully")) {
            logger.info("User registered successfully: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            logger.warn("User registration failed: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<UserDetailsDTO> getUserDetails(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            logger.info("Request received to get user details for user ID: {}", userId);
            UserDetailsDTO userDetails = userService.getUserById(userId);
            if (userDetails != null) {
                logger.info("User details retrieved successfully for user ID: {}", userId);
                return ResponseEntity.ok(userDetails);
            } else {
                logger.warn("User not found for user ID: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            logger.warn("Authorization header is missing or invalid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/user/all")
    public ResponseEntity<List<UserDetailsDTO>> getAllUsers(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || !userDetails.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_admin"))) {
            logger.warn("Unauthorized access attempt to get all users");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<UserDetailsDTO> users = userService.getAllUsers();
        logger.info("All users retrieved successfully by admin: {}", userDetails.getUsername());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/user/update/{id}")
    public ResponseEntity<Map<String, Object>> updateUserDetails(@PathVariable Long id, @RequestBody UserDetailsDTO userDetailsDTO, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            UserDetailsDTO updatedUser = userService.updateUserDetails(id, userDetailsDTO, token);
            if (updatedUser != null) {
                return ResponseEntity.ok(Map.of("message", "User details updated successfully", "user", updatedUser));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You are not authorized to update this user's details"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
    }
}