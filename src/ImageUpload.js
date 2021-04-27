import React,{useState} from 'react'
import {Button} from "@material-ui/core";
import {storage,db} from "./firebase";
import firebase from 'firebase';
import './ImageUpload.css';




function ImageUpload({username}) {
  const [caption,setCaption] = useState('');//for caption input
  //const [url,setUrl] = useState('');
  const [progress,setProgress] = useState(0);//for progress bar while fetching the image from file manager
  const [image,setImage] = useState(null);




  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }//this code means select the file which you selected and set that image
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);//here wee are taking reference from storage..then creating new folder named as images. then image.name is basically the image file that we have selected.put(image) means we are storing/putting that image into our folder that we have created.
    uploadTask.on(
      "state_change",
      (snapshot) => {
        //progress function or progress bar
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {  //if anything goes wrong during uploading task, error function will occur
        //error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function... 
        storage
          .ref("images")//getting reference image folder that we creted upper again.
          .child(image.name)//its like append image into that folder.
          .getDownloadURL()//getting downloading url
          .then(url => {
            //storing post image inside db
            db.collection("posts").add({ //passing props timestamp,caption,imageUrl
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption, 
              imageUrl: url,  //url is that downloaded url  
              username:username 
            });

              setProgress(0);
              setCaption("");
              setImage(null);

          })
      }
    )
  }



  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />

      {/*having caption input,file picker,post button to choose your image from file manager*/}
      <input 
        type="text" 
        placeholder="Enter caption here..."
        onChange={event => setCaption(event.target.value)} 
        //value={}
      />
      <input 
        type="file" 
        onChange={handleChange} 
      />
      <Button className="imageupload__button" onClick={handleUpload}>Upload</Button>
    </div>
  )
}

export default ImageUpload
