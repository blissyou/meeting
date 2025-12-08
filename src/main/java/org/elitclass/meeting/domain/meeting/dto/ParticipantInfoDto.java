package org.elitclass.meeting.domain.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ParticipantInfoDto {
    private Long contactId;
    private String name;
    private String organization;
    private String position;
    private String email;
    private String phone;
    private String role;
}