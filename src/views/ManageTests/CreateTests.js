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
import Toastify from 'toastify-js'
import { useNavigate } from 'react-router-dom' 
import "toastify-js/src/toastify.css"

function CreateTest() {
  const [formData, setFormData] = useState({
    testName: '',
    subject: '',
    class_Id: '',
    question: '',
    options: [
      { option: '' },
      { option: '' },
      { option: '' },
      { option: '' }
    ],
    type: 'MCQ',
    answer: '',
  });
  const [savedData, setSavedData] = useState([]);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('success');
  const [classDetails, setClassDetails] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    fetch("http://localhost:10000/api/admin/getClasses", {
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
      .then(data => setClassDetails(data))
      .catch(err => console.error('Fetch error:', err));
  };

  const fetchSubjects = (classId) => {
    fetch(`http://localhost:10000/api/admin/getSubjects/${classId}`, {
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
      .then(data => setSubjects(data))
      .catch(err => console.error('Fetch error:', err));
  };

  const handleClassChange = (e) => {
    const { value } = e.target;
    const selectedClass = classDetails.find(c => c.id == value);
    if (selectedClass) {
      setFormData(prev => ({
        ...prev,
        class_Id: value,
        subject: '', // Reset subject when class changes
      }));
      fetchSubjects(value);
    }
  };

  const handleSubjectChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      subject: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, option: value } : opt
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = { ...formData };
    setSavedData(prev => [...prev, newQuestion]);

    if (isFirstQuestion) {
      setIsFirstQuestion(false);
    } else {
      const { testName, subject, class_Id } = formData;
      console.log(formData);
      setFormData(prev => ({
        ...prev,
        testName,
        subject,
        class_Id,
        question: '',
        options: [
          { option: '' },
          { option: '' },
          { option: '' },
          { option: '' }
        ],
        answer: '',
      }));
    }
  };

  const handleCreateTest = async () => {
    if (savedData.length === 0) {
      setAlertMessage('Please add at least one question before creating the test.');
      setAlertColor('danger');
      return;
    }

    const testData = {
      testName: formData.testName,
      class_Id: formData.class_Id,
      org_id: localStorage.getItem('org_id'), // Assuming org_id is stored in localStorage
      subject: formData.subject,
      MCQ: savedData,
    };

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
        setAlertMessage('Test created successfully!' );
        setAlertColor('success');
        setSavedData([]);
        setClassDetails([]);
        setFormData({
          testName: '',
          subject: '',
          class_Id: '',
          question: '',
          options: [
            { option: '' },
            { option: '' },
            { option: '' },
            { option: '' }
          ],
          type: 'MCQ',
          answer: '',
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
                      Test Name: {data.testName} | Subject: {data.subject} | Class ID: {data.class_Id}
                    </p>
                    <p className="question-text">{data.question}</p>
                    <ul className="options-list">
                      {data.options.map((option, optionIndex) => (
                        <li key={optionIndex} className={option.option === data.answer ? 'correct' : ''}>
                          <span className="option-label">{String.fromCharCode(65 + optionIndex)}</span>
                          <span className="option-text">{option.option}</span>
                          {option.option === data.answer && <FaCheck className="correct-icon" />}
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
            <CAlert color={alertColor} className="mb-4" >
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
              <CForm onSubmit={handleSubmit}>
                <div className="form-group">
                  <CFormLabel htmlFor="testName">Test Name</CFormLabel>
                  <CFormInput
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
                      <CFormLabel htmlFor="class_Id">Class</CFormLabel>
                      <CFormSelect
                        id="class_Id"
                        name="class_Id"
                        value={formData.class_id}
                        onChange={handleClassChange}
                        required
                        className="mb-3"
                        disabled={!isFirstQuestion}
                      >
                        <option value="">Select class</option>
                        {classDetails.map((classOption) => (
                          <option key={classOption.id} value={classOption.id}>
                            {classOption.class}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="form-group">
                    <CFormLabel htmlFor="subject">Subject</CFormLabel>
                      <CFormSelect
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleSubjectChange}
                        required
                        className="mb-3"
                        // disabled={!formData.class_Id || !isFirstQuestion}
                      >
                        <option value="">Select subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.subject_name}>
                            {subject.subject_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
                <div className="form-group">
                  <CFormLabel htmlFor="question">Question</CFormLabel>
                  <CFormTextarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    required
                    className="mb-3"
                    placeholder="Enter your question here"
                  />
                </div>
                <CRow>
                  {formData.options.map((option, index) => (
                    <CCol md={6} key={index}>
                      <div className="form-group">
                        <CFormLabel htmlFor={`option-${index}`}>Option {String.fromCharCode(65 + index)}</CFormLabel>
                        <CFormInput
                          id={`option-${index}`}
                          name={`option-${index}`}
                          value={option.option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          required
                          className="mb-3"
                          placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                        />
                      </div>
                    </CCol>
                  ))}
                </CRow>
                <div className="form-group">
                  <CFormLabel htmlFor="answer">Correct Answer</CFormLabel>
                  <CFormSelect
                    id="answer"
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  >
                    <option value="">Select correct answer</option>
                    {formData.options.map((option, index) => (
                      <option key={index} value={option.option}>
                        Option {String.fromCharCode(65 + index)}
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