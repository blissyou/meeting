package org.elitclass.meeting.domain.contact.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.elitclass.meeting.domain.contact.entity.ContactEntity;

@Getter
@Setter
@AllArgsConstructor
public class ContactResponseDto {
    private Long id;
    private String name;
    private String organization;
    private String position;
    private String email;
    private String phone;

    public static ContactResponseDto from(ContactEntity entity) {
        return new ContactResponseDto(
                entity.getId(),
                entity.getName(),
                entity.getOrganization(),
                entity.getPosition(),
                entity.getEmail(),
                entity.getPhone()
        );
    }
}