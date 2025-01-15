package kasv.backend.service;

import com.azure.storage.blob.*;
import kasv.backend.model.Gadget;
import kasv.backend.model.GadgetPhoto;
import kasv.backend.repository.GadgetPhotoRepository;
import kasv.backend.repository.GadgetRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GadgetPhotoService {

    private final GadgetPhotoRepository gadgetPhotoRepository;
    private final GadgetRepository gadgetRepository;
    private final BlobServiceClient blobServiceClient;
    private final String containerName;

    public GadgetPhotoService(
            GadgetPhotoRepository gadgetPhotoRepository,
            GadgetRepository gadgetRepository,
            @Value("${azure.storage.connection-string}") String connectionString,
            @Value("${azure.storage.container-name:gadgetimages}") String containerName) {

        this.gadgetPhotoRepository = gadgetPhotoRepository;
        this.gadgetRepository = gadgetRepository;
        this.blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
        this.containerName = containerName;
    }

    public String uploadGadgetPhoto(Long gadgetId, MultipartFile file, UserDetails userDetails) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file");
        }

        Gadget gadget = gadgetRepository.findById(gadgetId)
                .orElseThrow(() -> new IllegalArgumentException("Gadget not found"));

        String userEmail = userDetails.getUsername();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_admin"));

        if (!gadget.getUser().getEmail().equals(userEmail) && !isAdmin) {
            throw new IllegalArgumentException("User is not the owner of this gadget or an admin");
        }

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        String originalFilename = file.getOriginalFilename();
        String blobName = Instant.now().toEpochMilli() + "-" + originalFilename;
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        try (InputStream dataStream = file.getInputStream()) {
            blobClient.upload(dataStream, file.getSize(), true);
        }

        String blobUrl = blobClient.getBlobUrl();
        GadgetPhoto gadgetPhoto = new GadgetPhoto(gadgetId, blobUrl);
        gadgetPhotoRepository.save(gadgetPhoto);

        return blobUrl;
    }

    public boolean deleteGadgetPhoto(Long gadgetId, String photoUrl, UserDetails userDetails) {
        GadgetPhoto photo = gadgetPhotoRepository.findByGadgetIdAndImageUrl(gadgetId, photoUrl);
        if (photo == null) {
            throw new IllegalArgumentException("Photo not found");
        }

        Gadget gadget = gadgetRepository.findById(gadgetId)
                .orElseThrow(() -> new IllegalArgumentException("Gadget not found"));

        String userEmail = userDetails.getUsername();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_admin"));

        if (!gadget.getUser().getEmail().equals(userEmail) && !isAdmin) {
            throw new IllegalArgumentException("User is not the owner of this gadget or an admin");
        }

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = containerClient.getBlobClient(photoUrl.substring(photoUrl.lastIndexOf("/") + 1));
        blobClient.delete();

        gadgetPhotoRepository.delete(photo);
        return true;
    }

    public List<String> getGadgetPhotoUrls(Long gadgetId) {
        List<GadgetPhoto> photos = gadgetPhotoRepository.findByGadgetId(gadgetId);
        return photos.stream()
                .map(GadgetPhoto::getImageUrl)
                .collect(Collectors.toList());
    }
}