package org.elitclass.meeting.domain.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.elitclass.meeting.domain.meeting.entity.MeetingEntity;
import org.elitclass.meeting.domain.meeting.entity.enums.MeetingStatus;

import java.sql.Time;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class MeetingResponseDto {
    private Long id;
    private String title;
    private String description;
    private Time meetingAt;
    private Time meetingTo;
    private Long userId;
    private Date date;
    private MeetingStatus status;
    private Integer cost;
    private String place;
    private String fileName;
    private String originalFileName;
    private Long fileSize;
    private String contentType;
    private String participants;
    private List<ParticipantInfoDto> participantList;

    public static MeetingResponseDto from(MeetingEntity entity) {
        return new MeetingResponseDto(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getMeetingAt(),
                entity.getMeetingTo(),
                entity.getUser().getId(),
                entity.getDate(),
                entity.getStatus(),
                entity.getCost(),
                entity.getPlace(),
                entity.getFileName(),
                entity.getOriginalFileName(),
                entity.getFileSize(),
                entity.getContentType(),
                entity.getParticipants(),
                null
        );
    }
    
    public static MeetingResponseDto from(MeetingEntity entity, List<ParticipantInfoDto> participantList) {
        return new MeetingResponseDto(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getMeetingAt(),
                entity.getMeetingTo(),
                entity.getUser().getId(),
                entity.getDate(),
                entity.getStatus(),
                entity.getCost(),
                entity.getPlace(),
                entity.getFileName(),
                entity.getOriginalFileName(),
                entity.getFileSize(),
                entity.getContentType(),
                entity.getParticipants(),
                participantList
        );
    }
}