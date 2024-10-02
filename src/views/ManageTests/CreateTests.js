import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CCol,
  CRow,
  CContainer,
  CFormSelect,
  CFormTextarea,
  CAlert,
} from '@coreui/react';
import { CgAddR } from 'react-icons/cg';
import { FaCheck, FaTimes, FaSave } from 'react-icons/fa';
import '@coreui/coreui/dist/css/coreui.min.css';
import './CreateTest.scss';

function CreateTest() {
  const [formData, setFormData] = useState({
    testName: '',
    subject: '',
    class: '',
    question: '',
    Options: { A: '', B: '', C: '', D: '' },
    Answer: '',
  });
  const [savedData, setSavedData] = useState([]);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('success');
  const [classDetails, setClassDetails] = useState([])

  useEffect(() => {
    fetchClasses();
  }, [])

  const fetchClasses = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('option')) {
      const optionKey = name.charAt(name.length - 1);
      setFormData({
        ...formData,
        Options: { ...formData.Options, [optionKey]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = { ...formData, class_id: getClassId(formData.class) };
    setSavedData([...savedData, newQuestion]);

    if (isFirstQuestion) {
      setIsFirstQuestion(false);
    } else {
      // Keep the test name, subject and class for subsequent questions
      const { testName, subject, class: classValue } = formData;
      setFormData({
        testName,
        subject,
        class: classValue,
        question: '',
        Options: { A: '', B: '', C: '', D: '' },
        Answer: '',
      });
    }
  };

  const getClassId = (className) => {
    const classMap = {
      'Class 6': 1,
      'Class 7': 2,
      'Class 8': 3,
      'Class 9': 4,
      'Class 10': 5,
    };
    return classMap[className] || 0;
  };

  const handleCreateTest = async () => {
    if (savedData.length === 0) {
      setAlertMessage('Please add at least one question before creating the test.');
      setAlertColor('danger');
      return;
    }

    const testData = {
      testName: formData.testName,
      classId: getClassId(formData.class),
      subject: formData.subject,
      MCQ: savedData,
    };

    console.log(testData);
    try {
      const response = await fetch('http://localhost:10000/api/admin/createTests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        setAlertMessage('Test created successfully!');
        setAlertColor('success');
        // Reset the form and saved data
        setSavedData([]);
        setFormData({
          testName: '',
          subject: '',
          class: '',
          question: '',
          Options: { A: '', B: '', C: '', D: '' },
          Answer: '',
        });
        setIsFirstQuestion(true);
      } else {
        throw new Error('Failed to create test');
      }
    } catch (error) {
      setAlertMessage('Failed to create test. Please try again.');
      setAlertColor('danger');
    }
  };

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];

  return (
    <CContainer fluid className="create-test-container">
      {savedData.length > 0 && (
        <CButton
          color="success"
          className="create-test-btn mb-4 submit-btn"
          onClick={handleCreateTest}
        >
          <FaSave className="btn-icon" /> Create Test
        </CButton>
      )}
      <CRow>
        <CCol lg={7} className="order-lg-2">
          <CCard className="saved-questions-card mb-4">
            <CCardHeader>
              <h5 className="saved-questions-title">Test Questions</h5>
            </CCardHeader>
            <CCardBody>
              {savedData.length > 0 ? (
                savedData.map((data, index) => (
                  <div key={index} className="saved-question">
                    <h6 className="question-number">Question {index + 1}</h6>
                    <p className="question-meta">
                      Test Name: {data.testName} | Subject: {data.subject} | Class: {data.class}
                    </p>
                    <p className="question-text">{data.question}</p>
                    <ul className="options-list">
                      {Object.entries(data.Options).map(([key, value]) => (
                        <li key={key} className={key === data.Answer ? 'correct' : ''}>
                          <span className="option-label">{key}</span>
                          <span className="option-text">{value}</span>
                          {key === data.Answer && <FaCheck className="correct-icon" />}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="no-questions">
                  <FaTimes className="no-questions-icon" />
                  <p>No questions added yet.</p>
                </div>
              )}
            </CCardBody>
          </CCard>

          {alertMessage && (
            <CAlert color={alertColor} className="mb-4">
              {alertMessage}
            </CAlert>
          )}
        </CCol>
        <CCol lg={5} className="order-lg-1">
          <CCard className="create-test-card mb-4">
            <CCardHeader>
              <h4 className="create-test-title">Create New Question</h4>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                  <CFormLabel htmlFor="testName">Test Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="testName"
                    name="testName"
                    value={formData.testName}
                    onChange={handleChange}
                    required
                    className="mb-3"
                    placeholder="Enter test name"
                    disabled={!isFirstQuestion}
                  />
                </div>
                <CRow>
                  <CCol md={6}>
                    <div className="form-group">
                      <CFormLabel htmlFor="subject">Subject</CFormLabel>
                      <CFormSelect
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mb-3"
                        disabled={!isFirstQuestion}
                      >
                        <option value="">Select subject</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="form-group">
                      <CFormLabel htmlFor="class">Class</CFormLabel>
                      <CFormSelect
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                        className="mb-3"
                        disabled={!isFirstQuestion}
                      >
                        <option value="">Select class</option>
                        {classDetails.map((classOption) => (
                          <option key={classOption.class} value={classOption.class}>
                            {classOption.class}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
                <div className="form-group">
                  <CFormLabel htmlFor="question">Question</CFormLabel>
                  <CFormTextarea
                    type="text"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="mb-3"
                    placeholder="Enter your question here"
                  />
                </div>
                <CRow>
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <CCol md={6} key={option}>
                      <div className="form-group">
                        <CFormLabel htmlFor={`option${option}`}>Option {option}</CFormLabel>
                        <CFormInput
                          type="text"
                          id={`option${option}`}
                          name={`option${option}`}
                          value={formData.Options[option]}
                          onChange={handleChange}
                          required
                          autoComplete="off"
                          className="mb-3"
                          placeholder={`Enter option ${option}`}
                        />
                      </div>
                    </CCol>
                  ))}
                </CRow>
                <div className="form-group">
                  <CFormLabel htmlFor="answer">Correct Answer</CFormLabel>
                  <CFormSelect
                    id="answer"
                    name="Answer"
                    value={formData.Answer}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  >
                    <option value="">Select correct answer</option>
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <option key={option} value={option}>
                        Option {option}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
                <CButton type="submit" color="primary" className="submit-btn">
                  <CgAddR className="btn-icon" /> Add Question
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default CreateTest;