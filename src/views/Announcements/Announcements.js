import React, { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import Toastify from 'toastify-js'
import './Announcement.scss' // Import the custom CSS
import "toastify-js/src/toastify.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AnnouncementForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [recipientGroup, setRecipientGroup] = useState('all')
  const [selectedClass, setSelectedClass] = useState('')
  const [classDetails, setClassDetails] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchClassDetails()
  }, [])

  const fetchClassDetails = () => {
    fetch("http://localhost:10000/api/admin/getClasses", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
    })
      .then(response => {
        if (response.status === 401) {
          console.log(response.status)
          Toastify({
            text: "Please login",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();
          navigate('/login')
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setClassDetails(data))
      .catch(err => {
        console.error('Fetch error:', err)
        Toastify({
          text: "Failed to fetch class details. Please try again.",
          className: "error",
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          }
        }).showToast();
      })
  }

  const handleSubmit = async (e) => {
    try {
      const response = await fetch(`http://localhost:10000/api/notification/save`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, content, recipientGroup, selectedClass }),
      })
      if (response.ok)
        toast.success("Announcement sent")
      else
        toast.warning('some error has occurred please try again')
    } catch (error) {
      toast.warning('some error has occurred')
      console.log(error)
    }
    e.preventDefault()
    // Here you would typically send the announcement data to your backend
    console.log({ title, content, recipientGroup, selectedClass })
    // Reset form after submission
    setTitle('')
    setContent('')
    setRecipientGroup('all')
    setSelectedClass('')
    // Toastify({
    //   text: "Announcement sent successfully!",
    //   duration: 3000,
    //   style: {
    //     background: "linear-gradient(to right, #00b09b, #96c93d)",
    //   }
    // }).showToast();
  }

  return (
    <>
      <ToastContainer />
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
                          {classDetails.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.class}
                            </option>
                          ))}
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
    </>
  )
}

export default AnnouncementForm