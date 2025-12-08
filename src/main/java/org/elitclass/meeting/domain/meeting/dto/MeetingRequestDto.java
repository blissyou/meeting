package org.elitclass.meeting.domain.meeting.dto;

import lombok.Getter;
import lombok.Setter;
import org.elitclass.meeting.domain.meeting.entity.enums.MeetingStatus;

import java.sql.Time;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class MeetingRequestDto {
    private String title;
    private String description;
    private Time meetingAt;
    private Time meetingTo;
    private Long userId;
    private Date date;
    private MeetingStatus status;
    private Integer cost;
    private String participants;
    private List<Long> participantIds;
    private String place;
}