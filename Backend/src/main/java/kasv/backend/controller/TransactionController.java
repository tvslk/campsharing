package kasv.backend.controller;

import kasv.backend.model.Transaction;
import kasv.backend.model.User;
import kasv.backend.service.TransactionService;
import kasv.backend.repository.UserRepository;
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

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> makeReservation(@RequestBody Transaction transaction, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthorized access attempt to make reservation");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        try {
            User user = userRepository.findByEmail(userDetails.getUsername());
            if (user != null) {
                transaction.setUserId(user.getId().longValue());
                Transaction savedTransaction = transactionService.makeReservation(transaction);
                logger.info("Reservation made successfully for user: {}", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Reservation made successfully", "transaction", savedTransaction));
            } else {
                logger.warn("User not found: {}", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
            }
        } catch (Exception e) {
            logger.error("Failed to make reservation for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to make reservation", "error", e.getMessage()));
        }
    }

    @GetMapping("/gadget/{gadgetId}")
    public ResponseEntity<List<Transaction>> getReservationsByGadgetId(@PathVariable Long gadgetId) {
        try {
            List<Transaction> transactions = transactionService.getReservationsByGadgetId(gadgetId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Failed to retrieve reservations for gadgetId: {}", gadgetId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAllReservations(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || !userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin") || a.getAuthority().equals("ROLE_user"))) {
            logger.warn("Unauthorized access attempt to retrieve all transactions");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        try {
            List<Transaction> transactions = transactionService.getAllReservations();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Failed to retrieve all transactions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getReservationsByUserId(@PathVariable Long userId, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || !userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin") || a.getAuthority().equals("ROLE_user"))) {
            logger.warn("Unauthorized access attempt to retrieve transactions by user ID");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        try {
            List<Transaction> transactions = transactionService.getReservationByUserId(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Failed to retrieve transactions for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}