Node.js installed
A Google Cloud account
A key.json file from Google Cloud API (e.g., for Vision API, Translate API, etc.)
MongoDB (optional, for storing data)

/root
│
├── /client/ # React Front-end
│ └── src/
│ └── App.js # Front-end code
│
├── /server/ # Node.js Back-end
│ ├── app.js # API server setup (Express.js)
│ ├── models/
│ │ └── ImageData.js # Mongoose model (optional)
│ └── config/
│ └── key.json # Google Cloud API key (Server-side only, never exposed)
│
└── README.md

git clone (https://github.com/Shivam1910/optical_character_recognition.git)
cd react-node-google-cloud

cd server
npm install

cd ../client
npm install

MONGO_URI=mongodb://localhost:127.0.0.1:27017/yourdb
PORT=5000

Place your key.json file inside the server/config directory.
Important: Add key.json to your .gitignore to ensure it is not pushed to version control.
