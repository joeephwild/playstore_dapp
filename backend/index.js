const express = require("express");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// initializing firebase
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require("./decentraplay-firebase-adminsdk-anvcw-da3edbe5b8.json");

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'decentraplay.appspot.com'
});

const bucket = getStorage().bucket();
const storage = multer.memoryStorage();

const db = getFirestore();

const app = express();
const port = process.env.PORT || 3300;

// Enable CORS for any origin
app.use(cors({
    origin: '*', // Allow requests from any origin
    credentials: true, // Include if you're using credentials (e.g., cookies, authorization headers)
}));

app.use(express.json());

const startServer = async () => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Example app listening on port ${port}`);
    });
};

app.get("/", (req, res) => {
    res.send("Hello World!");
});
  
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000000 },
}).single('file');

app.post("/uploadFile", async (req, res) => {
    let fileURL;
    upload(req, res, async (err) => {
      if (err) {
        console.error('error uploading file:', err);
        res.status(500).json({ error: err.message });
      } else {
        if (!req.file) {
          res.status(400).json({ error: 'No file uploaded' });
        } else {
          try {
            const file = req.file;
            const fileName = file.originalname;
  
            const fileUpload = bucket.file(fileName);
  
            const fileStream = fileUpload.createWriteStream({
              metadata: {
                contentType: file.mimetype
              }
            });

            fileStream.on('error', (error) => {
              console.error('Error uploading to Firebase:', error);
              res.status(500).json({ error: 'Error uploading to Firebase' });
            });

            fileStream.on('finish', () => {
              fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;
              console.log('File uploaded to Firebase. Download URL:', fileURL);
              res.status(200).json({ response: 'File uploaded successfully', url: fileURL });
            });
  
            fileStream.end(file.buffer);
          } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({ error: 'Error uploading file' });
          }
        }
      }
    });
});

app.post("/createApp", async (req, res) => {
    try {
        const appRef = db.collection('applications');
        const appCountRef = db.collection('appCount');

        const _count = await appCountRef.doc('count').get();
        const count = _count.data().count;
        const newCount = count + 1;

        const body = req.body;
        const packCount = { packCount: 1 };
        body = { ...body, ...packCount};
        await appRef.doc(`${count}`).set(req.body);
        await appCountRef.doc('count').update({ count: newCount });

        res.status(200).json({ response: "successful"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
})

app.post("/createAppPack/:appId", async (req, res) => {
    const appId = req.params.appId;
    try {
        const packRef = db.collection('applications').doc(appId).collection(packs);
        const packCountRef = db.collection('applications').doc(appId);

        const _count = await packCountRef.get();
        const count = _count.data().packCount;
        const newCount = count + 1;

        await packRef.doc(`${count}`).set(req.body);
        await appCountRef.update({ packCount: newCount });

        res.status(200).json({ response: "successful"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
})

app.get("/getApp/:appId/:packId", async (req, res) => {
    const appId = req.params.appId;
    const packId = req.params.appId;
    try {
        if (packId == 0) {
            // return app details
            const appDoc = await db.collection("applications").doc(appId).get();
            const appDetails = {
                image: appDoc.data().image,
                title: appDoc.data().title,
                type: appDoc.data().type,
                rating: appDoc.data().rating,
                size: appDoc.data().size,
                screenshot: appDoc.data().screenshot,
                creators: appDoc.data().creators,
                isFree: appDoc.data().isFree
            }

            res.status(200);
            res.json(appDetails);

        } else {
            const packDoc = await db.collection("applications").doc(appId).collection("packs").doc(packId).get();
            res.status(200);
            res.json(packDoc);
        }
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json({ error: error.message });
    }
})