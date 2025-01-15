package kasv.backend.controller;

import kasv.backend.dto.GadgetRequestDTO;
import kasv.backend.dto.GadgetResponseDTO;
import kasv.backend.repository.GadgetStatus;
import kasv.backend.service.GadgetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/gadgets")
public class GadgetController {

    private static final Logger logger = LoggerFactory.getLogger(GadgetController.class);

    @Autowired
    private GadgetService gadgetService;

    @GetMapping("/all")
    public ResponseEntity<List<GadgetResponseDTO>> getAllGadgets() {
        try {
            List<GadgetResponseDTO> gadgets = gadgetService.getAllGadgets();
            return ResponseEntity.ok(gadgets);
        } catch (Exception e) {
            logger.error("Failed to retrieve gadgets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<GadgetResponseDTO> getGadgetById(@PathVariable Long id) {
        try {
            GadgetResponseDTO gadget = gadgetService.getGadgetById(id);
            return ResponseEntity.ok(gadget);
        } catch (Exception e) {
            logger.error("Failed to retrieve gadget with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addGadget(@RequestBody GadgetRequestDTO gadgetRequest, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthorized access attempt to add gadget");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Validate status field
        if (!isValidStatus(gadgetRequest.getStatus().name())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid status value"));
        }

        try {
            logger.info("Adding gadget for user: {}", userDetails.getUsername());
            GadgetResponseDTO savedGadget = gadgetService.addGadget(gadgetRequest, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Gadget added successfully", "gadget", savedGadget));
        } catch (Exception e) {
            logger.error("Failed to add gadget for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to add gadget", "error", e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateGadget(@PathVariable Long id, @RequestBody Map<String, Object> updates, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthorized access attempt to update gadget");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Validate status field if present in updates
        if (updates.containsKey("status") && !isValidStatus((String) updates.get("status"))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid status value"));
        }

        try {
            logger.info("Updating gadget with id: {} for user: {}", id, userDetails.getUsername());
            GadgetResponseDTO updatedGadget = gadgetService.updateGadget(id, updates, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("message", "Gadget updated successfully", "gadget", updatedGadget));
        } catch (Exception e) {
            logger.error("Failed to update gadget with id: {} for user: {}", id, userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to update gadget", "error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteGadgetById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthorized access attempt to delete gadget");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        try {
            boolean isDeleted = gadgetService.deleteGadgetById(id, userDetails.getUsername());
            if (isDeleted) {
                logger.info("Gadget with id: {} deleted successfully by user: {}", id, userDetails.getUsername());
                return ResponseEntity.ok("Gadget deleted successfully");
            } else {
                logger.warn("Gadget with id: {} not found or not owned by user: {}", id, userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Gadget not found or not owned by user");
            }
        } catch (Exception e) {
            logger.error("Failed to delete gadget with id: {} for user: {}", id, userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete gadget");
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<GadgetResponseDTO>> getGadgetsByUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthorized access attempt to get gadgets by user");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            List<GadgetResponseDTO> gadgets = gadgetService.getGadgetsByUser(userDetails.getUsername());
            return ResponseEntity.ok(gadgets);
        } catch (Exception e) {
            logger.error("Failed to retrieve gadgets for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private boolean isValidStatus(String status) {
        try {
            GadgetStatus.valueOf(status);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}