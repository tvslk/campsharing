package kasv.backend.dto;

public class LoginResponseDTO {
    private String token;
    private String message;
    private String role;
    private String username;
    private Long userId;

    public LoginResponseDTO(String token, String message, String role, String username, Long userId) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.username = username;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getUserId() {
        return userId;
    }
}