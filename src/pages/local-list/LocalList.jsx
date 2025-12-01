import React from 'react'
import './style.css'
import DocumentViewer from '../../components/doc-viewer-comp/DocViewerComp'
import LocalDocs from '../../components/local-doc/LocalDocs'

const LocalList = () => {
  return (
    <div className='charter-page'>
      <LocalDocs/>
    </div>
  )
}

export default LocalList
