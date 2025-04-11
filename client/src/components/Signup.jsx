// import { useState } from "react";

// function Login() {

//     const [image, setImage] = useState(null);
//     const [preview, setPreview] = useState(null);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file && file.type.startsWith("image/")) {
//             setImage(file);
//             setPreview(URL.createObjectURL(file));
//         } else {
//             alert("Please select a valid image file");
//         }
//     };

//     const style = {
//         inputFields: {
//             height: '40px',
//             width: '20rem'
//         }
//     }
//     return (
//         <div>
//             <div>Signup</div>
//             <div style={{ marginTop: '40px' }}>
//                 <input style={style.inputFields} type="text" placeholder="Email" />
//             </div>
//             <div >
//                 <input style={style.inputFields} type="password" placeholder="Password" />
//             </div>
//             <div>
//                 <h4>Upload Profile Picture</h4>
//                 <div>
//                     {preview ?
//                         <img style={{ height: '100px', width: '100px' }} src={preview} alt="Profile Preview" /> : 
//                         <div>No image selected</div>
//                     }
//                 </div>
//                 <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                     /></div>
//                 <div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Login



import { useState } from "react";
import axios from "axios"; // Make sure axios is installed
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
const Navigate =useNavigate()
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!image) newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      console.log("image---",file)
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Success:", response.data);
      // Reset or redirect
      localStorage.setItem("token",response.data.token)
      Navigate("/Blog")
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  const style = {
    inputFields: {
      height: "40px",
      width: "20rem",
      marginBottom: "10px",
    },
    error: {
      color: "red",
      fontSize: "12px",
      marginBottom: "5px",
    },
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: "20px" }}>
          <input
            style={style.inputFields}
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div style={style.error}>{errors.email}</div>}
        </div>
        <div>
          <input
            style={style.inputFields}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div style={style.error}>{errors.password}</div>}
        </div>

        <div>
          <h4>Upload Profile Picture</h4>
          <div>
            {preview ? (
              <img style={{ height: "100px", width: "100px", borderRadius: "50%" }} src={preview} alt="Preview" />
            ) : (
              <div>No image selected</div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          {errors.image && <div style={style.error}>{errors.image}</div>}
        </div>

        <div style={{ marginTop: "20px" }}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;

