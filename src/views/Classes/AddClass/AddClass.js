import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import Toastify from 'toastify-js'
import { useNavigate } from 'react-router-dom' 
import "toastify-js/src/toastify.css"
import 'react-toastify/dist/ReactToastify.css';

const ClassCreationForm = () => {
  const [className, setClassName] = useState('')
  const [classInCharge, setClassInCharge] = useState('')
  const [subjects, setSubjects] = useState([])
  const [newSubject, setNewSubject] = useState({ name: '', teacher: '' })
  const [teacherDetails, setTeacherDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachersDetails()
  }, [])

  const fetchTeachersDetails = () => {
    fetch("http://localhost:10000/api/admin/allTeacher", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
    })
      .then(response => {
        if (response.status === 401) {
          navigate('/login')
        }
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => setTeacherDetails(data))
      .catch(err => console.error('Fetch error:', err))
  }

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.teacher) {
      setSubjects([...subjects, newSubject])
      setNewSubject({ name: '', teacher: '' })
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:10000/api/admin/addClass", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ classInCharge, subjects, className })
      })
      if (response.ok)
        toast.success("onboarded successfully")
      else
        toast.warning('some error has occurred please check the sheet')
    } catch (error) {
      toast.warning('some error has occurred')
      console.log(error)
    }
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Create New Class</strong>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="className">Class Name</CFormLabel>
                <CFormInput
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="classInCharge">Class In-charge</CFormLabel>
                <CFormSelect
                  id="classInCharge"
                  value={classInCharge}
                  onChange={(e) => setClassInCharge(e.target.value)}
                  required
                >
                  <option value="">Select Class In-charge</option>
                  {teacherDetails.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.teacher_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={5}>
                <CFormLabel htmlFor="subjectName">Subject Name</CFormLabel>
                <CFormInput
                  id="subjectName"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </CCol>
              <CCol md={5}>
                <CFormLabel htmlFor="subjectTeacher">Subject Teacher</CFormLabel>
                <CFormSelect
                  id="subjectTeacher"
                  value={newSubject.teacher}
                  onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                >
                  <option value="">Select Teacher</option>
                  {teacherDetails.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.teacher_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2} className="d-flex align-items-end">
                <CButton color="primary" onClick={handleAddSubject}>
                  Add Subject
                </CButton>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Subject</CTableHeaderCell>
                      <CTableHeaderCell>Teacher</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {subjects.map((subject, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{subject.name}</CTableDataCell>
                        <CTableDataCell>
                          {teacherDetails.find((t) => t.id === parseInt(subject.teacher))?.teacher_name}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>

            <CRow>
              <CCol>
                <CButton type="submit" color="success">
                  Create Class
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default ClassCreationForm