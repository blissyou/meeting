package org.elitclass.meeting.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.elitclass.meeting.domain.user.entity.UserEntity;
import org.elitclass.meeting.domain.user.entity.enums.UserRole;

@Getter
@Setter
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String name;
    private String username;
    private String department;
    private String email;
    private String phone;
    private UserRole role;

    public static UserResponseDto from(UserEntity entity) {
        return new UserResponseDto(
                entity.getId(),
                entity.getName(),
                entity.getUsername(),
                entity.getDepartment(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getRole()
        );
    }
}