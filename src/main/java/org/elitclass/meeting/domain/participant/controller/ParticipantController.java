package org.elitclass.meeting.domain.participant.controller;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.participant.dto.ParticipantRequestDto;
import org.elitclass.meeting.domain.participant.service.ParticipantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/participants")
@RequiredArgsConstructor
public class ParticipantController {
    
    private final ParticipantService participantService;

    @PostMapping("/meeting/{meetingId}")
    public ResponseEntity<Void> addParticipants(
            @PathVariable Long meetingId,
            @RequestBody ParticipantRequestDto requestDto) {
        participantService.addParticipants(meetingId, requestDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/meeting/{meetingId}")
    public ResponseEntity<Void> removeParticipants(@PathVariable Long meetingId) {
        participantService.removeParticipants(meetingId);
        return ResponseEntity.noContent().build();
    }
}