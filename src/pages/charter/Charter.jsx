import React from 'react';
import './style.css';
import DocumentViewer from '../../components/doc-viewer-comp/DocViewerComp';

const Charter = () => {
  return (
    <div className='charter-page'>
      <div className='charter-container'>
        <DocumentViewer />
      </div>
    </div>
  );
};

export default Charter;