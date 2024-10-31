import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [classDetails, setClassDetails] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [selectedClass, setSelectedClass] = useState(1)
  const [classData, setClassData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [scorePerformance, setScorePerformance] = useState([])

  let classScorePerformanceChartData = {
    labels: [],
    datasets: [{
      label: 'Average Marks',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  useEffect(() => {
    fetchClassDetails();
    fetchPerformanceData();
    fetchClassScorePerformance(selectedClass)
    if (performanceData.length > 0) {
      setSelectedMonth(performanceData[0].month)
    }
  }, [selectedClass])

  const fetchClassDetails = () => {
    fetch("http://localhost:10000/api/admin/getClasses", {
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

  const fetchPerformanceData = () => {
    fetch("http://localhost:10000/api/admin/studentsAverage", {
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
      .then(data => { setPerformanceData(data) })
      .catch(err => console.error('Fetch error:', err))
  }

  const fetchClassScorePerformance = (Class_id) => {
    fetch(`http://localhost:10000/api/admin/classPerformance/${Class_id}`, {
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
      .then(data => { setScorePerformance(data) })
      .catch(err => console.error('Fetch error:', err))

  }

  const getPerformanceChartData = () => {
    const months = Array.from(new Set(performanceData.map(data => data.month)))
    const datasets = months.map((month) => {
      const monthPerformance = classDetails.map((classDetail) => {
        const performanceEntry = performanceData.find(
          (entry) => entry.class_id === classDetail.id && entry.month === month
        )
        return performanceEntry ? parseFloat(performanceEntry.average_attendance_percentage) : 0
      })

      return {
        label: month,
        data: monthPerformance,
        borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        tension: 0.1,
        fill: false,
      }
    })

    return {
      labels: classDetails.map(cls => cls.class),
      datasets: datasets,
    }
  }

  if (scorePerformance.length !== 0) {
    classScorePerformanceChartData = {
      labels: scorePerformance.map(data => data.subject),
      datasets: [{
        label: 'Average Marks',
        data: scorePerformance.map(data => data.average_marks),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }]
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Marks'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Subjects'
        }
      }
    },
  }

  const performanceChartData = getPerformanceChartData()
  if (performanceChartData.datasets.length > 0) {
    localStorage.setItem('performanceData', performanceChartData.datasets[0].label);
    console.log(localStorage.getItem('performanceData'));
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <CRow className="g-3">
        <CCol md={6}>
          <CCard className="mb-3">
            <CCardHeader className="d-flex align-items-center justify-content-between">
              <CCardTitle className="mb-0 text-sm fw-medium">Total Classes</CCardTitle>
              <CIcon icon={cilUser} size="lg" className="text-muted" />
            </CCardHeader>
            <CCardBody>
              <div className="fs-2 fw-bold">{classDetails.length}</div>
              <CCardText className="text-muted small">Active classes</CCardText>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard className="mb-3">
            <CCardHeader className="d-flex align-items-center justify-content-between">
              <CCardTitle className="mb-0 text-sm fw-medium">Students</CCardTitle>
              <CIcon icon={cilUser} size="lg" className="text-muted" />
            </CCardHeader>
            <CCardBody>
              <div className="fs-2 fw-bold">{localStorage.getItem('Students')}</div>
              <CCardText className="text-muted small">Number of students in the organization</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="bg-primary text-white font-semibold">Overall Class Performance</CCardHeader>
            <CCardBody>
              <CChart
                type="line"
                data={performanceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Average Attendance Percentage'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Classes'
                      }
                    }
                  },
                }}
                style={{ height: '400px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className="w-full max-w-3xl">
            <CCardHeader className="d-flex flex-row items-center justify-content-between">
              <CCardTitle className="">Class Performance</CCardTitle>
              <CDropdown>
                <CDropdownToggle color="primary">
                  {classDetails.find(cls => cls.id === selectedClass)?.class || 'Select a class'}
                </CDropdownToggle>
                <CDropdownMenu>
                  {classDetails.map((cls) => (
                    <CDropdownItem
                      key={cls.id}
                      onClick={() => setSelectedClass(cls.id)}
                    >
                      {cls.class}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </CCardHeader>
            <CCardBody>
              <CCardText className="text-xs text-muted">
                Average marks for each subject in the selected class
              </CCardText>
              <div style={{ height: '300px' }}>
                <CChart
                  type="bar"
                  data={classScorePerformanceChartData}
                  options={options}
                  height={275}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}