package org.elitclass.meeting.domain.auth.service;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.config.security.JwtUtil;
import org.elitclass.meeting.domain.auth.dto.LoginRequestDto;
import org.elitclass.meeting.domain.auth.dto.LoginResponseDto;
import org.elitclass.meeting.domain.user.entity.UserEntity;
import org.elitclass.meeting.domain.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        UserEntity user = userRepository.findByUsername(loginRequest.getUserName())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다");
        }
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().toString());
        
        return new LoginResponseDto(
                token,
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getRole().toString()
        );
    }
}