import React, { useState } from 'react'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormLabel,
    CButton,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import {
    CChartDoughnut,
    CChartBar
} from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilBook, cilBriefcase, cilMenu, cilSpeedometer } from '@coreui/icons'
import '@coreui/coreui/dist/css/coreui.min.css'
import './AddClass.scss'

function ManageClass() {
    const [departments, setDepartments] = useState([])
    const [classes, setClasses] = useState([])
    const [newDepartment, setNewDepartment] = useState('')
    const [newClass, setNewClass] = useState('')
    const [selectedDepartment, setSelectedDepartment] = useState('')
    const [sidebarVisible, setSidebarVisible] = useState(true)

    const addDepartment = (e) => {
        e.preventDefault()
        if (newDepartment.trim()) {
            setDepartments([...departments, newDepartment.trim()])
            setNewDepartment('')
        }
    }

    const addClass = (e) => {
        e.preventDefault()
        if (newClass.trim() && selectedDepartment) {
            setClasses([...classes, { name: newClass.trim(), department: selectedDepartment }])
            setNewClass('')
        }
    }

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
    }

    return (
        <div className="school-dashboard">
            <div className="content">
                <CContainer fluid>
                    <CButton onClick={toggleSidebar} color="primary" className="d-md-none mb-3">
                        <CIcon icon={cilMenu} size="lg" />
                    </CButton>
                    <h1 className="mb-4">Management Departments</h1>
                    <CRow>
                        <CCol md={6} lg={3}>
                            <CCard className="mb-4">
                                <CCardHeader>Total Departments</CCardHeader>
                                <CCardBody>
                                    <h2>{departments.length}</h2>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol md={6} lg={3}>
                            <CCard className="mb-4">
                                <CCardHeader>Total Classes</CCardHeader>
                                <CCardBody>
                                    <h2>{classes.length}</h2>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol md={12} lg={6}>
                            <CCard className="mb-4">
                                <CCardHeader>Department Distribution</CCardHeader>
                                <CCardBody>
                                    <CChartDoughnut
                                        data={{
                                            labels: departments,
                                            datasets: [
                                                {
                                                    data: departments.map(dept =>
                                                        classes.filter(cls => cls.department === dept).length
                                                    ),
                                                    backgroundColor: [
                                                        '#FF6384',
                                                        '#36A2EB',
                                                        '#FFCE56',
                                                        '#4BC0C0',
                                                        '#9966FF',
                                                    ],
                                                },
                                            ],
                                        }}
                                    />
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md={6}>
                            <CCard className="mb-4">
                                <CCardHeader>Add Department</CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={addDepartment}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="departmentName">Department Name</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="departmentName"
                                                value={newDepartment}
                                                onChange={(e) => setNewDepartment(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <CButton type="submit" color="primary">
                                            Add Department
                                        </CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol md={6}>
                            <CCard className="mb-4">
                                <CCardHeader>Add Class</CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={addClass}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="departmentSelect">Select Department</CFormLabel>
                                            <select
                                                className="form-select"
                                                id="departmentSelect"
                                                value={selectedDepartment}
                                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                                required
                                            >
                                                <option value="">Choose...</option>
                                                {departments.map((dept, index) => (
                                                    <option key={index} value={dept}>
                                                        {dept}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="className">Class Name</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="className"
                                                value={newClass}
                                                onChange={(e) => setNewClass(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <CButton type="submit" color="primary">
                                            Add Class
                                        </CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md={6}>
                            <CCard>
                                <CCardHeader>Departments</CCardHeader>
                                <CCardBody>
                                    <CListGroup>
                                        {departments.map((dept, index) => (
                                            <CListGroupItem key={index}>{dept}</CListGroupItem>
                                        ))}
                                    </CListGroup>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol md={6}>
                            <CCard>
                                <CCardHeader>Classes</CCardHeader>
                                <CCardBody>
                                    <CListGroup>
                                        {classes.map((cls, index) => (
                                            <CListGroupItem key={index}>
                                                {cls.name} - {cls.department}
                                            </CListGroupItem>
                                        ))}
                                    </CListGroup>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </div>
    )
}

export default ManageClass;