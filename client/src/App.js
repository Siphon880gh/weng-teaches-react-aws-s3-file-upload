import { useState, useEffect} from "react";
import logo from './logo.svg';
import './App.css';

function App() {

  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaName, setMediaName] = useState('');
  const [purgeCache, setPurgeCache] = useState('');

  const handleMedia = (e) => {
    const selectedMedia = e.target.files[0];
    setMediaName(selectedMedia.name);


    const formData = new FormData();
    formData.append('file', selectedMedia);
    handleBackend(formData);
  } // handleMedia

  const handleBackend = async (formData) => {
    console.log({formData})

    try {
      const response = await fetch("/uploads", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        console.log("Upload successful");
        var result = await response.json();
        console.log("Server response: ", result); // Log the entire result object
        console.log({result});

        setMediaUrl(result.url)
      } else {
        console.error("Upload unsuccessful");
      }

    } catch (error) {
      console.error(error);
    }
  } // handleBackend


  return (
    <div className="App">
      <header className="App-header">
        <h1>Test Upload: AWS S3</h1>
        <p>Upload an image. AWS S3 image and link will appear. - Weng</p>

        <img src={mediaUrl?mediaUrl:logo} className={mediaName?"Image-preview":"App-logo"} alt="logo" />
        <form onSubmit={(event) => { event.preventDefault(); }}>
          <input type="file" id="upload-file" onChange={handleMedia} />
          {mediaUrl?(<a href={mediaUrl} target="_blank">{mediaUrl}</a>):""}
          <label class="d-block small" for="upload-file">{mediaName?mediaName:"Choose File"} </label>
        </form>
        <br/><br/>

      </header>
    </div>
  );
}

export default App;
