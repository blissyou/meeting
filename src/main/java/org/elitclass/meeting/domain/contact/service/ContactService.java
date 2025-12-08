package org.elitclass.meeting.domain.contact.service;

import lombok.RequiredArgsConstructor;
import org.elitclass.meeting.domain.contact.dto.ContactRequestDto;
import org.elitclass.meeting.domain.contact.dto.ContactResponseDto;
import org.elitclass.meeting.domain.contact.entity.ContactEntity;
import org.elitclass.meeting.domain.contact.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactService {
    
    private final ContactRepository contactRepository;

    public ContactResponseDto createContact(Long userId, ContactRequestDto requestDto) {
        ContactEntity contact = new ContactEntity();
        contact.setOwnerUserId(userId);
        contact.setName(requestDto.getName());
        contact.setOrganization(requestDto.getOrganization());
        contact.setPosition(requestDto.getPosition());
        contact.setEmail(requestDto.getEmail());
        contact.setPhone(requestDto.getPhone());

        ContactEntity savedContact = contactRepository.save(contact);
        return ContactResponseDto.from(savedContact);
    }

    @Transactional(readOnly = true)
    public List<ContactResponseDto> getContactsByUserId(Long userId) {
        return contactRepository.findByOwnerUserId(userId).stream()
                .map(ContactResponseDto::from)
                .collect(Collectors.toList());
    }

    public ContactResponseDto updateContact(Long contactId, ContactRequestDto requestDto) {
        ContactEntity contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        contact.setName(requestDto.getName());
        contact.setOrganization(requestDto.getOrganization());
        contact.setPosition(requestDto.getPosition());
        contact.setEmail(requestDto.getEmail());
        contact.setPhone(requestDto.getPhone());
        
        ContactEntity updatedContact = contactRepository.save(contact);
        return ContactResponseDto.from(updatedContact);
    }

    public void deleteContact(Long contactId) {
        contactRepository.deleteById(contactId);
    }
}