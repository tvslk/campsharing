package kasv.backend.service;


import kasv.backend.model.Campsite;
import kasv.backend.repository.CampsiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampsiteService {

    private final CampsiteRepository campsiteRepository;

    public CampsiteService(CampsiteRepository campsiteRepository) {
        this.campsiteRepository = campsiteRepository;
    }

    public List<Campsite> getAllCampsites() {
        return campsiteRepository.findAll();
    }

}

