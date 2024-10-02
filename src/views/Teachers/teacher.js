import { CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { right } from '@popperjs/core';
import React, { useEffect, useState } from 'react'
import Toastify from 'toastify-js'
import { useNavigate } from 'react-router-dom' 
import "toastify-js/src/toastify.css"

const Teachers = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  useEffect(() => {
    fetch("http://localhost:10000/api/admin/allTeacher", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `${localStorage.getItem('token')}`
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
      .then(data => setStudents(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);
  console.log(students);

  const handleViewDetails = (id) => {
    navigate(`/teacherDetails/${id}`); // Redirect to teacherDetails with id as a param
  }

  return (
    <>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">phone No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Teacher Id</CTableHeaderCell>
            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {students.map((student, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{student.teacher_name}</CTableDataCell>
              <CTableDataCell>{student.phone_no || '-'}</CTableDataCell>
              <CTableDataCell>{student.id}</CTableDataCell>
              <CTableDataCell style={{ width: 100 }}><CButton style={{ textAlign: right }} color="success" variant="outline"  onClick={() => handleViewDetails(student.id)}>
                Views
              </CButton></CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Teachers
