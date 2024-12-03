import React, { useEffect, useState } from 'react'
import { CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormSelect } from '@coreui/react'
import { MdAssignmentAdd, MdClose } from "react-icons/md"
import './Classes.scss'
import KlugAddBtn from '../../../components/shared/buttons/klugAddBtn'
import Toastify from 'toastify-js'
import { useNavigate } from 'react-router-dom' 
import "toastify-js/src/toastify.css"

const ManageClass = () => {
  const [classDetails, setClassDetails] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const navigate = useNavigate();

  let url = "https://eklearnapi.onrender.com";

  useEffect(() => {
    fetchClassDetails()
    fetchTeachers()
  }, [])

  const fetchClassDetails = () => {
    fetch(`${url}/api/admin/unassigedClass`, {
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
      .then(data => setClassDetails(data))
      .catch(err => console.error('Fetch error:', err))
  }

  const fetchTeachers = () => {
    fetch(`${url}/api/admin/allTeacher`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
    })
      .then(response => {
        if(response.status === 401){
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
      .then(data => setTeachers(data))
      .catch(err => console.error('Fetch error:', err))
  }

  const fetchSubjects = (classId) => {
    fetch(`${url}/api/admin/subjects/${classId}`, {
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
      .then(data => { console.log(data); setSubjects(data) })
      .catch(err => console.error('Fetch error:', err))
  }

  const handleAssignTeacher = async (classId) => {
    setSelectedClass(classId)
    await fetchSubjects(classId)
    setVisible(true)
  }

  const handleSelectTeacher = (teacherId) => {
    setSelectedTeacher(teacherId)
  }

  const handleSelectSubject = (subjectId) => {
    setSelectedSubject(subjectId)
  }

  const handleConfirmAssignment = () => {
    if (selectedClass && selectedTeacher && selectedSubject) {
      fetch(`${url}/api/admin/assignTeacher/${selectedTeacher}/${selectedClass}/${selectedSubject}`, {
        method: "POST",
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
        .then(() => {
          setVisible(false)
          fetchClassDetails()
          setSelectedClass(null)
          setSelectedTeacher(null)
          setSelectedSubject(null)
        })
        .catch(err => console.error('Fetch error:', err))
    }
  }

  return (
    <div className="manage-class">
      <h1>Manage Classes</h1>
      <CTable className="class-table">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Grade</CTableHeaderCell>
            <CTableHeaderCell scope="col">Assigned Teacher</CTableHeaderCell>
            <CTableHeaderCell scope="col">No. of Students</CTableHeaderCell>
            <CTableHeaderCell scope="col">Assign Teacher</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {classDetails.map((classDetail, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{classDetail.class}</CTableDataCell>
              <CTableDataCell>{classDetail.teacher_name == null ? '-' : classDetail.teacher_name}</CTableDataCell>
              <CTableDataCell>{classDetail.student_count}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  className="assign-button"
                  onClick={() => handleAssignTeacher(classDetail.id)}
                >
                  <MdAssignmentAdd />
                  Assign
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={visible} onClose={() => setVisible(false)} className="modal">
        <CModalHeader>
          <CModalTitle>Assign Teacher</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            className="mb-3"
            value={selectedSubject || ''}
            onChange={(e) => handleSelectSubject(Number(e.target.value))}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subject_name}
              </option>
            ))}
          </CFormSelect>
          {!selectedSubject
            ? <span className='text-danger'>Please select a subject</span>
            :
            <CTable className="teacher-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell width="25%">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {teachers.map((teacher) => (
                  <CTableRow key={teacher.id}>
                    <CTableDataCell>{teacher.teacher_name}</CTableDataCell>
                    <CTableDataCell>
                      {/* <CButton
                      className={`select-button ${selectedTeacher === teacher.id ? 'active' : ''}`}
                      onClick={() => handleSelectTeacher(teacher.id)}
                    >
                      {selectedTeacher === teacher.id ? 'Selected' : 'Select'}
                    </CButton> */}
                      {
                        (subjects.find(_ => _.id === selectedSubject)?.teacher_id !== teacher.id)
                          ? <KlugAddBtn onClick={() => handleSelectTeacher(teacher.id)} />
                          : <strong className='text-secondary m-0'>Currently Teaching</strong>
                      }
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          }
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleConfirmAssignment}
            disabled={!selectedTeacher || !selectedSubject}
          >
            Confirm Assignment
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ManageClass