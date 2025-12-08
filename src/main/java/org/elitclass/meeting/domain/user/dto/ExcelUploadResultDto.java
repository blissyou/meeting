package org.elitclass.meeting.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ExcelUploadResultDto {
    private int successCount;
    private int failCount;
}