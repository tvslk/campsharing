package kasv.backend.service;

import kasv.backend.dto.UserDetailsDTO;
import kasv.backend.model.User;
import kasv.backend.repository.UserRepository;
import kasv.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public UserDetailsDTO getUserById(Long id) {
        User user = userRepository.findById(id);
        if (user != null) {
            UserDetailsDTO userDetails = new UserDetailsDTO();
            userDetails.setId(user.getId().longValue());
            userDetails.setUsername(user.getName());
            userDetails.setEmail(user.getEmail());
            return userDetails;
        }
        return null;
    }

    public List<UserDetailsDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            UserDetailsDTO userDetails = new UserDetailsDTO();
            userDetails.setId(user.getId().longValue());
            userDetails.setUsername(user.getName());
            userDetails.setEmail(user.getEmail());
            return userDetails;
        }).collect(Collectors.toList());
    }

    public UserDetailsDTO updateUserDetails(Long id, UserDetailsDTO userDetailsDTO, String token) {
        Long userIdFromToken = jwtUtil.extractUserId(token);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (userIdFromToken.equals(id) || isAdmin) {
            User user = userRepository.findById(id);
            if (user != null) {
                if (userDetailsDTO.getUsername() != null) {
                    user.setName(userDetailsDTO.getUsername());
                }
                if (userDetailsDTO.getEmail() != null) {
                    user.setEmail(userDetailsDTO.getEmail());
                }
                userRepository.save(user);
                userDetailsDTO.setId(user.getId().longValue());
                return userDetailsDTO;
            }
        }
        return null;
    }
}