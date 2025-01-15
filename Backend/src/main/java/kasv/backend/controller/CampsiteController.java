package kasv.backend.controller;


import kasv.backend.model.Campsite;
import kasv.backend.service.CampsiteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campsites")
public class CampsiteController {

    private final CampsiteService campsiteService;

    public CampsiteController(CampsiteService campsiteService) {
        this.campsiteService = campsiteService;
    }

    @GetMapping
    public ResponseEntity<List<Campsite>> getAllCampsites() {
        List<Campsite> campsites = campsiteService.getAllCampsites();
        return ResponseEntity.ok(campsites);
    }
}
