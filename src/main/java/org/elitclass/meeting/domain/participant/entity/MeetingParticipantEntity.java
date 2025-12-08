package org.elitclass.meeting.domain.participant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "meeting_participant")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class MeetingParticipantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_id")
    private Long meetingId;

    @Column(name = "contact_id")
    private Long contactId;

    private String role;
}