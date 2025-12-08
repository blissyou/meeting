package org.elitclass.meeting.domain.meeting.service;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.meeting.dto.MeetingRequestDto;
import org.elitclass.meeting.domain.meeting.dto.MeetingResponseDto;
import org.elitclass.meeting.domain.meeting.dto.ParticipantInfoDto;
import org.elitclass.meeting.domain.meeting.entity.MeetingEntity;
import org.elitclass.meeting.domain.meeting.entity.enums.MeetingStatus;
import org.elitclass.meeting.domain.meeting.repository.MeetingRepository;
import org.elitclass.meeting.domain.user.entity.UserEntity;
import org.elitclass.meeting.domain.user.repository.UserRepository;
import org.elitclass.meeting.domain.participant.entity.MeetingParticipantEntity;
import org.elitclass.meeting.domain.participant.repository.MeetingParticipantRepository;
import org.elitclass.meeting.domain.contact.entity.ContactEntity;
import org.elitclass.meeting.domain.contact.repository.ContactRepository;
import org.elitclass.meeting.exception.InvalidMeetingDataException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MeetingService {
    
    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    private final MeetingParticipantRepository participantRepository;
    private final ContactRepository contactRepository;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public MeetingResponseDto createMeeting(MeetingRequestDto requestDto) {
        validateMeetingData(requestDto);
        
        UserEntity user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        MeetingEntity meeting = new MeetingEntity();
        meeting.setTitle(requestDto.getTitle());
        meeting.setDescription(requestDto.getDescription());
        meeting.setMeetingAt(requestDto.getMeetingAt());
        meeting.setMeetingTo(requestDto.getMeetingTo());
        meeting.setUser(user);
        meeting.setDate(requestDto.getDate());
        if (requestDto.getStatus() != null) meeting.setStatus(requestDto.getStatus());
        if (requestDto.getCost() != null) meeting.setCost(requestDto.getCost());
        if (requestDto.getPlace() != null) meeting.setPlace(requestDto.getPlace());
        
        MeetingEntity savedMeeting = meetingRepository.save(meeting);
        
        // 참가자 저장
        if (requestDto.getParticipantIds() != null && !requestDto.getParticipantIds().isEmpty()) {
            saveParticipants(savedMeeting.getId(), requestDto.getParticipantIds());
        }
        
        return MeetingResponseDto.from(savedMeeting);
    }

    public MeetingResponseDto createMeetingWithFile(MeetingRequestDto requestDto, MultipartFile file) {
        validateMeetingData(requestDto);
        
        UserEntity user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        MeetingEntity meeting = new MeetingEntity();
        meeting.setTitle(requestDto.getTitle());
        meeting.setDescription(requestDto.getDescription());
        meeting.setMeetingAt(requestDto.getMeetingAt());
        meeting.setMeetingTo(requestDto.getMeetingTo());
        meeting.setUser(user);
        meeting.setDate(requestDto.getDate());
        if (requestDto.getStatus() != null) meeting.setStatus(requestDto.getStatus());
        if (requestDto.getCost() != null) meeting.setCost(requestDto.getCost());
        if (requestDto.getPlace() != null) meeting.setPlace(requestDto.getPlace());
        
        MeetingEntity savedMeeting = meetingRepository.save(meeting);
        
        if (file != null && !file.isEmpty()) {
            return uploadFile(savedMeeting.getId(), file);
        }
        
        return MeetingResponseDto.from(savedMeeting);
    }

    @Transactional(readOnly = true)
    public List<MeetingResponseDto> getAllMeetings() {
        return meetingRepository.findAll().stream()
                .map(MeetingResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MeetingResponseDto> getMeetingsByStatus(MeetingStatus status) {
        return meetingRepository.findByStatus(status).stream()
                .map(MeetingResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MeetingResponseDto getMeetingById(Long id) {
        MeetingEntity meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        List<ParticipantInfoDto> participantList = getParticipantInfo(id);
        System.out.println("Meeting ID: " + id + ", Participants found: " + participantList.size());
        return MeetingResponseDto.from(meeting, participantList);
    }
    
    private List<ParticipantInfoDto> getParticipantInfo(Long meetingId) {
        List<MeetingParticipantEntity> participants = participantRepository.findByMeetingId(meetingId);
        System.out.println("Found " + participants.size() + " participants for meeting " + meetingId);
        return participants.stream()
                .map(participant -> {
                    System.out.println("Processing participant with contact ID: " + participant.getContactId());
                    ContactEntity contact = contactRepository.findById(participant.getContactId())
                            .orElse(null);
                    if (contact != null) {
                        System.out.println("Found contact: " + contact.getName());
                        return new ParticipantInfoDto(
                                contact.getId(),
                                contact.getName(),
                                contact.getOrganization(),
                                contact.getPosition(),
                                contact.getEmail(),
                                contact.getPhone(),
                                participant.getRole()
                        );
                    } else {
                        System.out.println("Contact not found for ID: " + participant.getContactId());
                    }
                    return null;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    public MeetingResponseDto updateMeeting(Long id, MeetingRequestDto requestDto) {
        MeetingEntity meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        // 본인 소유 확인
        if (!meeting.getUser().getId().equals(requestDto.getUserId())) {
            throw new RuntimeException("본인의 회의비 신청만 수정할 수 있습니다");
        }
        
        // PENDING 상태만 수정 가능
        if (meeting.getStatus() != MeetingStatus.PENDING) {
            throw new RuntimeException("승인 대기 중인 신청만 수정할 수 있습니다");
        }
        
        UserEntity user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        meeting.setTitle(requestDto.getTitle());
        meeting.setDescription(requestDto.getDescription());
        meeting.setMeetingAt(requestDto.getMeetingAt());
        meeting.setMeetingTo(requestDto.getMeetingTo());
        meeting.setUser(user);
        meeting.setDate(requestDto.getDate());
        if (requestDto.getCost() != null) meeting.setCost(requestDto.getCost());
        if (requestDto.getPlace() != null) meeting.setPlace(requestDto.getPlace());
        
        MeetingEntity updatedMeeting = meetingRepository.save(meeting);
        return MeetingResponseDto.from(updatedMeeting);
    }

    public void deleteMeeting(Long id, Long userId) {
        MeetingEntity meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        // 본인 소유 확인
        if (!meeting.getUser().getId().equals(userId)) {
            throw new RuntimeException("본인의 회의비 신청만 삭제할 수 있습니다");
        }
        
        // PENDING 상태만 삭제 가능
        if (meeting.getStatus() != MeetingStatus.PENDING) {
            throw new RuntimeException("승인 대기 중인 신청만 삭제할 수 있습니다");
        }
        
        meetingRepository.deleteById(id);
    }

    public MeetingResponseDto updateMeetingStatus(Long id, MeetingStatus status) {
        MeetingEntity meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        meeting.setStatus(status);
        MeetingEntity updatedMeeting = meetingRepository.save(meeting);
        return MeetingResponseDto.from(updatedMeeting);
    }

    public MeetingResponseDto uploadFile(Long id, MultipartFile file) {
        MeetingEntity meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        if (file.isEmpty()) {
            throw new RuntimeException("파일이 비어있습니다");
        }
        
        try {
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // 파일명 생성 (UUID + 원본 파일명)
            String originalFilename = file.getOriginalFilename();
            String storedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(storedFilename);
            
            // 파일 저장
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // 기존 파일 삭제
            if (meeting.getFilePath() != null) {
                deleteFileFromDisk(meeting.getFilePath());
            }
            
            // 엔티티 업데이트
            meeting.setFileName(storedFilename);
            meeting.setFilePath(filePath.toString());
            meeting.setOriginalFileName(originalFilename);
            meeting.setFileSize(file.getSize());
            meeting.setContentType(file.getContentType());
            
            MeetingEntity updatedMeeting = meetingRepository.save(meeting);
            return MeetingResponseDto.from(updatedMeeting);
            
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패: " + e.getMessage());
        }
    }

    public Resource downloadFile(Long id) {
        MeetingEntity meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        if (meeting.getFilePath() == null) {
            throw new RuntimeException("파일이 없습니다");
        }
        
        try {
            Path filePath = Paths.get(meeting.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("파일을 읽을 수 없습니다");
            }
        } catch (Exception e) {
            throw new RuntimeException("파일 다운로드 실패: " + e.getMessage());
        }
    }

    public String getFileName(Long id) {
        MeetingEntity meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        return meeting.getOriginalFileName();
    }

    public MeetingResponseDto deleteFile(Long id) {
        MeetingEntity meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        if (meeting.getFilePath() != null) {
            deleteFileFromDisk(meeting.getFilePath());
            
            meeting.setFileName(null);
            meeting.setFilePath(null);
            meeting.setOriginalFileName(null);
            meeting.setFileSize(null);
            meeting.setContentType(null);
            
            MeetingEntity updatedMeeting = meetingRepository.save(meeting);
            return MeetingResponseDto.from(updatedMeeting);
        }
        
        return MeetingResponseDto.from(meeting);
    }

    private void deleteFileFromDisk(String filePath) {
        try {
            Path path = Paths.get(filePath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            // 로그만 남기고 예외는 던지지 않음
            System.err.println("파일 삭제 실패: " + e.getMessage());
        }
    }
    
    private void validateMeetingData(MeetingRequestDto requestDto) {
        if (requestDto.getTitle() == null || requestDto.getTitle().trim().isEmpty()) {
            throw new InvalidMeetingDataException("회의 제목은 필수입니다.");
        }
        if (requestDto.getDescription() == null || requestDto.getDescription().trim().isEmpty()) {
            throw new InvalidMeetingDataException("회의 설명은 필수입니다.");
        }
        if (requestDto.getDate() == null) {
            throw new InvalidMeetingDataException("회의 날짜는 필수입니다.");
        }
        if (requestDto.getMeetingAt() == null) {
            throw new InvalidMeetingDataException("회의 시작 시간은 필수입니다.");
        }
        if (requestDto.getMeetingTo() == null) {
            throw new InvalidMeetingDataException("회의 종료 시간은 필수입니다.");
        }
        if (requestDto.getCost() == null || requestDto.getCost() <= 0) {
            throw new InvalidMeetingDataException("비용은 0보다 커야 합니다.");
        }
        if (requestDto.getPlace() == null || requestDto.getPlace().trim().isEmpty()) {
            throw new InvalidMeetingDataException("회의 장소는 필수입니다.");
        }
    }
    
    private void saveParticipants(Long meetingId, List<Long> participantIds) {
        for (Long contactId : participantIds) {
            MeetingParticipantEntity participant = new MeetingParticipantEntity();
            participant.setMeetingId(meetingId);
            participant.setContactId(contactId);
            participant.setRole("참가자");
            participantRepository.save(participant);
        }
    }
}