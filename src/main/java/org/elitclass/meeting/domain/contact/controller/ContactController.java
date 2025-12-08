package org.elitclass.meeting.domain.contact.controller;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.contact.dto.ContactRequestDto;
import org.elitclass.meeting.domain.contact.dto.ContactResponseDto;
import org.elitclass.meeting.domain.contact.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {
    
    private final ContactService contactService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<ContactResponseDto> createContact(
            @PathVariable Long userId,
            @RequestBody ContactRequestDto requestDto) {
        ContactResponseDto response = contactService.createContact(userId, requestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ContactResponseDto>> getContactsByUserId(@PathVariable Long userId) {
        List<ContactResponseDto> contacts = contactService.getContactsByUserId(userId);
        return ResponseEntity.ok(contacts);
    }

    @PutMapping("/{contactId}")
    public ResponseEntity<ContactResponseDto> updateContact(
            @PathVariable Long contactId,
            @RequestBody ContactRequestDto requestDto) {
        ContactResponseDto response = contactService.updateContact(contactId, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.noContent().build();
    }
}