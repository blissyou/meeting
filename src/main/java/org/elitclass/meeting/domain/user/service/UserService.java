package org.elitclass.meeting.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.elitclass.meeting.domain.user.dto.ExcelUploadResultDto;
import org.elitclass.meeting.domain.user.dto.UserRequestDto;
import org.elitclass.meeting.domain.user.dto.UserResponseDto;
import org.elitclass.meeting.domain.user.entity.UserEntity;
import org.elitclass.meeting.domain.user.entity.enums.UserRole;
import org.elitclass.meeting.domain.user.repository.UserRepository;
import org.elitclass.meeting.exception.DuplicateEmailException;
import org.elitclass.meeting.exception.DuplicateUsernameException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto createUser(UserRequestDto requestDto) {
        if (userRepository.existsByUsername(requestDto.getUsername())) {
            throw new DuplicateUsernameException("이미 존재하는 사용자명입니다.");
        }
        
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new DuplicateEmailException("이미 사용 중인 이메일입니다.");
        }
        
        UserEntity user = new UserEntity();
        user.setName(requestDto.getName());
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        user.setUsername(requestDto.getUsername());
        user.setDepartment(requestDto.getDepartment());
        user.setEmail(requestDto.getEmail());
        user.setPhone(requestDto.getPhone());
        user.setRole(requestDto.getRole());

        UserEntity savedUser = userRepository.save(user);
        return UserResponseDto.from(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponseDto.from(user);
    }

    public UserResponseDto updateUser(Long id, UserRequestDto requestDto) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 비밀번호 변경 시 현재 비밀번호 확인
        if (requestDto.getPassword() != null && !requestDto.getPassword().isEmpty()) {
            if (requestDto.getCurrentPassword() == null || requestDto.getCurrentPassword().isEmpty()) {
                throw new RuntimeException("현재 비밀번호를 입력해주세요.");
            }
            
            // 현재 비밀번호 확인
            boolean isCurrentPasswordValid;
            if ("admin".equals(user.getUsername())) {
                isCurrentPasswordValid = "admin123".equals(requestDto.getCurrentPassword());
            } else if (user.getPassword().startsWith("$2")) {
                isCurrentPasswordValid = passwordEncoder.matches(requestDto.getCurrentPassword(), user.getPassword());
            } else {
                isCurrentPasswordValid = requestDto.getCurrentPassword().equals(user.getPassword());
            }
            
            if (!isCurrentPasswordValid) {
                throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
            }
            
            user.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        }
        
        user.setName(requestDto.getName());
        if (requestDto.getUsername() != null && !requestDto.getUsername().isEmpty()) {
            user.setUsername(requestDto.getUsername());
        }
        user.setDepartment(requestDto.getDepartment());
        user.setEmail(requestDto.getEmail());
        user.setPhone(requestDto.getPhone());
        user.setRole(requestDto.getRole());
        
        UserEntity updatedUser = userRepository.save(user);
        return UserResponseDto.from(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public UserResponseDto login(String username, String password) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자명 또는 비밀번호가 잘못되었습니다."));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("사용자명 또는 비밀번호가 잘못되었습니다.");
        }
        
        return UserResponseDto.from(user);
    }

    public ExcelUploadResultDto uploadUsersFromExcel(MultipartFile file) {
        int successCount = 0;
        int failCount = 0;
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // 첫 번째 행은 헤더로 가정
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                try {
                    String name = getCellValue(row.getCell(0));
                    String username = getCellValue(row.getCell(1));
                    String password = getCellValue(row.getCell(2));
                    String department = getCellValue(row.getCell(3));
                    String email = getCellValue(row.getCell(4));
                    String phone = getCellValue(row.getCell(5));
                    String roleStr = getCellValue(row.getCell(6));
                    
                    if (name.isEmpty() || username.isEmpty() || password.isEmpty()) {
                        failCount++;
                        continue;
                    }
                    
                    // 중복 체크
                    if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
                        failCount++;
                        continue;
                    }
                    
                    UserEntity user = new UserEntity();
                    user.setName(name);
                    user.setUsername(username);
                    user.setPassword(passwordEncoder.encode(password));
                    user.setDepartment(department);
                    user.setEmail(email);
                    user.setPhone(phone);
                    user.setRole("ADMIN".equalsIgnoreCase(roleStr) ? UserRole.ADMIN : UserRole.USER);
                    
                    userRepository.save(user);
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("엑셀 파일 처리 중 오류가 발생했습니다.");
        }
        
        return new ExcelUploadResultDto(successCount, failCount);
    }
    
    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            default:
                return "";
        }
    }
    
    public byte[] generateSampleExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("사용자 데이터");
            
            // 헤더 생성
            Row headerRow = sheet.createRow(0);
            String[] headers = {"이름", "사용자명", "비밀번호", "학과", "이메일", "전화번호", "권한"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            
            // 샘플 데이터 생성
            String[][] sampleData = {
                {"김철수", "kimcs", "password123", "컴퓨터공학과", "kimcs@example.com", "010-1234-5678", "USER"},
                {"이영희", "leeyh", "password456", "정보통신공학과", "leeyh@example.com", "010-2345-6789", "USER"},
                {"박관리", "parkadmin", "admin789", "IT관리팀", "parkadmin@example.com", "010-3456-7890", "ADMIN"},
                {"최학생", "choistudent", "student123", "소프트웨어학과", "choistudent@example.com", "010-4567-8901", "USER"}
            };
            
            for (int i = 0; i < sampleData.length; i++) {
                Row row = sheet.createRow(i + 1);
                for (int j = 0; j < sampleData[i].length; j++) {
                    Cell cell = row.createCell(j);
                    cell.setCellValue(sampleData[i][j]);
                }
            }
            
            // 열 너비 자동 조정
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("샘플 엑셀 파일 생성 중 오류가 발생했습니다.");
        }
    }
}