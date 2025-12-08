package org.elitclass.meeting.domain.meeting.controller;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.meeting.dto.MeetingRequestDto;
import org.elitclass.meeting.domain.meeting.dto.MeetingResponseDto;
import org.elitclass.meeting.domain.meeting.entity.enums.MeetingStatus;
import org.elitclass.meeting.domain.meeting.service.MeetingService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingController {
    
    private final MeetingService meetingService;

    @PostMapping
    public ResponseEntity<MeetingResponseDto> createMeeting(@RequestBody MeetingRequestDto requestDto) {
        MeetingResponseDto response = meetingService.createMeeting(requestDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MeetingResponseDto> createMeetingWithFile(
            @RequestPart("meeting") MeetingRequestDto requestDto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        MeetingResponseDto response = meetingService.createMeetingWithFile(requestDto, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MeetingResponseDto>> getAllMeetings(@RequestParam(required = false) MeetingStatus status) {
        List<MeetingResponseDto> meetings = status != null ? 
            meetingService.getMeetingsByStatus(status) : 
            meetingService.getAllMeetings();
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingResponseDto> getMeetingById(@PathVariable Long id) {
        MeetingResponseDto meeting = meetingService.getMeetingById(id);
        return ResponseEntity.ok(meeting);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MeetingResponseDto> updateMeeting(@PathVariable Long id, @RequestBody MeetingRequestDto requestDto) {
        MeetingResponseDto response = meetingService.updateMeeting(id, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id, @RequestParam Long userId) {
        meetingService.deleteMeeting(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MeetingResponseDto> updateMeetingStatus(@PathVariable Long id, @RequestParam MeetingStatus status) {
        MeetingResponseDto response = meetingService.updateMeetingStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/file")
    public ResponseEntity<MeetingResponseDto> uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        MeetingResponseDto response = meetingService.uploadFile(id, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Resource resource = meetingService.downloadFile(id);
        String filename = meetingService.getFileName(id);
        
        try {
            String encodedFilename = java.net.URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"file\"")
                    .body(resource);
        }
    }

    @DeleteMapping("/{id}/file")
    public ResponseEntity<MeetingResponseDto> deleteFile(@PathVariable Long id) {
        MeetingResponseDto response = meetingService.deleteFile(id);
        return ResponseEntity.ok(response);
    }
}
