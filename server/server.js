// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const vision = require('@google-cloud/vision');
// const { Translate } = require('@google-cloud/translate').v2;
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const mongoose = require('mongoose');
// const ImageData = require('./models/ImageData');

// // Initialize app and middleware
// const app = express();
// app.use(cors());
// app.use(bodyParser.json({ limit: '10mb' }));

// // Load environment variables
// require('dotenv').config();

// const visionClient = new vision.ImageAnnotatorClient({
//     keyFilename: 'D:\\core python projects\\G_Vision\\server\\config\\vision-translate-key.json', // Direct absolute path
// });

// const translate = new Translate({
//     keyFilename: 'D:\\core python projects\\G_Vision\\server\\config\\vision-translate-key.json', // Direct absolute path
// });


// // Multer config for file uploads
// const upload = multer({ dest: 'uploads/' });

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // POST route to upload an image
// app.post('/upload-image', upload.single('image'), async (req, res) => {
//     try {
//         const filePath = req.file.path;

//         // Step 1: Extract text from image using Vision API
//         const [result] = await visionClient.textDetection(filePath);
//         const detections = result.textAnnotations;

//         if (detections.length > 0) {
//             const extractedText = detections[0].description;

//             // Step 2: Translate the extracted text to English using Translate API
//             const [translatedText] = await translate.translate(extractedText, 'en');

//             // Step 3: Save image data to MongoDB
//             const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//             const imageData = new ImageData({
//                 imageUrl,
//                 originalText: extractedText,
//                 translatedText,
//             });
//             await imageData.save();

//             // Cleanup uploaded image after processing
//             fs.unlinkSync(filePath);

//             // Respond with the image and extracted/translated text
//             res.status(200).json({ imageUrl, originalText: extractedText, translatedText });
//         } else {
//             fs.unlinkSync(filePath);
//             res.status(400).json({ message: 'No text found in the image' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         if (req.file && req.file.path) {
//             fs.unlinkSync(req.file.path);
//         }
//         res.status(500).json({ message: 'Error processing the image' });
//     }
// });

// // Serve uploaded images statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Start the server
// app.listen(5000, () => {
//     console.log('Server running on port 5000');
// });


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const vision = require('@google-cloud/vision');
const { Translate } = require('@google-cloud/translate').v2;
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ImageData = require('./models/ImageData');

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Load environment variables
require('dotenv').config();

const visionClient = new vision.ImageAnnotatorClient({
    keyFilename: 'D:\\core python projects\\G_Vision\\server\\config\\vision-translate-key.json',
});

const translate = new Translate({
    keyFilename: 'D:\\core python projects\\G_Vision\\server\\config\\vision-translate-key.json',
});

// Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Function to extract product name using regex
function extractProductName(text) {
    const regexPatterns = [
        /UN PROPER SHIPPING NAME:\s*(.*)/i,   // Matches: "UN PROPER SHIPPING NAME: <product name>"
        /FORMAL FORTUNE NAME:\s*(.*)/i,
        /PRODUCT NAME:\s*(.*)/i,                  // Matches: "PRODUCT NAME: <product name>"
        /ITEM NAME:\s*(.*)/i,                     // Matches: "ITEM NAME: <product name>"
        /TRADE NAME:\s*(.*)/i,                    // Matches: "TRADE NAME: <product name>"
        /DESCRIPTION:\s*(.*)/i,
        /SKU:\s*(.*)/i,                           // Matches: "SKU: <product name>"
        /UPC:\s*(.*)/i,                           // Matches: "UPC: <product name>"
        /Part Number:\s*(.*)/i,                   // Matches: "Part Number: <product name>"
        /Catalog Number:\s*(.*)/i        // Matches: "FORMAL FORTUNE NAME: <product name>"
    ];

    for (const pattern of regexPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return null; // Return null if no product name found
}

// POST route to upload an image
app.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Step 1: Extract text from image using Vision API
        const [result] = await visionClient.textDetection(filePath);
        const detections = result.textAnnotations;

        if (detections.length > 0) {
            const extractedText = detections[0].description;

            // Step 2: Translate the extracted text to English using Translate API
            const [translatedText] = await translate.translate(extractedText, 'en');

            // Step 3: Extract product name using regex
            const productName = extractProductName(extractedText);

            // Step 4: Save image data to MongoDB
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            const imageData = new ImageData({
                imageUrl,
                originalText: extractedText,
                translatedText,
                productName: productName || 'Product name not found',
            });
            await imageData.save();

            // Cleanup uploaded image after processing
            fs.unlinkSync(filePath);

            // Respond with the image, extracted text, translated text, and product name
            res.status(200).json({
                imageUrl,
                originalText: extractedText,
                translatedText,
                productName: productName || 'Product name not found',
            });
        } else {
            fs.unlinkSync(filePath);
            res.status(400).json({ message: 'No text found in the image' });
        }
    } catch (error) {
        console.error('Error:', error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error processing the image' });
    }
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
