package org.elitclass.meeting.domain.auth.controller;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.auth.dto.LoginRequestDto;
import org.elitclass.meeting.domain.auth.dto.LoginResponseDto;
import org.elitclass.meeting.domain.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        LoginResponseDto response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}