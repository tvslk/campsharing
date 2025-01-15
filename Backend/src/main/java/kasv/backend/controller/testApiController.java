package kasv.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testApiController {
    @GetMapping(value ="/test")
    public String test() {
        return "Test connection is working!";
    }
}
