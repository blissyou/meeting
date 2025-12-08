import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    position: '',
    email: '',
    phone: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/contacts/user/${userId}`, formData);
      setFormData({ name: '', organization: '', position: '', email: '', phone: '' });
      fetchContacts();
      alert('연락처가 추가되었습니다.');
    } catch (error) {
      console.error('연락처 추가 실패:', error);
      alert('연락처 추가에 실패했습니다.');
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`/contacts/${contactId}`);
      fetchContacts();
    } catch (error) {
      console.error('연락처 삭제 실패:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>주소록 관리</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px' }}>
        <h3>새 연락처 추가</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="조직/회사"
            value={formData.organization}
            onChange={(e) => setFormData({...formData, organization: e.target.value})}
          />
          <input
            type="text"
            placeholder="직책"
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
          />
          <input
            type="email"
            placeholder="이메일"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="tel"
            placeholder="전화번호"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>추가</button>
      </form>

      <div>
        <h3>연락처 목록</h3>
        {contacts.map(contact => (
          <div key={contact.id} style={{ border: '1px solid #eee', padding: '15px', margin: '10px 0' }}>
            <div><strong>{contact.name}</strong></div>
            <div>{contact.organization} - {contact.position}</div>
            <div>📧 {contact.email}</div>
            <div>📞 {contact.phone}</div>
            <button 
              onClick={() => handleDelete(contact.id)}
              style={{ marginTop: '10px', backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px' }}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPage;