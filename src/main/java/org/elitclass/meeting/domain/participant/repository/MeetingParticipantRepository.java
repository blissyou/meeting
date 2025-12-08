package org.elitclass.meeting.domain.participant.repository;

import org.elitclass.meeting.domain.participant.entity.MeetingParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingParticipantRepository extends JpaRepository<MeetingParticipantEntity, Long> {
    List<MeetingParticipantEntity> findByMeetingId(Long meetingId);
    void deleteByMeetingId(Long meetingId);
}