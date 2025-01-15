package kasv.backend.controller;

import kasv.backend.service.GadgetPhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gadgets")
public class GadgetPhotoController {

    @Autowired
    private GadgetPhotoService gadgetPhotoService;

    @GetMapping("/{gadgetId}/photos")
    public ResponseEntity<Map<String, Object>> getGadgetPhotos(@PathVariable Long gadgetId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<String> urls = gadgetPhotoService.getGadgetPhotoUrls(gadgetId);
            response.put("urls", urls);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to retrieve photos");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/{gadgetId}/upload-photo")
    public ResponseEntity<Map<String, Object>> uploadGadgetPhoto(
            @PathVariable Long gadgetId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        if (userDetails == null) {
            response.put("message", "Invalid token credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            String url = gadgetPhotoService.uploadGadgetPhoto(gadgetId, file, userDetails);
            response.put("url", url);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("message", "Failed to upload photo");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{gadgetId}/delete-photo")
    public ResponseEntity<Map<String, Object>> deleteGadgetPhoto(
            @PathVariable Long gadgetId,
            @RequestParam("photoUrl") String photoUrl,
            @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        if (userDetails == null) {
            response.put("message", "Invalid token credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            boolean isDeleted = gadgetPhotoService.deleteGadgetPhoto(gadgetId, photoUrl, userDetails);
            if (isDeleted) {
                response.put("message", "Photo deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Failed to delete photo");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("message", "Failed to delete photo");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}