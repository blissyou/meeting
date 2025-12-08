package org.elitclass.meeting.domain.meeting.repository;

import org.elitclass.meeting.domain.meeting.entity.MeetingEntity;
import org.elitclass.meeting.domain.meeting.entity.enums.MeetingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetingRepository extends JpaRepository<MeetingEntity,Long> {
    List<MeetingEntity> findByStatus(MeetingStatus status);
}
