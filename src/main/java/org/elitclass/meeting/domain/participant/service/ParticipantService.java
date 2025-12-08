package org.elitclass.meeting.domain.participant.service;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.participant.dto.ParticipantRequestDto;
import org.elitclass.meeting.domain.participant.entity.MeetingParticipantEntity;
import org.elitclass.meeting.domain.participant.repository.MeetingParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ParticipantService {
    
    private final MeetingParticipantRepository participantRepository;

    public void addParticipants(Long meetingId, ParticipantRequestDto requestDto) {
        for (Long contactId : requestDto.getContactIds()) {
            MeetingParticipantEntity participant = new MeetingParticipantEntity();
            participant.setMeetingId(meetingId);
            participant.setContactId(contactId);
            participant.setRole(requestDto.getRole());
            participantRepository.save(participant);
        }
    }

    public void removeParticipants(Long meetingId) {
        participantRepository.deleteByMeetingId(meetingId);
    }
}