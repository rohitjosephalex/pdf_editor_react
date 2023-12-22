// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import upload from './assets/upload-square-color-red-icon.png';
import { Document, Page, pdfjs } from 'react-pdf';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './components/navbar';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// eslint-disable-next-line react/prop-types
const DraggablePage = ({ pageNumber, index }) => {
  return (
    <Draggable draggableId={`page-${pageNumber}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
        </div>
      )}
    </Draggable>
  );
};

function Pdf() {
  const fileInputRef = useRef(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(1);
  const [selectedPages, setSelectedPages] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkbox, setCheckbox] = useState([])
  const [pdfData, setPdfData] = useState(null);
  const [pdfName, setPdfName] = useState(null);




  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleManipulateButtonClick = async () => {
    console.log(selectedPages, "checkbox", checkbox);
    try {
      const apiUrl = `http://localhost:80/api/edit/edit-pdf`;

      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('checkbox', JSON.stringify(checkbox));
      formData.append('selectedPages', JSON.stringify(selectedPages));
      console.log(pdfFile.name)
      setPdfName(pdfFile.name.replace(/\.pdf$/, ''))
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      console.log('response', response.data);
      const pdfUint8Array = new Uint8Array(Object.values(response.data));
      setPdfData(new Uint8Array(pdfUint8Array));
      console.log('pdfData', pdfData);

      // console.log('Backend response:', response.data);
    } catch (error) {
      console.error('Error sending data to the backend:', error.message);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  useEffect(() => {

    if (numPages) {
      setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
    }
    if (numPages === checkbox.length) {
      setCheckAll(true)
    }
    if (checkbox.length < numPages) {
      setCheckAll(false)
    }
    if (pdfData) {
      // Convert Uint8Array to Blob
      const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });

      // Create a data URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a link element to trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `editted_${pdfName}`;

      // Append the link to the document and trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Cleanup: Remove the link and revoke the URL
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(pdfUrl);
      setPdfData();
    }
  }, [numPages, checkbox, pdfData, pdfName]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCheckbox([]);
    setCheckAll(false)
  }

  const handleCheckboxChange = (pageNumber) => {
    setCheckbox((prevCheckbox) => {
      if (checkAll) {
        return prevCheckbox.includes(pageNumber)
          ? prevCheckbox.filter((page) => page !== pageNumber)
          : [...prevCheckbox, pageNumber];
      } else {
        return prevCheckbox.includes(pageNumber)
          ? prevCheckbox.filter((page) => page !== pageNumber)
          : [...prevCheckbox, pageNumber];
      }
    });
  };

  const handleSelectAllChange = () => {
    setCheckAll((prevCheckAll) => !prevCheckAll);
    setCheckbox(() => {
      return checkAll ? [] : Array.from({ length: numPages }, (_, i) => i + 1);
    });
  };

  const movePage = (sourceIndex, destinationIndex) => {
    const newSelectedPages = [...selectedPages];
    const [removed] = newSelectedPages.splice(sourceIndex, 1);
    newSelectedPages.splice(destinationIndex, 0, removed);
    setSelectedPages(newSelectedPages);
  };



  return (

    <div>
      <header>
        <NavBar />
      </header>

      <div className='upload'>
        <h3 className='upload-heading'>Manipulate PDF for Free</h3>
        <div className='upload-card'>
          <div className='upload-card-wraper'>
            <img className="upload-logo" src={upload} alt="Indian post logo" />
            <h5 className='upload-card-heading'>Drag and Drop the PDF here for upload</h5>
            <div>
              <button className='btn' onClick={handleButtonClick}>Upload PDF</button>
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <DragDropContext onDragEnd={(result) => result.destination && movePage(result.source.index, result.destination.index)}>
          {pdfFile && (
            <div className="pdf-container">
              <div className="pdf-preview">
                <label className='checkbox-container'>
                  Select All
                  <input
                    type="checkbox" checked={checkAll} onChange={handleSelectAllChange}
                  />

                </label>
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  <Droppable droppableId="pdf-pages">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="pdf-pages">
                        {selectedPages.map((pageNumber, index) => (
                          <div key={pageNumber} className="pdf-page">
                            <div className='page'>
                              <div className='pageNo'>
                                <div className="pdf-page-number">Page {pageNumber}/{numPages}</div>
                                <label className='checkbox-container'>
                                  <input type="checkbox" value={pageNumber} checked={checkbox.includes(pageNumber)} onChange={() => handleCheckboxChange(pageNumber)} />
                                </label>
                              </div>
                            </div>
                            <DraggablePage pageNumber={pageNumber} index={index} />
                          </div>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Document>
              </div>
              <button className='btn manipulate' onClick={handleManipulateButtonClick}>Download</button>
            </div>
          )}
        </DragDropContext>
      </div>
    </div>
  );
}

export default Pdf;
