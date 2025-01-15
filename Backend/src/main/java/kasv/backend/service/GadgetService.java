package kasv.backend.service;

import kasv.backend.dto.GadgetRequestDTO;
import kasv.backend.dto.GadgetResponseDTO;
import kasv.backend.model.Gadget;
import kasv.backend.model.User;
import kasv.backend.repository.GadgetRepository;
import kasv.backend.repository.GadgetStatus;
import kasv.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GadgetService {

    @Autowired
    private GadgetRepository gadgetRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(GadgetService.class);

    public GadgetResponseDTO addGadget(GadgetRequestDTO gadgetRequest, String userEmail) {
        logger.info("Adding new gadget for user: {}", userEmail);
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            logger.error("User not found: {}", userEmail);
            throw new IllegalArgumentException("User not found");
        }

        Gadget gadget = new Gadget();
        gadget.setGadgetName(gadgetRequest.getGadgetName());
        gadget.setGadgetDescription(gadgetRequest.getGadgetDescription());
        gadget.setPricePerDay(gadgetRequest.getPricePerDay());
        gadget.setWidth(gadgetRequest.getWidth());
        gadget.setHeight(gadgetRequest.getHeight());
        gadget.setLength(gadgetRequest.getLength());
        gadget.setWeight(gadgetRequest.getWeight());
        gadget.setMaterial(gadgetRequest.getMaterial());
        gadget.setStatus(gadgetRequest.getStatus());
        gadget.setCategory(gadgetRequest.getCategory());
        gadget.setUser(user);
        gadget.setCreatedAt(LocalDateTime.now());
        gadget.setUpdatedAt(LocalDateTime.now());

        logger.info("Gadget status: {}", gadgetRequest.getStatus());
        logger.info("Gadget added successfully for user: {}", userEmail);
        Gadget savedGadget = gadgetRepository.save(gadget);

        return convertToResponseDTO(savedGadget);
    }

    public GadgetResponseDTO updateGadget(Long gadgetId, Map<String, Object> updates, String userEmail) {
        logger.info("Updating gadget with id: {} for user: {}", gadgetId, userEmail);
        Gadget existingGadget = gadgetRepository.findById(gadgetId)
                .orElseThrow(() -> {
                    logger.error("Gadget not found with id: {}", gadgetId);
                    return new IllegalArgumentException("Gadget not found");
                });

        User user = userRepository.findByEmail(userEmail);

        if (!existingGadget.getUser().getId().equals(user.getId()) && !user.getRole().equals("admin")) {
            logger.warn("User: {} does not have permission to update gadget with id: {}", userEmail, gadgetId);
            throw new AccessDeniedException("You do not have permission to update this gadget");
        }

        if (updates.containsKey("pricePerDay")) {
            try {
                double price = Double.parseDouble(updates.get("pricePerDay").toString());
                updates.put("pricePerDay", price);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid pricePerDay value");
            }
        }

        updates.forEach((key, value) -> {
            switch (key) {
                case "gadgetName":
                    existingGadget.setGadgetName((String) value);
                    break;
                case "gadgetDescription":
                    existingGadget.setGadgetDescription((String) value);
                    break;
                case "pricePerDay":
                    existingGadget.setPricePerDay((Double) value);
                    break;
                case "width":
                    existingGadget.setWidth((Double) value);
                    break;
                case "height":
                    existingGadget.setHeight((Double) value);
                    break;
                case "depth":
                    existingGadget.setLength((Double) value);
                    break;
                case "weight":
                    existingGadget.setWeight((Double) value);
                    break;
                case "materials":
                    existingGadget.setMaterial((String) value);
                    break;
                case "availableFrom":
                    existingGadget.setAvailableFrom(LocalDateTime.parse((String) value));
                    break;
                case "availableTo":
                    existingGadget.setAvailableTo(LocalDateTime.parse((String) value));
                    break;
                case "status":
                    existingGadget.setStatus(GadgetStatus.valueOf((String) value));
                    break;
                case "category":
                    existingGadget.setCategory((String) value);
                    break;
                default:
                    logger.error("Invalid field: {}", key);
                    throw new IllegalArgumentException("Invalid field: " + key);
            }
        });

        existingGadget.setUpdatedAt(LocalDateTime.now());
        logger.info("Gadget with id: {} updated successfully for user: {}", gadgetId, userEmail);
        Gadget updatedGadget = gadgetRepository.save(existingGadget);

        return convertToResponseDTO(updatedGadget);
    }

    public List<GadgetResponseDTO> getAllGadgets() {
        return gadgetRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<GadgetResponseDTO> getGadgetsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        return gadgetRepository.findByUser(user).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public GadgetResponseDTO getGadgetById(Long id) {
        Gadget gadget = gadgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gadget not found with id: " + id));
        return convertToResponseDTO(gadget);
    }

    public boolean deleteGadgetById(Long id, String username) {
        Gadget gadget = gadgetRepository.findById(id).orElse(null);
        if (gadget != null && gadget.getUser().getEmail().equals(username)) {
            gadgetRepository.delete(gadget);
            return true;
        }
        return false;
    }

    private GadgetResponseDTO convertToResponseDTO(Gadget gadget) {
        GadgetResponseDTO responseDTO = new GadgetResponseDTO();
        responseDTO.setId(gadget.getId());
        responseDTO.setGadgetName(gadget.getGadgetName());
        responseDTO.setGadgetDescription(gadget.getGadgetDescription());
        responseDTO.setPricePerDay(gadget.getPricePerDay());
        responseDTO.setWidth(gadget.getWidth());
        responseDTO.setHeight(gadget.getHeight());
        responseDTO.setLength(gadget.getLength());
        responseDTO.setWeight(gadget.getWeight());
        responseDTO.setMaterial(gadget.getMaterial());
        responseDTO.setStatus(gadget.getStatus());
        responseDTO.setCategory(gadget.getCategory());
        responseDTO.setUsername(gadget.getUser().getEmail());
        return responseDTO;
    }
}