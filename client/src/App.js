import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post('http://localhost:5000/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponseData(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to upload and process the image.');
      setResponseData(null);
    }
  };

  return (
    <div className="App">
      <h1>Google Vision OCR and Translate</h1>

      <div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload and Process</button>
      </div>

      {error && <p className="error">{error}</p>}

      {responseData && (
        <div className="result">
          <h2>Uploaded Image</h2>
          <img src={responseData.imageUrl} alt="Uploaded" width="300" />
          <h3>Original Text:</h3>
          <p>{responseData.originalText}</p>
          <h3>Translated Text:</h3>
          <p>{responseData.translatedText}</p>
          <h3>Product Name:</h3>
          <p>{responseData.productName}</p>
        </div>
      )}
    </div>
  );
}

export default App;

// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [responseData, setResponseData] = useState(null);
//   const [error, setError] = useState(null);

//   const onFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const onFileUpload = async () => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append('image', selectedFile);

//     try {
//       const res = await axios.post('http://localhost:5000/upload-image', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setResponseData(res.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to upload and process the image.');
//       setResponseData(null);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Google Vision OCR and Translate</h1>

//       <div>
//         <input type="file" onChange={onFileChange} />
//         <button onClick={onFileUpload}>Upload and Process</button>
//       </div>

//       {error && <p className="error">{error}</p>}

//       {responseData && (
//         <div className="result">
//           <h2>Uploaded Image</h2>
//           <img src={responseData.imageUrl} alt="Uploaded" width="300" />
//           <h3>Original Text:</h3>
//           <p>{responseData.originalText}</p>
//           <h3>Translated Text:</h3>
//           <p>{responseData.translatedText}</p>
//           <h3>Product Name:</h3>
//           <p>{responseData.productName}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

