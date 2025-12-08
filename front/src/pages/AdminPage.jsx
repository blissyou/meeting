import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
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
  max-width: 1400px;
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
  max-width: 1400px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
`;

const Button = styled.button`
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &.edit {
    background-color: #28a745;
    color: white;
  }
  
  &.delete {
    background-color: #dc3545;
    color: white;
  }
`;

const Form = styled.form`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  margin: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin-bottom: 1rem;
  color: #2d3748;
  font-size: 1.25rem;
`;

const ModalDescription = styled.p`
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled.button`
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #cbd5e0;
  }
`;

const ClickableRow = styled.tr`
  cursor: pointer;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

const FileDownloadButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  
  &:hover {
    background: #138496;
  }
`;

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [newUser, setNewUser] = useState({
    name: '', username: '', password: '', department: '', email: '', phone: '', role: 'USER'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchMeetings();
  }, []);

  useEffect(() => {
    fetchMeetings(statusFilter);
  }, [statusFilter]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
    }
  };

  const fetchMeetings = async (status = null) => {
    try {
      const url = status && status !== 'ALL' ? `/meetings?status=${status}` : '/meetings';
      const response = await api.get(url);
      setMeetings(response.data);
    } catch (error) {
      console.error('회의 목록 조회 실패:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, newUser);
        alert('사용자가 성공적으로 수정되었습니다.');
        setEditingUser(null);
      } else {
        await api.post('/users', newUser);
        alert('사용자가 성공적으로 생성되었습니다.');
      }
      setNewUser({ name: '', username: '', password: '', department: '', email: '', phone: '', role: 'USER' });
      setShowUserForm(false);
      fetchUsers();
    } catch (error) {
      console.error('사용자 처리 실패:', error);
      const errorMessage = error.response?.data || '사용자 처리에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      username: user.username,
      password: '',
      department: user.department,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setShowUserForm(true);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewUser({ name: '', username: '', password: '', department: '', email: '', phone: '', role: 'USER' });
    setShowUserForm(false);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('사용자 삭제 실패:', error);
      }
    }
  };

  const handleUpdateMeetingStatus = async (id, status) => {
    try {
      await api.patch(`/meetings/${id}/status?status=${status}`);
      fetchMeetings(statusFilter);
    } catch (error) {
      console.error('회의 상태 업데이트 실패:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const handleExcelUpload = async () => {
    if (!uploadFile) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    
    try {
      const response = await api.post('/users/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert(`엑셀 업로드 완료: ${response.data.successCount}명 추가, ${response.data.failCount}명 실패`);
      setUploadFile(null);
      document.getElementById('excel-upload').value = '';
      fetchUsers();
    } catch (error) {
      console.error('엑셀 업로드 실패:', error);
      alert('엑셀 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const response = await api.get('/users/sample-excel', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample-users.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('샘플 파일 다운로드 실패:', error);
      alert('샘플 파일 다운로드에 실패했습니다.');
    }
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
          <Title>관리자 페이지</Title>
          <UserInfo>
            <UserName>환영합니다, {user?.name}님</UserName>
            <LogoutButton onClick={logout}>로그아웃</LogoutButton>
          </UserInfo>
        </Header>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionTitle>사용자 관리</SectionTitle>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button 
              className="edit" 
              onClick={handleDownloadSample}
              style={{ backgroundColor: '#17a2b8' }}
            >
              엑셀 양식 다운로드
            </Button>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setUploadFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="excel-upload"
            />
            <label htmlFor="excel-upload">
              <Button as="span" className="edit" style={{ cursor: 'pointer' }}>
                엑셀 업로드
              </Button>
            </label>

            <Button className="edit" onClick={() => setShowUserForm(!showUserForm)}>
              {editingUser ? '수정 취소' : '사용자 추가'}
            </Button>
          </div>
        </div>
        
        {uploadFile && (
          <div style={{ 
            backgroundColor: '#e6f3ff', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            border: '1px solid #b3d9ff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#0066cc', marginBottom: '5px' }}>
                선택된 파일: {uploadFile.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                엑셀 파일 형식: 이름, 사용자명, 비밀번호, 학과, 이메일, 전화번호, 권한(USER/ADMIN)
              </div>
            </div>
            <Button 
              className="edit" 
              onClick={handleExcelUpload}
              disabled={uploading}
              style={{ 
                backgroundColor: uploading ? '#ccc' : '#28a745',
                padding: '8px 16px',
                fontSize: '0.9rem'
              }}
            >
              {uploading ? '업로드중...' : '업로드 실행'}
            </Button>
          </div>
        )}
        
        {showUserForm && (
          <Form onSubmit={handleCreateUser}>
            <h4>{editingUser ? '사용자 수정' : '사용자 추가'}</h4>
            <Input
              placeholder="이름"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
            />
            <Input
              placeholder="사용자명"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              required
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
            <Input
              placeholder="학과"
              value={newUser.department}
              onChange={(e) => setNewUser({...newUser, department: e.target.value})}
              required
            />

            <Input
              type="email"
              placeholder="이메일"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
            <Input
              type="tel"
              placeholder="전화번호"
              value={newUser.phone}
              onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
            />
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="USER">일반 사용자</option>
              <option value="ADMIN">관리자</option>
            </Select>
            <div>
              <Button type="submit" className="edit">
                {editingUser ? '수정' : '추가'}
              </Button>
              {editingUser && (
                <Button type="button" onClick={handleCancelEdit} style={{marginLeft: '10px', backgroundColor: '#6c757d'}}>
                  취소
                </Button>
              )}
            </div>
          </Form>
        )}

        <Table>
          <thead>
            <tr>
              <Th>이름</Th>
              <Th>사용자명</Th>
              <Th>학과</Th>
              <Th>이메일</Th>
              <Th>전화번호</Th>
              <Th>권한</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.username}</Td>
                <Td>{user.department}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phone || '-'}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <Button className="edit" onClick={() => handleEditUser(user)}>
                    수정
                  </Button>
                  <Button className="delete" onClick={() => handleDeleteUser(user.id)}>
                    삭제
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SectionTitle>회의비 승인 관리</SectionTitle>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          >
            <option value="ALL">전체</option>
            <option value="PENDING">승인대기</option>
            <option value="APPROVED">승인</option>
            <option value="REJECTED">거부</option>
            <option value="PAID">지급완료</option>
          </Select>
        </div>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>신청 정보</Th>
                <Th>일시 및 장소</Th>
                <Th>비용</Th>
                <Th>상태 관리</Th>
              </tr>
            </thead>
            <tbody>
              {meetings.map(meeting => {
                const user = users.find(u => u.id === meeting.userId);
                return (
                  <ClickableRow key={meeting.id} onClick={() => setSelectedMeeting(meeting)}>
                    <Td>
                      <div style={{fontWeight: '600', marginBottom: '4px'}}>{meeting.title}</div>
                      <div style={{fontSize: '0.85rem', color: '#718096'}}>
                        신청자: {user?.name || '알 수 없음'}
                      </div>
                      {meeting.originalFileName && (
                        <div style={{fontSize: '0.8rem', color: '#4299e1', marginTop: '4px'}}>
                          📎 {meeting.originalFileName}
                          <FileDownloadButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileDownload(meeting.id, meeting.originalFileName);
                            }}
                          >
                            다운로드
                          </FileDownloadButton>
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div>{new Date(meeting.date).toLocaleDateString()}</div>
                      <div style={{fontSize: '0.85rem', color: '#718096'}}>
                        {meeting.meetingAt} - {meeting.meetingTo}
                      </div>
                      <div style={{fontSize: '0.85rem', color: '#718096'}}>
                        {meeting.place}
                      </div>
                    </Td>
                    <Td style={{fontWeight: '600', color: '#2d3748'}}>
                      {meeting.cost?.toLocaleString()}원
                    </Td>
                    <Td onClick={(e) => e.stopPropagation()}>
                      <div style={{marginBottom: '0.5rem'}}>
                        <StatusBadge className={meeting.status}>
                          {getStatusText(meeting.status)}
                        </StatusBadge>
                      </div>
                      <Select
                        value={meeting.status}
                        onChange={(e) => handleUpdateMeetingStatus(meeting.id, e.target.value)}
                        style={{width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0'}}
                      >
                        <option value="PENDING">승인대기</option>
                        <option value="APPROVED">승인</option>
                        <option value="REJECTED">거부</option>
                        <option value="PAID">지급완료</option>
                      </Select>
                    </Td>
                  </ClickableRow>
                );
              })}
            </tbody>
          </Table>
        </TableContainer>
      </Section>
      </ContentWrapper>
      
      {selectedMeeting && (
        <Modal onClick={() => setSelectedMeeting(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{selectedMeeting.title}</ModalTitle>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem'}}>신청자</div>
                <div style={{fontWeight: '600', color: '#2d3748'}}>
                  {users.find(u => u.id === selectedMeeting.userId)?.name || '알 수 없음'}
                </div>
              </div>
              
              <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem'}}>비용</div>
                <div style={{fontWeight: '600', color: '#e53e3e', fontSize: '1.125rem'}}>
                  {selectedMeeting.cost?.toLocaleString()}원
                </div>
              </div>
            </div>
            
            <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px solid #bee3f8'}}>
              <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem'}}>회의 일정</div>
              <div style={{fontWeight: '600', color: '#2d3748'}}>
                📅 {new Date(selectedMeeting.date).toLocaleDateString()}
              </div>
              <div style={{color: '#4a5568', marginTop: '0.25rem'}}>
                🕐 {selectedMeeting.meetingAt} - {selectedMeeting.meetingTo}
              </div>
              <div style={{color: '#4a5568', marginTop: '0.25rem'}}>
                📍 {selectedMeeting.place || '장소 미지정'}
              </div>
            </div>
            
            
            <div style={{marginBottom: '1.5rem'}}>
              <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem', fontWeight: '600'}}>회의 설명</div>
              <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', lineHeight: '1.6', color: '#4a5568'}}>
                {selectedMeeting.description || '설명이 없습니다.'}
              </div>
            </div>
            
            {selectedMeeting.participants && (
              <div style={{marginBottom: '1.5rem'}}>
                <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem', fontWeight: '600'}}>참여자</div>
                <div style={{padding: '1rem', backgroundColor: '#fff5f5', borderRadius: '8px', border: '1px solid #fed7d7'}}>
                  <div style={{color: '#2d3748'}}>👥 {selectedMeeting.participants}</div>
                </div>
              </div>
            )}
            
            {selectedMeeting.originalFileName && (
              <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0fff4', borderRadius: '8px', border: '1px solid #9ae6b4'}}>
                <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem'}}>첨부파일</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <span style={{color: '#2d3748'}}>📎 {selectedMeeting.originalFileName}</span>
                  <FileDownloadButton 
                    onClick={() => handleFileDownload(selectedMeeting.id, selectedMeeting.originalFileName)}
                  >
                    다운로드
                  </FileDownloadButton>
                </div>
              </div>
            )}
            <CloseButton onClick={() => setSelectedMeeting(null)}>
              닫기
            </CloseButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AdminPage;