import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CContainer, CRow, CCol } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import DragDropUpload from './OnBoard';


const StudentOnboarding = ({ role }) => <DragDropUpload role={'student'}/>;
const TeacherOnboarding = ({ role }) => <DragDropUpload role={role} />;

const OnboardingSelection = () => {
  const [role, setRole] = useState(null);

  const handleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  if (role === 'student') {
    return <StudentOnboarding />;
  } else if (role === 'teacher') {
    return <TeacherOnboarding />;
  }

  return (
    <CContainer className=" d-flex align-items-center justify-content-center">
      <CCard style={{ width: '400px' }}>
        <CCardHeader className="text-center">
          <h3>Select Your Role</h3>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol className="text-center mb-3">
              <CButton color="primary" size="lg" className="w-100" onClick={() => handleSelection('student')}>
                Onboard Student
              </CButton>
            </CCol>
          </CRow>
          <CRow>
            <CCol className="text-center">
              <CButton color="success" size="lg" className="w-100" onClick={() => handleSelection('teacher')}>
              Onboard Teacher
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default OnboardingSelection;
