package org.elitclass.meeting.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.user.dto.ExcelUploadResultDto;
import org.elitclass.meeting.domain.user.dto.LoginRequestDto;
import org.elitclass.meeting.domain.user.dto.UserRequestDto;
import org.elitclass.meeting.domain.user.dto.UserResponseDto;
import org.elitclass.meeting.domain.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserRequestDto requestDto) {
        UserResponseDto response = userService.createUser(requestDto);
        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable Long id, @RequestBody UserRequestDto requestDto) {
        UserResponseDto response = userService.updateUser(id, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        UserResponseDto user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/upload-excel")
    public ResponseEntity<ExcelUploadResultDto> uploadExcel(@RequestParam("file") MultipartFile file) {
        ExcelUploadResultDto result = userService.uploadUsersFromExcel(file);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sample-excel")
    public ResponseEntity<byte[]> downloadSampleExcel() {
        byte[] excelData = userService.generateSampleExcel();
        return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .header("Content-Disposition", "attachment; filename=sample-users.xlsx")
                .body(excelData);
    }
}
