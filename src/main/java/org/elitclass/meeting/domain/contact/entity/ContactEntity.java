package org.elitclass.meeting.domain.contact.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "contact")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ContactEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_user_id")
    private Long ownerUserId;

    private String name;
    private String organization;
    private String position;
    private String email;
    private String phone;
}