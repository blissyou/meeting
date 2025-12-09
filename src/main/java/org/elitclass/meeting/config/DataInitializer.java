package org.elitclass.meeting.config;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.user.entity.UserEntity;
import org.elitclass.meeting.domain.user.entity.enums.UserRole;
import org.elitclass.meeting.domain.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin1234"));
            admin.setName("관리자");
            admin.setDepartment("관리부서");
            admin.setEmail("admin@university.ac.kr");
            admin.setRole(UserRole.ADMIN);
            
            userRepository.save(admin);
            
            System.out.println("=================================");
            System.out.println("초기 관리자 계정이 생성되었습니다.");
            System.out.println("아이디: admin");
            System.out.println("비밀번호: admin1234");
            System.out.println("=================================");
        }
    }
}
