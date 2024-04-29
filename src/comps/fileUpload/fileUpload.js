import { useEffect, useState, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './fileUpload.css'

export default function FileUpload({core}) {
  const [cv, setCv] = useState(null);

  // Initialize Firebase app
  useEffect(() => {
    const firebaseConfig = process.env.REACT_APP_firebaseConfig;
    const app = initializeApp(firebaseConfig);
  }, []);

  //send msg with file
  const sendFile = useCallback((downloadURL) => {
      core.current.sendMessage({ type: 'file', url:  downloadURL });
  }, []);

  //upload to firebase
  const uploadFile = () => {
    const storage = getStorage();
    const storageRef = ref(storage, '/cv.pdf');
    const uploadTask = uploadBytesResumable(storageRef, cv);

    uploadTask.on('state_changed',
      (snapshot) => {
        console.log('snapshot', snapshot);
      },
      (error) => {
        console.error(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File uploaded successfully!', downloadURL);
              sendFile(downloadURL)
          });
      }
    );
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={(e) => setCv(e.target.files[0])} />
      <button className="button-upload" onClick={uploadFile}>Upload</button>
    </div>
  );
}
