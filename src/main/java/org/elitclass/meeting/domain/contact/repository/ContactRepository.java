package org.elitclass.meeting.domain.contact.repository;

import org.elitclass.meeting.domain.contact.entity.ContactEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<ContactEntity, Long> {
    List<ContactEntity> findByOwnerUserId(Long ownerUserId);
}