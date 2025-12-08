package org.elitclass.meeting.domain.contact.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactRequestDto {
    private String name;
    private String organization;
    private String position;
    private String email;
    private String phone;
}