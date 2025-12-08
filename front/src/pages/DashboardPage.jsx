import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import styled from 'styled-components';
import FileUpload from '../components/FileUpload';
import ParticipantModal from '../components/ParticipantModal';
import MeetingDetailModal from '../components/MeetingDetailModal';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem 2rem 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: #4a5568;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #fc466b 0%, #3f5efb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(252, 70, 107, 0.3);
  }
`;

const Section = styled.div`
  margin-bottom: 3rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 1200px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 2rem;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const StatsCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  
  p {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const Form = styled.form`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid rgba(255,255,255,0.2);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  resize: vertical;
  min-height: 100px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Th = styled.th`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  
  &:first-child {
    border-top-left-radius: 12px;
  }
  
  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #4a5568;
  
  &:hover {
    background-color: #f8fafc;
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  
  &.PENDING {
    background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
    color: #d63031;
  }
  
  &.APPROVED {
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    color: white;
  }
  
  &.REJECTED {
    background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
    color: white;
  }
  
  &.PAID {
    background: linear-gradient(135deg, #55efc4 0%, #00b894 100%);
    color: white;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  
  &.edit {
    background: linear-gradient(135deg, #00b894 0%, #55efc4 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
    }
  }
  
  &.delete {
    background: linear-gradient(135deg, #e17055 0%, #fd79a8 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(225, 112, 85, 0.3);
    }
  }
`;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    department: '',
    email: '',
    phone: ''
  });
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    meetingAt: '',
    meetingTo: '',
    cost: '',
    place: ''
  });
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    fetchMeetings(statusFilter);
  }, [statusFilter]);

  const fetchMeetings = async (status = null) => {
    try {
      const url = status && status !== 'ALL' ? `/meetings?status=${status}` : '/meetings';
      const response = await api.get(url);
      // 현재 사용자의 회의만 필터링
      const userMeetings = response.data.filter(meeting => meeting.userId === user.id);
      setMeetings(userMeetings);
    } catch (error) {
      console.error('회의 목록 조회 실패:', error);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const meetingData = {
        ...newMeeting,
        userId: user.id,
        cost: parseInt(newMeeting.cost),
        meetingAt: newMeeting.meetingAt + ':00',
        meetingTo: newMeeting.meetingTo + ':00',
        participantIds: selectedParticipants.map(p => p.id)
      };
      
      if (editingMeeting) {
        await api.put(`/meetings/${editingMeeting.id}`, meetingData);
        setEditingMeeting(null);
      } else {
        await api.post('/meetings', meetingData);
      }
      
      setNewMeeting({
        title: '',
        description: '',
        date: '',
        meetingAt: '',
        meetingTo: '',
        cost: '',
        place: ''
      });
      setSelectedFile(null);
      setSelectedParticipants([]);
      fetchMeetings();
      alert(editingMeeting ? '회의비가 성공적으로 수정되었습니다.' : '회의비가 성공적으로 신청되었습니다.');
    } catch (error) {
      console.error('회의 처리 실패:', error);
      const errorMessage = error.response?.data || '회의비 처리에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleInputChange = (field, value) => {
    setNewMeeting(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setNewMeeting({
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      meetingAt: meeting.meetingAt?.slice(0, 5) || '',
      meetingTo: meeting.meetingTo?.slice(0, 5) || '',
      cost: meeting.cost?.toString() || '',
      place: meeting.place || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await api.delete(`/meetings/${id}?userId=${user.id}`);
        fetchMeetings(statusFilter);
        alert('회의비가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('삭제 실패:', error);
        const errorMessage = error.response?.data || '삭제에 실패했습니다.';
        alert(errorMessage);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMeeting(null);
    setNewMeeting({
      title: '',
      description: '',
      date: '',
      meetingAt: '',
      meetingTo: '',
      cost: '',
      place: ''
    });
    setSelectedFile(null);
    setSelectedParticipants([]);
  };

  const handleParticipantsConfirm = (participants) => {
    setSelectedParticipants(participants);
  };

  const handleRowClick = (meeting, e) => {
    // 버튼 클릭 시에는 모달을 열지 않음
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    setSelectedMeeting(meeting);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalUpdate = () => {
    fetchMeetings();
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // 비밀번호 변경 시 유효성 검사
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        alert('현재 비밀번호를 입력해주세요.');
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
      }
    }
    
    try {
      const updateData = {
        name: profileData.name,
        department: profileData.department,
        email: profileData.email,
        phone: profileData.phone,
        userId: user.id
      };
      
      // 비밀번호 변경 시에만 비밀번호 필드 추가
      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.password = profileData.newPassword;
      }
      
      await api.put(`/users/${user.id}`, updateData);
      alert('정보가 성공적으로 업데이트되었습니다.');
      setIsProfileModalOpen(false);
      // 로그인 정보 업데이트
      const updatedUser = { ...user, name: profileData.name, department: profileData.department, email: profileData.email, phone: profileData.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('정보 업데이트 실패:', error);
      const errorMessage = error.response?.data || '정보 업데이트에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const openProfileModal = () => {
    setProfileData({
      name: user.name || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      department: user.department || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setIsProfileModalOpen(true);
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: '승인대기',
      APPROVED: '승인',
      REJECTED: '거부',
      PAID: '지급완료'
    };
    return statusMap[status] || status;
  };

  const totalCost = meetings
    .filter(m => m.status === 'PAID')
    .reduce((sum, m) => sum + (m.cost || 0), 0);

  const handleFileDownload = async (meetingId, fileName) => {
    try {
      const response = await api.get(`/meetings/${meetingId}/file`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  return (
    <Container className="main-wrap">
      <ContentWrapper>
        <Header>
          <Title>회의비 관리 시스템</Title>
          <UserInfo>
            <UserName>환영합니다, {user?.name}님</UserName>
            <LogoutButton onClick={openProfileModal} style={{marginRight: '10px', background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)'}}>내 정보</LogoutButton>
            <LogoutButton onClick={logout}>로그아웃</LogoutButton>
          </UserInfo>
        </Header>

        <Section>
          <SectionTitle>회의비 통계</SectionTitle>
          <StatsCard>
            <p>지급된 총 회의비: {totalCost.toLocaleString()}원</p>
          </StatsCard>
        </Section>

      <Section>
        <SectionTitle>{editingMeeting ? '회의비 수정' : '회의비 신청'}</SectionTitle>
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              type="text"
              placeholder="회의비 제목"
              value={newMeeting.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
            <Input
              type="date"
              value={newMeeting.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </FormRow>
          
          <FormRow>
            <Input
              type="time"
              placeholder="시작 시간"
              value={newMeeting.meetingAt}
              onChange={(e) => handleInputChange('meetingAt', e.target.value)}
              required
            />
            <Input
              type="time"
              placeholder="종료 시간"
              value={newMeeting.meetingTo}
              onChange={(e) => handleInputChange('meetingTo', e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="신청 비용 (원)"
              value={newMeeting.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="장소"
              value={newMeeting.place}
              onChange={(e) => handleInputChange('place', e.target.value)}
              required
            />
          </FormRow>
          
          <TextArea
            placeholder="회의비 사용 내역 및 상세 설명"
            value={newMeeting.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />
          
          <div style={{margin: '1rem 0', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '10px', background: 'white'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <div style={{fontWeight: '600', color: '#2d3748'}}>회의 참가자 (선택사항)</div>
              <button
                type="button"
                onClick={() => setIsParticipantModalOpen(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                참가자 선택
              </button>
            </div>
            {selectedParticipants.length > 0 ? (
              <div style={{color: '#4299e1', fontSize: '0.9rem'}}>
                선택된 참가자: {selectedParticipants.length}명
              </div>
            ) : (
              <div style={{color: '#718096', fontSize: '0.9rem', fontStyle: 'italic'}}>
                참가자를 선택하지 않았습니다.
              </div>
            )}
          </div>
          

          
          <Button type="submit">{editingMeeting ? '수정 완료' : '회의비 신청'}</Button>
          {editingMeeting && (
            <Button type="button" onClick={handleCancelEdit} style={{marginLeft: '10px', backgroundColor: '#6c757d'}}>취소</Button>
          )}
        </Form>
      </Section>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SectionTitle>내 회의비 신청 내역</SectionTitle>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              border: '2px solid #e2e8f0',
              background: 'white',
              fontSize: '0.9rem'
            }}
          >
            <option value="ALL">전체</option>
            <option value="PENDING">승인대기</option>
            <option value="APPROVED">승인</option>
            <option value="REJECTED">거부</option>
            <option value="PAID">지급완료</option>
          </select>
        </div>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>제목</Th>
                <Th>날짜 및 시간</Th>
                <Th>비용</Th>
                <Th>상태</Th>
                <Th>작업</Th>
              </tr>
            </thead>
            <tbody>
              {meetings.map(meeting => (
                <tr 
                  key={meeting.id} 
                  onClick={(e) => handleRowClick(meeting, e)}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}
                >
                  <Td>
                    <div style={{fontWeight: '600', marginBottom: '4px'}}>{meeting.title}</div>
                    <div style={{fontSize: '0.85rem', color: '#718096'}}>{meeting.place}</div>
                  </Td>
                  <Td>
                    <div>{new Date(meeting.date).toLocaleDateString()}</div>
                    <div style={{fontSize: '0.85rem', color: '#718096'}}>
                      {meeting.meetingAt?.slice(0, 5)} - {meeting.meetingTo?.slice(0, 5)}
                    </div>
                  </Td>
                  <Td style={{fontWeight: '600', color: '#2d3748'}}>
                    {meeting.cost?.toLocaleString()}원
                  </Td>
                  <Td>
                    <StatusBadge className={meeting.status}>
                      {getStatusText(meeting.status)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <div style={{color: '#718096', fontSize: '0.9rem'}}>
                      클릭하여 상세보기
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        </Section>
        
        <ParticipantModal
          isOpen={isParticipantModalOpen}
          onClose={() => setIsParticipantModalOpen(false)}
          onConfirm={handleParticipantsConfirm}
          selectedParticipants={selectedParticipants}
        />
        
        <MeetingDetailModal
          meeting={selectedMeeting}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdate={handleDetailModalUpdate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {isProfileModalOpen && (
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
              padding: '24px',
              width: '400px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '16px'
              }}>
                <h3 style={{ margin: 0, color: '#2d3748' }}>내 정보 수정</h3>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
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
              
              <form onSubmit={handleProfileUpdate}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>이름</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>현재 비밀번호</label>
                  <input
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    placeholder="비밀번호를 변경하려면 입력"
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>새 비밀번호</label>
                  <input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    placeholder="새 비밀번호 입력"
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>새 비밀번호 확인</label>
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    placeholder="새 비밀번호 다시 입력"
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>학과/부서</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>이메일</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>전화번호</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    style={{
                      padding: '10px 20px',
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
                    type="submit"
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
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default DashboardPage;