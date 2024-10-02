import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CForm,
    CFormLabel,
    CFormSelect,

} from '@coreui/react';
import '../../scss/StudentOnBoard.scss'; // Ensure this path is correct for your project structure
import { FaFileUpload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const DragDropUpload = ({ role }) => {
    const [data, setData] = useState([]);

    const [firstSelection, setFirstSelection] = useState('');
    const [secondSelection, setSecondSelection] = useState('');
    const [thirdSelection, setThirdSelection] = useState('');

    const handleFirstChange = (e) => {
        setFirstSelection(e.target.value);
    };

    const handleSecondChange = (e) => {
        setSecondSelection(e.target.value);
    };

    const handleThirdChange = (e) => {
        setThirdSelection(e.target.value);
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0]; // Assuming you're interested in the first sheet
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            setData(jsonData);
        };

        reader.readAsBinaryString(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        }
    });

    const colSize = data.length === 0 ? { xs: 12, sm: 6, md: 4 } : { xs: 0, sm: 0, md: 0 };

    const handleOnboard = () => {
        // Handle onboarding logic here
        console.log('Onboard button clicked');
    };

    return (
        <>
            <CForm>
                <CRow className="mb-5">
                    <CCol>
                        <CFormLabel htmlFor="firstDropdown">Grade</CFormLabel>
                        <CFormSelect id="firstDropdown" value={firstSelection} onChange={handleFirstChange}>
                            <option value="">Select grade</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
            </CForm>

            <CRow className='d-flex align-items-center justify-content-center'>
                <CCol xs={colSize.xs} sm={colSize.sm} md={colSize.md}>
                    <CCard>
                        {data.length === 0 ? (<CCardHeader>
                            Drag & Drop Excel File Upload
                        </CCardHeader>) : <CCardHeader>
                            {role === 'student' ? (<p>student Data</p>) : <p>Teacher Data</p>}
                        </CCardHeader>}
                        <CCardBody className="d-flex flex-column align-items-center">
                            {data.length === 0 && (
                                <div {...getRootProps()} className='dropzone'>
                                    <input {...getInputProps()} />
                                    <div>
                                        <FaFileUpload size={50} className='mb-4' />
                                    </div>
                                    <div>
                                        {isDragActive ? (
                                            <p>Drop the Excel files here ...</p>
                                        ) : (
                                            <p>Drag 'n' drop Excel files here, or click to select files</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {data.length > 0 && (
                                <div className="table-container">
                                    <CButton color="primary" onClick={handleOnboard} className="mb-3">
                                        Onboard
                                    </CButton>
                                    <table>
                                        <thead>
                                            <tr>
                                                {Object.keys(data[0]).map((key) => (
                                                    <th key={key}>{key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, index) => (
                                                <tr key={index}>
                                                    {Object.values(row).map((value, i) => (
                                                        <td key={i}>{value}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};

export default DragDropUpload;
