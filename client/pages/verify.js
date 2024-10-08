import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Signup.module.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function Verify() {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/v1/user/auth/verifyOtp", {
        code,
        username,
      },
      {
        headers: {
            "x-auth-token": localStorage.getItem("signToken"), 
        },
      },);

      if (response.data.status === 1) {
        setSuccess("Verification successful! Redirecting...");
        // Optionally redirect to dashboard or another page after a timeout
        setTimeout(() => {
          router.push("https://oauth.deriv.com/oauth2/authorize?app_id=64508");
        }, 2000); 
      } else {
        setError(response.data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      setError("Verification failed. Please try again.");
      console.error("Verification error", error);
    }
  };

  return (
    <div className="main">
      <div className={`section-verify ${styles.section}`}>
        <div className="overlay"></div>
        <div className={styles.sizer}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className="w-5/12 m-auto">
                <div className={styles.block_content}>
                  <h1 className={styles.heading}>Verify Account</h1>
                  <h4 className="text-center my-2">Please Check Your Mail You Have Got A Varification Code</h4>
                  {error && <div className="error">{error}</div>}
                  {success && <div className="success">{success}</div>}
                  <Box component="form" fullWidth noValidate autoComplete="off" onSubmit={handleVerify}>
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
                      id="code"
                      label="Verification Code"
                      variant="outlined"
                      margin="normal"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
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
                    <div className="my-6">
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                      >
                        Verify Account
                      </button>
                    </div>
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
