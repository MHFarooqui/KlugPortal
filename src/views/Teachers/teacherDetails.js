import { CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { MdOutlineTopic } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate, useParams } from 'react-router-dom';



const TeacherDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [classDetails, setClassDetails] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:10000/api/admin/assignedClasses/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } 
                return response.json();
            })
            .then(data => setClassDetails(data))
            .catch(err => console.error('Fetch error:', err));
    }, []);
    console.log(classDetails)
    return (
        <>
            <section >
                <div>
                    <div>
                    </div>
                    <CButton color="primary" variant="outline" href="/#/ManageClass">
                        Assign Class
                    </CButton>
                </div>
                <div>
                    <CTable>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col"> <SiGoogleclassroom /> Grade</CTableHeaderCell>
                                <CTableHeaderCell scope="col"> <MdOutlineTopic /> Subject</CTableHeaderCell>
                                <CTableHeaderCell scope="col"> <PiStudentBold /> No. of Students</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {classDetails.map((classDetail, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{classDetail.class_name}</CTableDataCell>
                                    <CTableDataCell>{classDetail.subject_name || '-'}</CTableDataCell>
                                    <CTableDataCell>{classDetail.student_count}</CTableDataCell>

                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>

                </div>
            </section>
        </>
    )
}

export default TeacherDetails
