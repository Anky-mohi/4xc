import React, { useState } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import {
  Box,
  Button,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Alert,
  Divider,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSpring, animated } from "@react-spring/web";
import { Diversity2Outlined } from "@mui/icons-material";

const Fade = React.forwardRef(function Fade(props, ref) {
  const { children, in: open, onClick, onEnter, onExited, ...other } = props;

  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "80%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  overflowX: "hidden",
};

KycModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function KycModal({ open, onClose }) {
  const [step, setStep] = useState(1); // New state to track current step
  const currencySet = ["USD", "EUR", "GBP"];
  const [formData, setFormData] = useState({
    selectedCurrency: "",
    docs: "",
    phone: "",
    reason: "",
    employment: "",
    firstName: "",
    lastName: "",
    dob: null,
    confirmMatch: false,
    taxResidence: "",
    taxId: "",
    address1: "",
    address2: "",
    town: "",
    selectedState: "",
    zip: "",
    uscitizen: "",
  });

  const stateList = [
    { value: "", label: "Select a state" },
    { value: "AC", label: "Acre (AC)" },
    { value: "AL", label: "Alagoas (AL)" },
    { value: "AP", label: "Amapá (AP)" },
    { value: "AM", label: "Amazonas (AM)" },
    { value: "BA", label: "Bahia (BA)" },
    { value: "CE", label: "Ceará (CE)" },
    { value: "DF", label: "Distrito Federal (DF)" },
    { value: "ES", label: "Espírito Santo (ES)" },
    { value: "GO", label: "Goiás (GO)" },
    { value: "MA", label: "Maranhão (MA)" },
    { value: "MT", label: "Mato Grosso (MT)" },
    { value: "MS", label: "Mato Grosso do Sul (MS)" },
    { value: "MG", label: "Minas Gerais (MG)" },
    { value: "PA", label: "Pará (PA)" },
    { value: "PB", label: "Paraíba (PB)" },
    { value: "PR", label: "Paraná (PR)" },
    { value: "PE", label: "Pernambuco (PE)" },
    { value: "PI", label: "Piauí (PI)" },
    { value: "RJ", label: "Rio de Janeiro (RJ)" },
    { value: "RN", label: "Rio Grande do Norte (RN)" },
    { value: "RS", label: "Rio Grande do Sul (RS)" },
    { value: "RO", label: "Rondônia (RO)" },
    { value: "RR", label: "Roraima (RR)" },
    { value: "SC", label: "Santa Catarina (SC)" },
    { value: "SP", label: "São Paulo (SP)" },
    { value: "SE", label: "Sergipe (SE)" },
    { value: "TO", label: "Tocantins (TO)" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      return console.log("Final Data:", formData);
      onClose(); // Close modal after the last step
    }
  };
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Dynamic content for each step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Select your preferred currency
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {currencySet.map((currency) => (
                <Grid item xs={4} key={currency}>
                  <Box
                    textAlign="center"
                    sx={{
                      padding: "16px",
                      border:
                        formData.selectedCurrency === currency
                          ? "2px solid #E50000"
                          : "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "border 0.3s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      "&:hover": {
                        border:
                          formData.selectedCurrency !== currency
                            ? "1px solid #E0E0E0"
                            : "2px solid #E50000",
                      },
                    }}
                    onClick={() =>
                      handleInputChange("selectedCurrency", currency)
                    }
                  >
                    <img
                      src={`path_to_${currency.toLowerCase()}_icon`}
                      alt={`${currency} Icon`}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginBottom: "8px",
                      }}
                    />
                    <Typography>
                      {currency === "USD"
                        ? "US Dollar (USD)"
                        : currency === "EUR"
                        ? "Euro (EUR)"
                        : "Pound Sterling (GBP)"}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "100%" },
                width: "80%",
                mx: "auto",
              }}
              noValidate
              autoComplete="off"
            >
              <h5 className="mb-3 pt-[40px]">Identity verification</h5>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Document Type *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={formData.docs}
                  label="Document Type"
                  onChange={(e) => handleInputChange("docs", e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"cpf"}>CPF</MenuItem>
                  <MenuItem value={"letter"}>I Want To Do This Letter</MenuItem>
                </Select>
                <FormHelperText>Select your identity document</FormHelperText>
              </FormControl>

              <TextField
                id="outlined-multiline-flexible"
                label="Additional Info"
                value={formData.addinfo}
                onChange={(e) => handleInputChange("addinfo", e.target.value)}
                multiline
                maxRows={4}
                sx={{ mb: 2 }}
              />

              <h5 className="mb-3 pt-[40px]">Details</h5>
              <Box className="flex flex-col gap-4 border border-gray-400 rounded-lg p-4">
                <Alert severity="warning">
                  To avoid delays, enter your <b>name</b> and{" "}
                  <b>date of birth</b> exactly as they appear on your identity
                  document.
                </Alert>

                <TextField
                  id="firstName"
                  value={formData.firstname}
                  onChange={(e) =>
                    handleInputChange("firstname", e.target.value)
                  }
                  label="First Name"
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="lastName"
                  label="Last Name"
                  value={formData.lastname}
                  onChange={(e) =>
                    handleInputChange("lastname", e.target.value)
                  }
                  variant="outlined"
                  fullWidth
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    fullWidth
                    sx={{ mt: 1 }}
                    renderInput={(props) => <TextField {...props} />}
                  />
                </LocalizationProvider>

                <FormControlLabel
                  control={<Checkbox />}
                  label="I confirm that the name and date of birth above match my chosen identity document"
                  sx={{ mt: 2 }}
                />
              </Box>

              <h5 className="mb-3 pt-[40px]">Additional information</h5>
              <Box className="flex flex-col gap-4 border border-gray-400 rounded-lg p-4">
                <TextField
                  id="phone"
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 555-5555"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+1</InputAdornment>
                    ),
                  }}
                  // Optional: Add inputProps for phone number validation
                  inputProps={{
                    pattern: "[0-9]*",
                    maxLength: 15,
                  }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Account Opening Reason
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.reason}
                    label="Add Reason"
                    onChange={(e) =>
                      handleInputChange("reason", e.target.value)
                    }
                  >
                    <MenuItem value="hedging">
                      <em>Hedging</em>
                    </MenuItem>
                    <MenuItem value={"earning"}>Income Earning</MenuItem>
                    <MenuItem value={"speculative"}>Speculative</MenuItem>
                  </Select>
                  <FormHelperText>Select your identity document</FormHelperText>
                </FormControl>
              </Box>
            </Box>
          </>
        );
      case 3:
        return (
          <>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "100%" },
                width: "80%",
                mx: "auto",
              }}
              noValidate
              autoComplete="off"
            >
              <h5 className="mb-3 pt-[40px]">Identity verification</h5>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Employment Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Employment Status"
                  value={formData.employment}
                  onChange={(e) =>
                    handleInputChange("employment", e.target.value)
                  }
                >
                  <MenuItem value={"employed"}>Employed</MenuItem>
                  <MenuItem value={"pensioner"}>Pensioner</MenuItem>
                  <MenuItem value={"serfEmployed"}>Self-Employed</MenuItem>
                  <MenuItem value={"student"}>Student</MenuItem>
                  <MenuItem value={"unemployed"}>Unemployed</MenuItem>
                </Select>
                <FormHelperText>Select your identity document</FormHelperText>
              </FormControl>
              <TextField
                id="outlined-multiline-flexible"
                label="Tex Residence"
                value={formData.taxResidence}
                onChange={(e) =>
                  handleInputChange("taxResidence", e.target.value)
                }
                multiline
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Tex identification number"
                value={formData.taxId}
                onChange={(e) => handleInputChange("taxId", e.target.value)}
                multiline
              />
              <FormControlLabel
                control={<Checkbox />}
                label="I confirm that my tax information is accurate and complete."
                sx={{ mt: 2 }}
              />
            </Box>
          </>
        );
      case 4:
        return (
          <>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "100%" },
                width: "80%",
                mx: "auto",
              }}
              noValidate
              autoComplete="off"
            >
              <h5 className="mb-3 pt-[40px]">Address</h5>
              <TextField
                id="outlined-multiline-flexible"
                label="First Line Of Address"
                value={formData.address1}
                onChange={(e) => handleInputChange("address1", e.target.value)}
                multiline
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Second Line of Address"
                value={formData.address2}
                onChange={(e) => handleInputChange("address2", e.target.value)}
                multiline
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Town/City"
                value={formData.town}
                onChange={(e) => handleInputChange("town", e.target.value)}
                multiline
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  State/Province
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={formData.selectedState}
                  label="Select State"
                  onChange={(e) =>
                    handleInputChange("selectedState", e.target.value)
                  }
                >
                  {stateList.map((el) => (
                    <MenuItem key={el.value} value={el.value}>
                      {el.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select your identity document</FormHelperText>
              </FormControl>
              <TextField
                id="outlined-multiline-flexible"
                label="Postal/ZIP Code"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                multiline
              />
            </Box>
          </>
        );
      case 5:
        return (
          <>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "100%" },
                width: "80%",
                mx: "auto",
              }}
              noValidate
              autoComplete="off"
            >
              <div className="pt-[40px] pb-[20px]">
                <h6>Jurisdiction and choice of law</h6>
                <p>
                  Your account will be opened with Deriv (SVG) LLC, and will be
                  subject to the laws of Saint Vincent and the Grenadines.
                </p>
              </div>

              <Divider />
              <div className="pt-[40px] pb-[20px]">
                <h6>Risk warning</h6>
                <p>
                  The financial trading services offered on this site are only
                  suitable for customers who accept the possibility of losing
                  all the money they invest and who understand and have
                  experience of the risk involved in the purchase of financial
                  contracts. Transactions in financial contracts carry a high
                  degree of risk. If the contracts you purchased expire as
                  worthless, you will lose all your investment, which includes
                  the contract premium.
                </p>
              </div>
              <Divider />
              <div className="pt-[40px] pb-[20px]">
                <h6>FATCA declaration</h6>
                <ol>
                  <li>
                    US citizenship or lawful permanent resident (green card)
                    status
                  </li>
                  <li>A US birthplace</li>
                  <li>
                    A US residence address or a US correspondence address
                    (including a US PO box)
                  </li>
                  <li>
                    Standing instructions to transfer funds to an account
                    maintained in the United States, or directions regularly
                    received from a US address
                  </li>
                  <li>
                    An “in care of” address or a “hold mail” address that is the
                    sole address with respect to the client
                  </li>
                  <li>
                    A power of attorney or signatory authority granted to a
                    person with a US address
                  </li>
                </ol>
                <p>
                  If any of the above applies to you, select <b>Yes</b>.
                  Otherwise, select <b>No</b>.
                </p>

                <FormControl fullWidth sx={{ mb: 2, mt: 3 }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Are You US citizen
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.uscitizen}
                    label="Document Type"
                    onChange={(e) =>
                      handleInputChange("agreeTerms", e.target.value)
                    }
                  >
                    <MenuItem value={"yes"}>Yes</MenuItem>
                    <MenuItem value={"no"}>NO</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Divider />
              <div className="pt-[40px] pb-[20px]">
                <h6>
                  Real accounts are not available to politically exposed persons
                  (PEPs).
                </h6>
                <p>
                  A politically exposed person (PEP) is someone appointed with a
                  prominent public position. Close associates and family members
                  of a PEP are also considered to be PEPs.
                </p>

                <FormControlLabel
                  control={<Checkbox />}
                  label="I am not a PEP, and I have not been a PEP in the last 12 months."
                  sx={{ mt: 2 }}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label=" I agree to the Terms and Conditions"
                  sx={{ mt: 2 }}
                />
              </div>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      aria-labelledby="kyc-modal-title"
      aria-describedby="kyc-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        TransitionComponent: Fade,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Top Content */}
          <Typography
            id="kyc-modal-title"
            variant="h5"
            component="h2"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Add a Deriv Account
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "40px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#E0E0E0",
                  borderRadius: "4px",
                }}
              >
                <Box
                  sx={{
                    width: `${(step / 5) * 100}%`,
                    height: "100%",
                    backgroundColor: "#E50000",
                    borderRadius: "4px",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  position: "absolute",
                  left: "0",
                  zIndex: "111",
                  width: "100%",
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      color: "#fff",
                      width: "25px",
                      height: "25px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: index < step ? "#E50000" : "#444",
                      borderRadius: "100px",
                    }}
                  >
                    {index + 1}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          {renderStepContent()}
          <Divider />
          <div className="flex justify-end gap-[20px] items-center ">
            {/* Bottom Content (Next Button) */}
            {step > 1 ? (
              <button
                className="text-black border border-black hover:bg-black hover:text-black focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={handlePrevStep}
                style={{
                  marginTop: "16px",
                  width: "100px",
                  height: "40px",
                  backgroundColor: "transparent",
                }}
              >
                Previous
              </button>
            ) : (
              ""
            )}

            <button
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
              onClick={handleNextStep}
              disabled={step === 1 && !formData.selectedCurrency}
              style={{
                marginTop: "16px",
                width: "100px",
                height: "40px",
                opacity: step === 1 && !formData.selectedCurrency ? 0.5 : 1,
              }}
            >
              {step < 5 ? "Next" : "Finish"}
            </button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
