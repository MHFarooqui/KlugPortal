import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CForm,
  CFormInput,
  CButton
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import { IoMdReturnRight } from "react-icons/io";
import './StudentClasses.scss'
import '../../scss/UsersPage.scss'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"


const StudentClasses = () => {
  const [classes, setClasses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  let url = "https://eklearnapi.onrender.com"

  useEffect(() => {
    fetch(`${url}/api/admin/allClasses`, {
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
      .then(data => setClasses(data))
      .catch(err => console.error('Fetch error:', err))
  }, [navigate])
  const filteredClassData = classes.filter((item) =>
    item.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStudents = filteredClassData.reduce((sum, item) => sum + Number(item.student_count), 0)
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className='d-flex align-items-center justify-content-between'>
            <strong>Student Count by Class</strong>
            <CButton color="primary" onClick={() => {navigate('/ManageClasses')}}>Add class</CButton>
          </CCardHeader>
          <CCardBody>
            <CForm className="mb-3">
              <CFormInput
                type="text"
                id="searchInput"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CForm>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Class Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Number of Students</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredClassData.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.class}</CTableDataCell>
                    <CTableDataCell>{item.student_count}</CTableDataCell>
                    <CTableDataCell><CButton
                      className="action-button "
                      size="sm"
                      onClick={() => { navigate(`/ClassInfo/${item.id}`)}}
                    >
                      <IoMdReturnRight />
                    </CButton>
                      {/* {item.student_count} */}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <div className="text-end mt-3">
              <strong>Total Students: {totalStudents}</strong>
            </div>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StudentClasses