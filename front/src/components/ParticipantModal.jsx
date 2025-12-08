import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ParticipantModal = ({ isOpen, onClose, onConfirm, selectedParticipants = [] }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(selectedParticipants);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newContact, setNewContact] = useState({
    name: '',
    organization: '',
    position: '',
    email: '',
    phone: ''
  });
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
      setSelected(selectedParticipants);
    }
  }, [isOpen, selectedParticipants]);

  const fetchContacts = async () => {
    try {
      const response = await api.get(`/contacts/user/${user.id}`);
      setContacts(response.data);
    } catch (error) {
      console.error('연락처 조회 실패:', error);
    }
  };

  const handleToggle = (contactId) => {
    setSelected(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        const response = await api.put(`/contacts/${editingContact.id}`, newContact);
        setContacts(prev => prev.map(c => c.id === editingContact.id ? response.data : c));
        setEditingContact(null);
      } else {
        const response = await api.post(`/contacts/user/${user.id}`, newContact);
        setContacts(prev => [...prev, response.data]);
      }
      setNewContact({ name: '', organization: '', position: '', email: '', phone: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('연락처 처리 실패:', error);
      alert('연락처 처리에 실패했습니다.');
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      organization: contact.organization || '',
      position: contact.position || '',
      email: contact.email || '',
      phone: contact.phone || ''
    });
    setShowAddForm(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('이 연락처를 삭제하시겠습니까?')) {
      try {
        await api.delete(`/contacts/${contactId}`);
        setContacts(prev => prev.filter(c => c.id !== contactId));
        setSelected(prev => prev.filter(id => id !== contactId));
      } catch (error) {
        console.error('연락처 삭제 실패:', error);
        alert('연락처 삭제에 실패했습니다.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setNewContact({ name: '', organization: '', position: '', email: '', phone: '' });
    setShowAddForm(false);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '500px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 24px 16px 24px',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0
        }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>회의 참가자 선택</h3>
          <div>
            <button
              onClick={() => {
                if (showAddForm && !editingContact) {
                  setShowAddForm(false);
                } else {
                  setEditingContact(null);
                  setNewContact({ name: '', organization: '', position: '', email: '', phone: '' });
                  setShowAddForm(true);
                }
              }}
              style={{
                padding: '6px 12px',
                marginRight: '10px',
                backgroundColor: '#00b894',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + 연락처 추가
            </button>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#718096'
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 24px'
        }}>
          {showAddForm && (
            <form onSubmit={handleAddContact} style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>
              {editingContact ? '연락처 수정' : '연락처 추가'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="이름"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                required
              />
              <input
                type="text"
                placeholder="조직/회사"
                value={newContact.organization}
                onChange={(e) => setNewContact({...newContact, organization: e.target.value})}
                style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="직책"
                value={newContact.position}
                onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
              <input
                type="email"
                placeholder="이메일"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
              <input
                type="tel"
                placeholder="전화번호"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{
                padding: '8px 16px',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                {editingContact ? '수정' : '추가'}
              </button>
              <button type="button" onClick={editingContact ? handleCancelEdit : () => setShowAddForm(false)} style={{
                padding: '8px 16px',
                backgroundColor: '#e2e8f0',
                color: '#718096',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                취소
              </button>
            </div>
            </form>
          )}

          <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="연락처 검색 (이름, 조직, 직책)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
          {contacts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#718096', 
              padding: '40px',
              fontStyle: 'italic' 
            }}>
              주소록에 연락처를 먼저 추가해주세요.
            </div>
          ) : (
            filteredContacts.map(contact => (
              <label 
                key={contact.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  margin: '8px 0',
                  border: selected.includes(contact.id) ? '2px solid #4299e1' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selected.includes(contact.id) ? '#f0f8ff' : 'white',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(contact.id)}
                  onChange={() => handleToggle(contact.id)}
                  style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>{contact.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                    {contact.organization} - {contact.position}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
                    {contact.email} | {contact.phone}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditContact(contact);
                    }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      backgroundColor: '#00b894',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteContact(contact.id);
                    }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      backgroundColor: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    삭제
                  </button>
                </div>
              </label>
            ))
          )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px 24px 24px',
          flexShrink: 0,
          backgroundColor: 'white'
        }}>
          <div style={{ color: '#4299e1', fontWeight: '500' }}>
            선택된 참가자: {selected.length}명
          </div>
          <div>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#718096',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#4299e1',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;