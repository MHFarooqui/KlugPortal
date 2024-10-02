import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
} from '@coreui/react'
import './Announcement.scss' // Import the custom CSS

function AnnouncementForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [recipientGroup, setRecipientGroup] = useState('all')
  const [selectedClass, setSelectedClass] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the announcement data to your backend
    console.log({ title, content, recipientGroup, selectedClass })
    // Reset form after submission
    setTitle('')
    setContent('')
    setRecipientGroup('all')
    setSelectedClass('')
  }

  return (
    <CContainer className="container-custom">
      <CRow className="justify-content-center">
        <CCol xs={12} md={10} lg={8}>
          <CCard className="shadow-sm border-0 card-custom">
            <CCardHeader className="card-header-custom">
              <h2 className="mb-0">Send Announcement</h2>
            </CCardHeader>
            <CCardBody className="card-body-custom">
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol>
                    <CFormInput
                      type="text"
                      id="announcementTitle"
                      label="Announcement Title"
                      className="form-control-custom"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormTextarea
                      id="announcementContent"
                      label="Announcement Content"
                      rows={5}
                      className="form-control-custom"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormSelect
                      id="recipientGroup"
                      label="Recipient Group"
                      className="form-control-custom"
                      value={recipientGroup}
                      onChange={(e) => setRecipientGroup(e.target.value)}
                    >
                      <option value="all">All Users</option>
                      <option value="class">Specific Class</option>
                    </CFormSelect>
                  </CCol>
                  {recipientGroup === 'class' && (
                    <CCol md={6}>
                      <CFormSelect
                        id="classSelect"
                        label="Select Class"
                        className="form-control-custom"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        required={recipientGroup === 'class'}
                      >
                        <option value="">Choose...</option>
                        <option value="class1">Class 1</option>
                        <option value="class2">Class 2</option>
                        <option value="class3">Class 3</option>
                      </CFormSelect>
                    </CCol>
                  )}
                </CRow>
                <CRow className="mt-4">
                  <CCol className="text-center">
                    <CButton type="submit" color="primary" size="lg" className="button-custom">
                      Send Announcement
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AnnouncementForm;