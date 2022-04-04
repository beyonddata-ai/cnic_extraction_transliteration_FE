import React, { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import uploadIcon from "../../components/Icons/uploadfile.svg";
import "./styles.css";
import closeIcon from "../../components/Icons/closeicon.svg";

const baseStyle = {
  marginTop: "0.5rem",
  marginLeft: "1.4rem",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  width: "90%",
  height: "168px",
  alignItems: "center",
  paddingTop: "25px",
  borderWidth: 2,
  boxSizing: "border-box",
  borderRadius: "10px",
  color: "#bdbdbd",
  cursor: "pointer",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const errorStyle = {
  border: "1px dashed red",
};

const normalStyle = {
  border: "1px dashed #6D6D6D",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "flex",
  borderRadius: "10px",
  border: "1px solid #eaeaea",
  width: "min-content",
  height: "168px",
  boxSizing: "border-box",
  marginLeft: "95px",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  borderRadius: "10px",
  display: "block",
  height: "100%",
  // width: "inherit",
};

const DropZone = (props) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [errorType, setErrorType] = useState(false);
  const [errorNumber, setErrorNumber] = useState(false);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        if (rejectedFiles[0].errors[0].code === "file-invalid-type") {
          setErrorType(true);
          setError(false);
          setErrorNumber(false);
        } else if (rejectedFiles[0].errors[0].code === "file-too-large") {
          setError(true);
          setErrorType(false);
          setErrorNumber(false);
        } else if (rejectedFiles[0].errors[0].code === "too-many-files") {
          setErrorNumber(true);
          setError(false);
          setErrorType(false);
        }
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onload = () => {
          setFiles([
            {
              file: acceptedFiles[0],
              preview: URL.createObjectURL(acceptedFiles[0]),
              name: props.name,
              base64: reader.result,
            },
          ]);
        };
      }
    },
    maxFiles: 1,
    maxSize: 5242880,
  });

  useEffect(() => {
    if (files.length !== 0) {
      props.setCnicPic((cnicPic) => {
        return { ...cnicPic, [props.name]: files };
      });
    } else {
      props.setCnicPic((cnicPic) => {
        return { ...cnicPic, [props.name]: [] };
      });
    }
  }, [files]);

  useEffect(() => {
    reset();
    props.setCnicPic({});
  }, [props.reset]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(error || errorType || errorNumber ? errorStyle : normalStyle),
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept, error, errorType, errorNumber]
  );

  const removeimg = () => {
    setFiles([]);
    props.setEnableContinue(false);
    props.setCnicExpired(false);
    props.setUnderAge(false);
    props.setInvalidDates(false);
    props.setDifferentCnics(false);
    props.setManualCheck(false);
    props.setCnincNearExpiry(false);
    props.setResponseId("");
    props.setNames({
      eng_name: null,
      eng_fname: null,
      urdu_name: null,
      urdu_fname: null,
    });
    // props.setCnicErrors({
    //   ...props.cnicErrors,
    //   conflictingValues: false,
    //   conflictingValues: false,
    //   conflictingNumbers: false,
    //   cnicExpired: false,
    //   underAge: false,
    //   invalidDates: false,
    //   differentCnics: false,
    //   manualCheck: false,
    //   cnincNearExpiry: false,
    // ;

    setError(false);
    setErrorType(false);
    setErrorNumber(false);
    props.setEnableContinue(false);
    props.setGender("");
  };

  const reset = () => {
    setFiles([]);
    setError(false);
    setErrorType(false);
    setErrorNumber(false);
    props.setEnableContinue(false);
    props.setCnicExpired(false);
    props.setUnderAge(false);
    props.setInvalidDates(false);
    props.setDifferentCnics(false);
    props.setManualCheck(false);
    props.setCnincNearExpiry(false);
    props.setResponseId("");
    props.setNames({
      eng_name: null,
      eng_fname: null,
      urdu_name: null,
      urdu_fname: null,
    });
    props.setGender("");

    // props.setCnicErrors({
    //   ...props.cnicErrors,
    //   conflictingValues: false,
    //   conflictingValues: false,
    //   conflictingNumbers: false,
    //   cnicExpired: false,
    //   underAge: false,
    //   invalidDates: false,
    //   differentCnics: false,
    //   manualCheck: false,
    //   cnincNearExpiry: false,
    // });
  };

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className='drop-zone' style={{ height: "inherit" }}>
      {files.length > 0 ? (
        <div className='container'>
          <aside style={thumbsContainer}>{thumbs}</aside>
          <div className='overlay'>
            <img
              src={closeIcon}
              alt='icon'
              style={{
                cursor: "pointer",
                float: "right",
                marginRight: "10px",
                marginTop: "5px",
              }}
              onClick={removeimg}
            />
          </div>
        </div>
      ) : (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {/* <br /> */}
          <img
            src={uploadIcon}
            alt='upload'
            style={{ marginTop: error ? "15px" : "" }}
          />
          {error ? (
            <p
              style={{
                fontWeight: "normal",
                fontSize: "14px",
                color: "#6D6D6D",
                marginTop: "10px",
              }}>
              Upload{" "}
              {props.name === "front_image" ? "front photo" : "back photo"} of
              CNIC upto 5MBs
            </p>
          ) : (
            <p
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                textAlign: "center",
                color: "#6D6D6D",
                // marginTop: "10px",
              }}>
              Add photo of {props.name === "front_image" ? "front" : "back"}{" "}
              side <br /> of the CNIC
            </p>
          )}

          {error ? (
            <p
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#F087A3",
              }}>
              ERROR: The file size has exceeded the allowed limit
            </p>
          ) : errorType ? (
            <p
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#F087A3",
              }}>
              ERROR: The file type must be JPG, PNG
            </p>
          ) : errorNumber ? (
            <p
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#F087A3",
                textAlign: "center",
              }}>
              ERROR: Multiple files selected. <br />
              Select single file only.
            </p>
          ) : (
            <p
              style={{
                fontSize: "12px",
                fontWeight: "normal",
                marginTop: "-12px",
                textAlign: "center",
              }}>
              Upload your file in JPG, PNG format only. File <br /> size must be
              less than 5MB
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default DropZone;
