import React from 'react';
import FileUpload from './FileUpload';

const MeetingDetailModal = ({ meeting, isOpen, onClose, onUpdate, onEdit, onDelete }) => {
  if (!isOpen || !meeting) return null;

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: '승인대기',
      APPROVED: '승인',
      REJECTED: '거부',
      PAID: '지급완료'
    };
    return statusMap[status] || status;
  };

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
        padding: '24px',
        width: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
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
          <h2 style={{ margin: 0, color: '#2d3748' }}>회의 상세 정보</h2>
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

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                회의 제목
              </label>
              <div style={{ padding: '8px 12px', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
                {meeting.title}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                  날짜
                </label>
                <div style={{ padding: '8px 12px', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
                  {new Date(meeting.date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                  시간
                </label>
                <div style={{ padding: '8px 12px', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
                  {meeting.meetingAt?.slice(0, 5)} - {meeting.meetingTo?.slice(0, 5)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                  장소
                </label>
                <div style={{ padding: '8px 12px', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
                  {meeting.place}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                  비용
                </label>
                <div style={{ padding: '8px 12px', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
                  {meeting.cost?.toLocaleString()}원
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                상태
              </label>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f7fafc', 
                borderRadius: '6px',
                display: 'inline-block'
              }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  backgroundColor: meeting.status === 'PENDING' ? '#ffeaa7' : 
                                 meeting.status === 'APPROVED' ? '#74b9ff' :
                                 meeting.status === 'REJECTED' ? '#fd79a8' : '#55efc4',
                  color: meeting.status === 'PENDING' ? '#d63031' : 'white'
                }}>
                  {getStatusText(meeting.status)}
                </span>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                상세 설명
              </label>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f7fafc', 
                borderRadius: '6px',
                minHeight: '80px',
                whiteSpace: 'pre-wrap'
              }}>
                {meeting.description}
              </div>
            </div>

            {meeting.participantList && meeting.participantList.length > 0 && (
              <div>
                <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '8px' }}>
                  회의 참가자 ({meeting.participantList.length}명)
                </label>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f7fafc', 
                  borderRadius: '6px'
                }}>
                  {meeting.participantList.map((participant, index) => (
                    <div key={participant.contactId} style={{
                      padding: '8px 12px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      marginBottom: index < meeting.participantList.length - 1 ? '8px' : '0',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#2d3748' }}>{participant.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                            {participant.organization} {participant.position && `· ${participant.position}`}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#718096' }}>
                          {participant.email && <div>{participant.email}</div>}
                          {participant.phone && <div>{participant.phone}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {meeting.status === 'APPROVED' && (
              <div>
                <label style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '8px' }}>
                  증빙 문서
                </label>
                <FileUpload 
                  meetingId={meeting.id}
                  fileInfo={{
                    originalFileName: meeting.originalFileName,
                    fileSize: meeting.fileSize,
                    contentType: meeting.contentType
                  }}
                  onFileChange={onUpdate}
                />
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: '16px' 
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {meeting?.status === 'PENDING' && (
              <>
                <button
                  onClick={() => {
                    onEdit(meeting);
                    onClose();
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00b894',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    onDelete(meeting.id);
                    onClose();
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#e17055',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  삭제
                </button>
              </>
            )}

          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailModal;