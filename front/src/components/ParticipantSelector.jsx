import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ParticipantSelector = ({ meetingId, onParticipantsChange }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [role, setRole] = useState('참석자');

  const userId = user?.id;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`/contacts/user/${userId}`);
      setContacts(response.data);
    } catch (error) {
      console.error('연락처 조회 실패:', error);
    }
  };

  const handleContactToggle = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleAddParticipants = async () => {
    if (selectedContacts.length === 0) return;
    
    try {
      await axios.post(`/participants/meeting/${meetingId}`, {
        contactIds: selectedContacts,
        role: role
      });
      setSelectedContacts([]);
      if (onParticipantsChange) onParticipantsChange();
    } catch (error) {
      console.error('참가자 추가 실패:', error);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', margin: '20px 0' }}>
      <h3>회의 참가자 선택</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>역할: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="참석자">참석자</option>
          <option value="발표자">발표자</option>
          <option value="진행자">진행자</option>
        </select>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
        {contacts.map(contact => (
          <div key={contact.id} style={{ padding: '10px', border: '1px solid #eee', margin: '5px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.id)}
                onChange={() => handleContactToggle(contact.id)}
                style={{ marginRight: '10px' }}
              />
              <div>
                <strong>{contact.name}</strong>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  {contact.organization} - {contact.position}
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      <button 
        onClick={handleAddParticipants}
        disabled={selectedContacts.length === 0}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: selectedContacts.length > 0 ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none'
        }}
      >
        선택한 참가자 추가 ({selectedContacts.length}명)
      </button>
    </div>
  );
};

export default ParticipantSelector;