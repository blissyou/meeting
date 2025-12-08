package org.elitclass.meeting.domain.meeting.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.elitclass.meeting.domain.meeting.entity.enums.MeetingStatus;
import org.elitclass.meeting.domain.user.entity.UserEntity;

import java.sql.Time;
import java.util.Date;

@Entity(name = "meeting_data")
@Table(name = "meeting_data")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MeetingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private String title;

    private String description;

    private Time meetingAt;

    private Time meetingTo;

    @ManyToOne
    private UserEntity user;

    private Date date;

    @Enumerated(EnumType.STRING)
    private MeetingStatus status = MeetingStatus.PENDING;

    private Integer cost;

    private String place;

    // 파일 관련 필드
    private String fileName;
    
    private String filePath;
    
    private String originalFileName;
    
    private Long fileSize;
    
    private String contentType;
    
    private String participants;
}
