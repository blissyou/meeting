import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import ParticipantSelector from '../components/ParticipantSelector';

const MeetingDetailPage = () => {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchMeetingDetail();
    fetchParticipants();
  }, [meetingId]);

  const fetchMeetingDetail = async () => {
    try {
      const response = await axios.get(`/api/meetings/${meetingId}`);
      setMeeting(response.data);
    } catch (error) {
      console.error('회의 상세 조회 실패:', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`/api/participants/meeting/${meetingId}`);
      setParticipants(response.data);
    } catch (error) {
      console.error('참가자 조회 실패:', error);
    }
  };

  if (!meeting) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{meeting.title}</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>회의 정보</h3>
        <p><strong>날짜:</strong> {new Date(meeting.date).toLocaleDateString()}</p>
        <p><strong>시간:</strong> {meeting.meetingAt} - {meeting.meetingTo}</p>
        <p><strong>장소:</strong> {meeting.place}</p>
        <p><strong>비용:</strong> {meeting.cost?.toLocaleString()}원</p>
        <p><strong>설명:</strong> {meeting.description}</p>
      </div>

      <ParticipantSelector 
        meetingId={meetingId} 
        onParticipantsChange={fetchParticipants}
      />

      <div style={{ marginTop: '30px' }}>
        <h3>현재 참가자</h3>
        {participants.length === 0 ? (
          <p>아직 참가자가 없습니다.</p>
        ) : (
          participants.map(participant => (
            <div key={participant.id} style={{ 
              border: '1px solid #ddd', 
              padding: '10px', 
              margin: '5px 0',
              borderRadius: '5px'
            }}>
              <strong>{participant.contactName}</strong> - {participant.role}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingDetailPage;