import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Registerform(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileerror] = useState("");
  const [dobError, setDoberror] = useState("");
  const [profilePhoto, setProfilephoto] = useState();
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    workemail: "",
    mobile: "",
    dob: "",
    gender: "",
  });

  const [openModal, setOpenModal] = React.useState(false);

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  function validateDomain(email, companyName) {
    return companyName.some((val) => email.includes(val));
  }

  function validateEmail(e) {
    if (
      !validateDomain(data.workemail, [
        "jmangroup.com",
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
      ])
    ) {
      setEmailError("please enter email with valid domain name");
    } else if (
      validateDomain(data.workemail, [
        "jmangroup.com",
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
      ])
    ) {
      setEmailError("");
    }
  }

  function validateMobile(e) {
    if (
      (data.mobile.length > 10 || data.mobile.length < 10) &&
      !data.mobile.match("[0-9]{10}")
    ) {
      setMobileerror("Please enter valid mobile number");
    } else {
      setMobileerror("");
    }
  }

  function validateDob(e) {
    const date = new Date(data.dob);
    const userAge = 2022 - date.getFullYear();
    if (userAge < 18) {
      setDoberror("Age must be above 18");
    } else {
      setDoberror("");
    }
  }

  // Method to avoid duplicate records
  const [isPresent, setPresent] = useState();
  function checkDuplicacy() {
    fetch("http://localhost:3001/check_user_event_details", {
      method: "POST",
      body: JSON.stringify({
        email: data.workemail,
        eventId: props.id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())

      .then((data) => {
        console.log("exists: ", data[0].exists);
        setPresent(data[0].exists);
      });
  }

  useEffect(() => {
    console.log("isPresent: " + isPresent)
    console.log("data.workemail: " + data.workemail)
    console.log("props.id: " + props.id)
    checkDuplicacy();
  }, [data.workemail]);

  function submit(e) {
    if (isPresent) {
      toast.error("You have already registered for this event!", {
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        position: toast.POSITION.TOP_CENTER,
      });
      e.preventDefault();
    } else if (
      data.firstname !== "" &&
      data.lastname !== "" &&
      data.workemail !== "" &&
      data.mobile !== "" &&
      data.dob !== "" &&
      data.gender !== ""
    ) {
      fetch("http://localhost:3001/user_event_details", {
        method: "POST",
        body: JSON.stringify({
          user_firstname: data.firstname,
          user_lasttname: data.lastname,
          user_work_email: data.workemail,
          user_mobile: data.mobile,
          user_dob: data.dob,
          user_gender: data.gender,
          user_image: profilePhoto,
          event_id: props.id,
          event_category: props.category,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response: ", data);
        })
        .catch((err) => {
          console.log(err.message);
        });
      handleClickOpenModal();
      e.preventDefault();

    } else {
      toast.error("Please enter all the details", {
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        position: toast.POSITION.TOP_CENTER,
      });
      e.preventDefault();
    }
  }

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    console.log(newData);
  }
  const image = async (e) => {
    const file = e.target.files[0];
    if (file.size > 20000) {
      toast.error("please upload a file with the size <= 20kb", {
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      const base64 = await convertBase64(file);
      console.log(base64);
      setProfilephoto(base64);
    }
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  return (
    <div>
      <Button onClick={handleOpen}>Register</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            class="form-heading"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Registration Form
          </Typography>
          <hr />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label className="label">
                        First Name<span style={{ color: "red" }}>*</span>
                      </label>
                    </td>
                    <td>
                      <input
                        onChange={(e) => handle(e)}
                        value={data.firstname}
                        className="input"
                        id="firstname"
                        placeholder="First Name"
                        type="text"
                      ></input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="label">
                        Last Name<span style={{ color: "red" }}>*</span>
                      </label>
                    </td>
                    <td>
                      <input
                        className="input"
                        onChange={(e) => handle(e)}
                        value={data.lastname}
                        id="lastname"
                        placeholder="Last Name"
                        type="text"
                      ></input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="label">
                        Work Email<span style={{ color: "red" }}>*</span>
                      </label>
                    </td>
                    <td>
                      <input
                        className="input"
                        onChange={(e) => {
                          handle(e);
                        }}
                        value={data.workemail}
                        id="workemail"
                        placeholder="Work Email"
                        type="email"
                      ></input>
                      <span style={{ color: "red" }}>{emailError}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="label">
                        Mobile Number<span style={{ color: "red" }}>*</span>
                      </label>
                    </td>
                    <td>
                      <input
                        className="input"
                        onChange={(e) => {
                          handle(e);
                        }}
                        value={data.mobile}
                        id="mobile"
                        placeholder="Mobile Number"
                        type="tel"
                      ></input>
                      <span style={{ color: "red" }}>{mobileError}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="label">
                        DOB<span style={{ color: "red" }}>*</span>
                      </label>
                    </td>
                    <td>
                      <input
                        className="input date-width"
                        onChange={(e) => handle(e)}
                        value={data.dob}
                        id="dob"
                        placeholder="Date Of Birth"
                        type="date"
                      ></input>
                      <span style={{ color: "red" }}>{dobError}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="label">
                        Gender<span style={{ color: "red" }}>*</span>
                      </label>
                      <br />
                    </td>
                    <td>
                      <select
                        className="input select-width"
                        onChange={(e) => handle(e)}
                        value={data.gender}
                        id="gender"
                        placeholder="gender"
                      >
                        <option className="input" value="null">
                          Select
                        </option>
                        <option className="input" value="Male">
                          Male
                        </option>
                        <option className="input" value="Female">
                          Female
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="label">
                        Upload Profile Photo
                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </td>
                    <td>
                      <input
                        type="file"
                        id="profile"
                        name="profile"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={(e) => image(e)}
                      ></input>
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr />
              <div class="text-center">
                <button
                  type="submit"
                  class="btn btn-success"
                  onClick={(e) => {
                    validateEmail(e);
                    validateMobile(e);
                    validateDob(e);
                    submit(e);
                  }}
                >
                  Register
                </button>

                {openModal ? (
                  <BootstrapDialog
                    onClose={handleCloseModal}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                  >
                    <BootstrapDialogTitle
                      id="customized-dialog-title"
                      onClose={handleCloseModal}
                      sx={{ color: "success.dark" }}
                    >
                      Congratulations!
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                      <Typography gutterBottom>
                        <p>Hii,{" "}
                          <span className="font-weight-bold">
                            {data.firstname}
                          </span>{"! "}
                          You have successfully registered for the event.</p>
                        <p>Your request is{" "}
                          <span className="font-weight-bold">under process</span>.</p><br /> <p>Kindly wait for the admin to
                            approve your request. You will get a confirmation email soon.</p><br /> Thank you.

                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        autoFocus
                        onClick={() => {
                          handleCloseModal();
                          handleClose();
                          setData("")
                        }}
                        color="primary" variant="raised"
                      >
                        Ok
                      </Button>
                    </DialogActions>
                  </BootstrapDialog>
                ) : null}
              </div>
            </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
