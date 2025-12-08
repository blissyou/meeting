import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api/axios';



const FileUpload = ({ meetingId, fileInfo, onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  if (!meetingId) {
    return (
      <FileUploadContainer>
        <div>회의비 신청 후 파일을 업로드할 수 있습니다.</div>
      </FileUploadContainer>
    );
  }

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !meetingId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post(`/meetings/${meetingId}/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedFile(null);
      alert('파일이 성공적으로 업로드되었습니다!');
      if (onFileChange) {
        onFileChange(response.data);
      }
      // 강제 새로고침
      window.location.reload();
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      const errorMessage = error.response?.data || '파일 업로드에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/meetings/${meetingId}/file`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo.originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      const errorMessage = error.response?.data || '파일 다운로드에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('파일을 삭제하시겠습니까?')) return;

    try {
      const response = await api.delete(`/meetings/${meetingId}/file`);
      alert('파일이 삭제되었습니다.');
      if (onFileChange) {
        onFileChange(response.data);
      }
      // 강제 새로고침
      window.location.reload();
    } catch (error) {
      console.error('파일 삭제 실패:', error);
      const errorMessage = error.response?.data || '파일 삭제에 실패했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div style={{ minWidth: '120px' }}>
      {fileInfo?.originalFileName ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.8rem', color: '#4299e1' }}>
            📎 파일 있음
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '4px 8px',
                fontSize: '0.75rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              다운로드
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: '4px 8px',
                fontSize: '0.75rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".hwp,.doc,.docx,.pdf,.zip,.rar,.txt"
            style={{ fontSize: '0.75rem', width: '100%' }}
          />
          {selectedFile && (
            <div style={{ fontSize: '0.7rem', color: '#4299e1', marginBottom: '2px' }}>
              선택된 파일: {selectedFile.name}
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              backgroundColor: selectedFile && !uploading ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed'
            }}
          >
            {uploading ? '업로드중...' : '업로드'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;