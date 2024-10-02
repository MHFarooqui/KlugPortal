import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'

const classes = ['Math', 'Science', 'History', 'English', 'Art']

export default function ClassPerformance() {
  const [selectedClass, setSelectedClass] = useState(classes[0])

  const generateRandomData = (count) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 100))
  }

  const overallPerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Overall Performance',
        data: generateRandomData(12),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  }

  const classPerformanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: `${selectedClass} Performance`,
        data: generateRandomData(6),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <CRow>
        <CCol>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="bg-primary text-white font-semibold">Overall Performance</CCardHeader>
            <CCardBody>
              <CChart
                type="line"
                data={overallPerformanceData}
                options={{
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
                      max: 100,
                    },
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
          <CCard className="shadow-sm">
            <CCardHeader className="bg-secondary text-white font-semibold d-flex justify-content-between align-items-center">
              <span>Class Performance</span>
              <CDropdown>
                <CDropdownToggle color="light">{selectedClass}</CDropdownToggle>
                <CDropdownMenu>
                  {classes.map((cls) => (
                    <CDropdownItem key={cls} onClick={() => setSelectedClass(cls)}>
                      {cls}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </CCardHeader>
            <CCardBody>
              <CChart
                type="bar"
                data={classPerformanceData}
                options={{
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
                      max: 100,
                    },
                  },
                }}
                style={{ height: '300px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}