import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Signup.module.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";


export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signup", {
        username,
        email,
        password,
      });
      if (response.data.success) {
        router.push("/dashboard"); 
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="main">
      <div className={`section-signup ${styles.section}`}>
        <div className="overlay"></div>
        <div className={styles.sizer}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className="w-5/12 m-auto">
                <div className={styles.block_content}>
                  <div className={styles.signupH}>
                    <h1 className={styles.heading}>Sign Up</h1>
                  </div>
                  <div className="facebook w-full py-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center w-full justify-center">
                      <svg
                        className="w-6 h-6 mr-2 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.1h3.128V8.41c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.462.098 2.795.143v3.24h-1.918c-1.504 0-1.795.714-1.795 1.76v2.308h3.587l-.467 3.605h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
                      </svg>
                      <span>Continue with Facebook</span>
                    </button>
                  </div>

                  <div className="google w-full py-2">
                    <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center shadow-md w-full justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-2 fill-current"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="#FFC107"
                          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                        <path
                          fill="#FF3D00"
                          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        ></path>
                        <path
                          fill="#4CAF50"
                          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        ></path>
                        <path
                          fill="#1976D2"
                          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </div>
                  <div className={styles.or}>
                    <div className="line"></div>
                    <span>OR</span>
                  </div>
                  <Box component="form" fullWidth noValidate autoComplete="off" onSubmit={handleSignup}>
                    <TextField
                      fullWidth
                      id="username"
                      label="Username"
                      variant="outlined"
                      margin="normal"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#e50914",
                          fontFamily: "Arial",
                          fontWeight: "bold",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e50914",
                            borderWidth: "2px",
                          },
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e50914",
                              borderWidth: "2px",
                            },
                          },
                          "&:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e50914",
                            },
                          },
                        },
                        "& .MuiInputLabel-outlined": {
                          color: "#e50914",
                          fontWeight: "bold",
                          "&.Mui-focused": {
                            color: "#e50914",
                            fontWeight: "bold",
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      id="email"
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#e50914",
                          fontFamily: "Arial",
                          fontWeight: "bold",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e50914",
                            borderWidth: "2px",
                          },
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e50914",
                              borderWidth: "2px",
                            },
                          },
                          "&:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e50914",
                            },
                          },
                        },
                        "& .MuiInputLabel-outlined": {
                          color: "#e50914",
                          fontWeight: "bold",
                          "&.Mui-focused": {
                            color: "#e50914",
                            fontWeight: "bold",
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      id="password"
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#e50914",
                          fontFamily: "Arial",
                          fontWeight: "bold",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e50914",
                            borderWidth: "2px",
                          },
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e50914",
                              borderWidth: "2px",
                            },
                          },
                          "&:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e50914",
                            },
                          },
                        },
                        "& .MuiInputLabel-outlined": {
                          color: "#e50914",
                          fontWeight: "bold",
                          "&.Mui-focused": {
                            color: "#e50914",
                            fontWeight: "bold",
                          },
                        },
                      }}
                    />
                    <button type="submit" className={styles.button}>
                      Sign Up
                    </button>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
