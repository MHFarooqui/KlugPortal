import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CBadge,
  CButton,
  CModalHeader,
  CModal,
  CModalTitle,
  CModalBody,
  CForm,
  CFormSelect,
  CModalFooter,
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import '../../scss/UsersPage.scss'
import ReactPaginate from 'react-paginate'
import Toastify from 'toastify-js'
import { useNavigate } from 'react-router-dom' 
import "toastify-js/src/toastify.css"

const getGradeColor = (grade) => {
  const gradeMap = {
    'A': 'success',
    'A-': 'success',
    'B+': 'info',
    'B': 'info',
    'C': 'warning',
    'D': 'danger',
    'F': 'danger'
  }
  return gradeMap[grade.charAt(0)] || 'secondary'
}

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [studentsDetails, setStudentsDetails] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [changeStudentDetails, setChangeStudentDetails] = useState([])
  const [updatedStudent, setUpdatedStudent] = useState(null)
  const navigate = useNavigate();
  const itemsPerPage = 10

  useEffect(() => {
    fetchStudents()
  }, []) // Added empty dependency array to prevent infinite loop

  const fetchStudents = () => {
    fetch("http://localhost:10000/api/admin/allUsers", {
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
      .then(data => setStudentsDetails(data))
      .catch(err => console.error('Fetch error:', err))
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  const filteredStudents = studentsDetails.filter(student =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone_no.toLowerCase().includes(searchTerm.toLowerCase())
  )
  localStorage.setItem('Students', studentsDetails.length);
  const paginatedStudents = filteredStudents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const handleEdit = (studentId) => {
    setEditModalVisible(true)
    console.log(changeStudentDetails);
    console.log(`Edit student with ID: ${studentId}`)
    // Add your edit logic here
  }

  const handleDelete = (studentId) => {
    console.log(`Delete student with ID: ${studentId}`)
    // Add your delete logic here
  }

  const handleInputChange = (e) => {
    setChangeStudentDetails({
      ...changeStudentDetails,
      [e.target.name]: e.target.value
    })
  }

  const updateStudentRequest =async () => {
    console.log("called")
    await fetch(`http://localhost:10000/api/admin/UpdateStudent`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
      body: JSON.stringify(changeStudentDetails)
    })
    .then(response => response.json())
    .then(data => console.log('Teacher updated successfully', data))
    .catch(err => console.error('Error updating teacher:', err))
  }

  const handleSaveChanges = () => {
    // Here you would typically make an API call to update the student details
    // For this example, we'll just update the local state
    const updatedStudents = studentsDetails.map(student => 
      student.id === changeStudentDetails.id ? changeStudentDetails : student
    )
    updateStudentRequest();
    setStudentsDetails(updatedStudents)
    setUpdatedStudent(changeStudentDetails)
    setEditModalVisible(false)
  }



  return (
    <div className="student-list-container">
      <CRow className="justify-content-center w-100">
        <CCol xs={12} md={10} lg={8}>
          <CCard className="student-list-card">
            <CCardHeader className="student-list-header">
              <strong>Student List</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="search-container">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    placeholder="Search by name or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <div className="total-students">
                    <CBadge color="primary" shape="rounded-pill">
                      Total Students: {filteredStudents.length}
                    </CBadge>
                  </div>
                </CCol>
              </CRow>
              <CTable hover striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Phone number</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedStudents.map((student) => (
                    <CTableRow key={student.id}>
                      <CTableDataCell>{student.student_name}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getGradeColor(student.phone_no)}>{student.phone_no}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="action-buttons">
                          <CButton
                            className="action-button edit-button"
                            size="sm"
                            onClick={() => { setChangeStudentDetails(student); return handleEdit(student.id) }}
                          >
                            Edit
                          </CButton>
                          {/* <CButton
                            className="action-button delete-button"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </CButton> */}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={Math.ceil(filteredStudents.length / itemsPerPage)}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                className="pagination"
                activeClassName='active'
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
          <CModalHeader closeButton>
            <CModalTitle>Edit Student</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <div className="mb-3">
                <label htmlFor="studentName" className="form-label">User name</label>
                <CFormInput
                  type="text"
                  id="studentName"
                  name="student_name"
                  value={changeStudentDetails?.student_name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNo" className="form-label">Phone No.</label>
                <CFormInput
                  type="text"
                  id="phoneNo"
                  name="phone_no"
                  value={changeStudentDetails?.phone_no || ''}
                  onChange={handleInputChange}
                />
              </div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={handleSaveChanges}>
              Save Changes
            </CButton>
          </CModalFooter>
        </CModal>
      </CRow>
      {updatedStudent && (
        <CCard className="mt-4">
          <CCardHeader>Updated Student Details</CCardHeader>
          <CCardBody>
            <p><strong>Name:</strong> {updatedStudent.student_name}</p>
            <p><strong>Phone Number:</strong> {updatedStudent.phone_no}</p>
          </CCardBody>
        </CCard>
      )}
    </div>
  )
}

export default UsersPage