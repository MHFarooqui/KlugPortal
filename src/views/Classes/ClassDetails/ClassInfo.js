import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CListGroup,
  CListGroupItem,
  CFormInput,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CAlert,
} from '@coreui/react'
import { cilSearch, cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { randomColor } from 'randomcolor'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import './ClassInfo.scss'

function ClassInfo() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectTeacherInfo, setSubjectTeacherInfo] = useState([])
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editIncharge, setEditIncharge] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [newTeacherId, setNewTeacherId] = useState('')
  const [teachers, setTeachers] = useState([])
  const [updateMessage, setUpdateMessage] = useState(null)
  const [classIncharge, setClassIncharge] = useState({})

  const url = "https://eklearnapi.onrender.com"

  useEffect(() => {
    fetchClassDetails()
    fetchClassTeachersDetails()
    fetchTeachers()
    fetchClassIncharge()
  }, [id])

  const fetchTeachers = () => {
    fetch(`${url}/api/admin/allTeacher`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => setTeachers(data))
      .catch(err => console.error('Fetch error:', err))
  }

  const fetchClassDetails = () => {
    fetch(`${url}/api/admin/Students/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => setStudents(data))
      .catch(err => console.error('Fetch error:', err))
  }

  const fetchClassTeachersDetails = () => {
    fetch(`${url}/api/admin/teachers/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => setSubjectTeacherInfo(data))
      .catch(err => console.error('Fetch error:', err))
  }

  const fetchClassIncharge = () => {
    fetch(`${url}/api/admin/ClassIncharge/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => setClassIncharge(data))
      .catch(err => console.error('Fetch error:', err))
  }

  const filteredStudents = students.filter(student =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUpdateTeacher = (teacher) => {
    setEditingTeacher(teacher)
    setNewTeacherId(teacher.teacher_id)
    setEditIncharge(false)
    setEditModalVisible(true)
  }

  const handleUpdateInCharge = () => {
    setEditIncharge(true)
    setEditingTeacher(classIncharge)
    setNewTeacherId(classIncharge.teacher_id)
    setEditModalVisible(true)
  }

  const handleSaveTeacher = () => {
    if (editIncharge) {
      handleSaveInCharge()
      return
    }

    const newTeacher = teachers.find(teacher => teacher.id == newTeacherId)
    if (!newTeacher) {
      console.error('Selected teacher not found')
      return
    }

    const updatedTeachers = subjectTeacherInfo.map(teacher =>
      teacher.subject_name === editingTeacher.subject_name
        ? { ...teacher, teacher_id: newTeacherId, teacher_name: newTeacher.teacher_name }
        : teacher
    )

    setSubjectTeacherInfo(updatedTeachers)
    setEditModalVisible(false)

    const updatedSubject = updatedTeachers.find(teacher => teacher.subject_name === editingTeacher.subject_name)
    const message = `Teacher updated for ${updatedSubject.subject_name}:
    New Teacher: ${updatedSubject.teacher_name} (ID: ${updatedSubject.teacher_id})`
    setUpdateMessage(message)

    fetch(`${url}/api/admin/updateTeacher/${updatedSubject.id}/${updatedSubject.teacher_id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }
    }).then(response => {
      if (response.status === 401) {
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
      .then(data => console.log('Teacher updated successfully', data))
      .catch(err => console.error('Error updating teacher:', err))
  }

  const handleSaveInCharge = () => {
    const newInCharge = teachers.find(teacher => teacher.id == newTeacherId)
    if (!newInCharge) {
      console.error('Selected teacher not found')
      return
    }

    setClassIncharge({ ...classIncharge, teacher_id: newTeacherId, teacher_name: newInCharge.teacher_name })
    setEditModalVisible(false)
    setEditIncharge(false)

    const message = `Class In-Charge updated:
    New In-Charge: ${newInCharge.teacher_name} (ID: ${newInCharge.id})`
    setUpdateMessage(message)

    fetch(`http://localhost:10000/api/admin/updateClassIncharge/${id}/${newTeacherId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }
    }).then(response => {
      if (response.status === 401) {
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
      .then(data => console.log('Class In-Charge updated successfully', data))
      .catch(err => console.error('Error updating Class In-Charge:', err))
  }

  return (
    <CContainer fluid className="classroom-dashboard">
      {updateMessage && (
        <CAlert color="info" dismissible onClose={() => setUpdateMessage(null)}>
          {updateMessage}
        </CAlert>
      )}
      <CRow>
        <CCol md={6}>
          <CCard className="mb-4 student-list-card">
            <CCardHeader>Students</CCardHeader>
            <CCardBody>
              <div className="student-count mb-3">
                Total Students: {students.length}
              </div>
              <div className="search-bar mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <CIcon icon={cilSearch} size="lg" className="search-icon" />
              </div>
              <CListGroup>
                {filteredStudents.map((student) => (
                  <CListGroupItem key={student.id} className="d-flex justify-content-between align-items-center student-item">
                    <div className="d-flex align-items-center">
                      <span>{student.student_name}</span>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard className="mb-4 class-info-card">
            <CCardHeader>Class Information</CCardHeader>
            <CCardBody>
              <h4 className="mb-3">Subjects and Teachers</h4>
              <CListGroup>
                {subjectTeacherInfo.map((info, index) => (
                  <CListGroupItem key={index} className="d-flex justify-content-between align-items-center subject-item">
                    <div className="d-flex align-items-center">
                      <div className="subject-color-indicator me-3" style={{ backgroundColor: randomColor() }}></div>
                      <span>{info.subject_name}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="me-3">{info.teacher_name}</span>
                      <CButton color="light" size="sm" onClick={() => handleUpdateTeacher(info)}>
                        <CIcon icon={cilPencil} size="sm" />
                      </CButton>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
              <div className="d-flex justify-content-between class-incharge mt-4">
                <div>
                  <h4>Class In-Charge</h4>
                  <p>{classIncharge.teacher_name}</p>
                </div>
                <CButton color="light" onClick={handleUpdateInCharge}>
                  <CIcon icon={cilPencil} />
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{editIncharge ? 'Edit Class In-Charge' : 'Edit Teacher'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <label htmlFor="subjectName" className="form-label">
                {editIncharge ? 'In-Charge' : 'Subject'}
              </label>
              <CFormInput
                type="text"
                id="subjectName"
                value={editIncharge ? classIncharge.teacher_name : editingTeacher?.subject_name || ''}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="teacherSelect" className="form-label">Select Teacher</label>
              <CFormSelect
                id="teacherSelect"
                value={newTeacherId}
                onChange={(e) => setNewTeacherId(e.target.value)}
              >
                <option value="">Choose a teacher...</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.teacher_name}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setEditModalVisible(false); setEditIncharge(false); }}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveTeacher}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default ClassInfo;

