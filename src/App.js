import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [allImage, setAllImage] = useState(null);

  useEffect(() => {
    getImage();
  }, []);


  const submitImage = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
  
    try {
      const result = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result);
      // Clear form fields after successful submission if needed
      setName("");
      setEmail("");
      setPassword("");
      setImage(null);
      // Fetch all images after successful submission
      setTimeout(() => {
        getImage();
      }, 1000);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error here
    }
  };
  


  const getImage = async () => {
    const result = await axios.get("http://localhost:5000/api/auth/get-image");
    console.log(result);
    setAllImage(result.data.data);
  };

  return (
    <div>
      <form onSubmit={ submitImage }>
        <input type="text" value={ name } onChange={ (e) => setName(e.target.value) } placeholder="Name" />
        <br />
        <input type="text" value={ email } onChange={ (e) => setEmail(e.target.value) } placeholder="Email" />
        <br />
        <input type="password" value={ password } onChange={ (e) => setPassword(e.target.value) } placeholder="Password" />
        <br />
        <input type="file" accept="image/*" onChange={ (e) => setImage(e.target.files[0]) }></input>
        <button type="submit">Submit</button>
      </form>

      {
        allImage && allImage.map((data, index) => (
          <img height={ 100 } width={ 100 } src={ require(`./images/${data.image}`) } />
        ))
      }
    </div>
  );
}
export default App;
