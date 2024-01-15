import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

const PanVerificationComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [enteredPanNumber, setEnteredPanNumber] = useState('');
  const [verificationResultFromImage, setVerificationResultFromImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const isPanNumberValid = () => enteredPanNumber.trim().length === 10;

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        console.log('Extracted Text:', text);

        // Check for a PAN card number using a regular expression
        const panNumberRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
        const match = text.match(panNumberRegex);

        if (match) {
          const panNumberFromImage = match[0];
          console.log('PAN Number from Image:', panNumberFromImage);

          // Set the PAN number from the image in state for verification
          setVerificationResultFromImage(panNumberFromImage);
        } else {
          setVerificationResultFromImage(null);
        }
      } catch (error) {
        console.error('Error during PAN verification:', error);
      }

      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleManualVerifyClick = async () => {
    if (!enteredPanNumber.trim()) {
      setValidationError('Please enter a 10 digit PAN number.');
      return;
    }

    setValidationError(null);

    try {
      // Check for a valid PAN card number using a regular expression
      const panNumberRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
      if (!enteredPanNumber.match(panNumberRegex)) {
        setVerificationResult(false);
        setValidationError('Invalid PAN number format.');
        return;
      }

      setValidationError(null);

      // Simulate a verification check based on the manually entered PAN number
      // In a real-world scenario, you would integrate with a verification service
      const isValid = enteredPanNumber === verificationResultFromImage;

      setVerificationResult(isValid);
    } catch (error) {
      console.error('Error during PAN verification:', error);
    }
  };

  return (
    <div className='container'>
<div className='flex-container'>
      <div className='flex-item-left'>
      <label className="file-upload-btn">
  <input className='uploadFile' type="file" accept="image/*" onChange={handleImageChange} />
  <button className="btn custom-upload-btn">
          <FontAwesomeIcon icon={faCloudUploadAlt} className="upload-icon" />
          <span className="button-text">Upload PAN Image</span>
        </button>

</label>
      {selectedImage && (
        <div>
          <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}
      </div>
      <div className='flex-item-right'>
        <div className='form-group'>
        <label>
        Enter 10 Digit PAN Num </label>
        <input
          type="text"
          className="form-control"
          value={enteredPanNumber}
          onChange={(e) => setEnteredPanNumber(e.target.value)}
          maxLength={10}
        />
        <span className={isPanNumberValid() ? 'text-success' : 'text-danger'}>
          {enteredPanNumber.length} / 10
        </span>
      
        </div>
        <div className='form-group'>
        <button
        className={`btn form-control ${isPanNumberValid() ? 'btn-success' : 'btn-secondary'}`}
        onClick={handleManualVerifyClick}
        disabled={!isPanNumberValid()}
      >
        Verify
      </button>
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
     
      {verificationResult !== null && (
        <div>
          {verificationResult ? (
            <p style={{ color: 'green' }}>Verification Result: Verified</p>
          ) : (
            <p style={{ color: 'red' }}>Verification Result: Not Verified</p>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default PanVerificationComponent;
