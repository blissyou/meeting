package org.elitclass.meeting.domain.meeting.entity.enums;

import lombok.Getter;

@Getter
public enum MeetingStatus {
    PENDING("승인대기"),
    APPROVED("승인"),
    REJECTED("거부"),
    PAID("지급완료");

    private final String description;

    MeetingStatus(String description) {
        this.description = description;
    }

}
