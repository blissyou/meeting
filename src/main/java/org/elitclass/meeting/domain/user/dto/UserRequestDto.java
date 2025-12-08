package org.elitclass.meeting.domain.user.dto;

import lombok.Getter;
import lombok.Setter;
import org.elitclass.meeting.domain.user.entity.enums.UserRole;

@Getter
@Setter
public class UserRequestDto {
    private String name;
    private String password;
    private String currentPassword;
    private String username;
    private String department;
    private String email;
    private String phone;
    private UserRole role;
}