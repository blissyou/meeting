package org.elitclass.meeting.domain.participant.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ParticipantRequestDto {
    private List<Long> contactIds;
    private String role;
}