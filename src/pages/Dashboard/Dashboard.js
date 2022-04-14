import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import error from "./../../data.json";
import errorIcon from "./../../components/Icons/errorIcon.svg";
import axios from "axios";
import Webcam from "react-webcam";
import { message } from "antd";
import Cliploader from "../../components/Loader/ClipLoader/ClipLoader";
import Table from "../../components/Table/Table";
import DropZone from "../../components/DropZone/DropZone";
import RadioComponent from "../../components/RadioComponent/RadioComponent";
import ErrorDataModal from "../../components/Modals/ErrorDataModal/ErrorDataModal";
import WebcamDetection from "../../components/WebcamDetection/WebcamDetection";
import CropImage from "../../components/CropImage/CropImage";
import BlurrDetection from "../../components/BlurrDetection/BlurrDetection";

const Dashboard = () => {
  const [rtype, setRtype] = useState({
    type: "",
  });
  const [enableContinue, setEnableContinue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cnicPic, setCnicPic] = useState({ front_image: [], back_image: [] });
  const [cnicExpired, setCnicExpired] = useState(false);
  const [underAge, setUnderAge] = useState(false);
  const [invalidDates, setInvalidDates] = useState(false);
  const [differentCnics, setDifferentCnics] = useState(false);
  const [cnincNearExpiry, setCnincNearExpiry] = useState(false);
  const [manualCheck, setManualCheck] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [backendErr, setBackendErr] = useState(false);
  const [responseId, setResponseId] = useState("");
  const [names, setNames] = useState({
    eng_name: null,
    eng_fname: null,
    urdu_name: null,
    urdu_fname: null,
    name_trans: null,
    fname_trans: null,
  });

  const [chimg, setchimg] = useState(null);

  /// temp
  const [gender, setGender] = useState("");

  const webcamRef = useRef();

  // const [cnicErrors, setCnicErrors] = useState({
  //   cnicExpired: false,
  //   underAge: false,
  //   invalidDates: false,
  //   differentCnics: false,
  //   manualCheck: false,
  //   cnincNearExpiry: false,
  // });
  const [responseCNICNum, setResponseCNICNum] = useState({
    front_cnic: null,
    back_cnic: null,
  });
  const [data, setData] = useState();
  const [reset, setReset] = useState(false);
  const [activeTab, setActiveTab] = useState(false);

  // Setting Data and Continue Button State
  useEffect(() => {
    //console.log(cnicPic);
    //console.log(error);
    if (
      cnicPic.front_image &&
      (cnicPic.front_image.length === 0 || cnicPic.back_image.length === 0)
    ) {
      setData({});
    }
    if (
      cnicPic.front_image &&
      cnicPic.front_image.length !== 0 &&
      cnicPic.back_image.length !== 0
    ) {
      setEnableContinue(true);
    }
  }, [cnicPic]);

  // Radio Button Options
  const getInputs = (e) => {
    setRtype({
      type: e.target.value,
    });
  };

  // Check whether both CNIC numbers Are Same Or Not
  const similarCnic = (front, back) => {
    if (front && back) {
      let first_without_dashes = front.replace(/-/g, "");
      let second_without_dashes = back.replace(/-/g, "");

      if (first_without_dashes[first_without_dashes.length] % 2 === 0) {
        setGender("Female");
      } else {
        setGender("Male");
      }

      let count = 0;

      for (var i = 0; i < first_without_dashes.length; i++) {
        if (first_without_dashes[i] !== second_without_dashes[i]) {
          count = count + 1;
        }
      }

      if (count > 2) {
        setDifferentCnics(true);
        setIsModalVisible(true);
        setManualCheck(false);
        // setCnicErrors({
        //   ...cnicErrors,
        //   differentCnics: true,
        //   manualCheck: false,
        // });
      } else if (count === 2) {
        //console.log("Two numbers are different");
        setDifferentCnics(false);
        setManualCheck(true);
        // setCnicErrors({
        //   ...cnicErrors,
        //   differentCnics: false,
        //   manualCheck: true,
        // });
      }
    }
  };

  // Age Validation
  const ageValidation = (birth, issue) => {
    if (birth && issue) {
      let birth_date_formatter = birth.split("/");
      let birth_date_formatted =
        birth_date_formatter[1] +
        "/" +
        birth_date_formatter[0] +
        "/" +
        birth_date_formatter[2];

      let issue_date_formatter = issue.split("/");
      let issue_date_formatted =
        issue_date_formatter[1] +
        "/" +
        issue_date_formatter[0] +
        "/" +
        issue_date_formatter[2];

      var b_date = new Date(`${birth_date_formatted}`);
      var i_date = new Date(`${issue_date_formatted}`);

      var timeDiff = Math.abs(i_date.getTime() - b_date.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) / 365;

      if (diffDays < 18) {
        setUnderAge(true);
        // setCnicErrors({
        //   ...cnicErrors,
        //   underAge: true,
        // });
      }
    }
  };

  // Dates Validation
  const datesValidation = (birth, issue, expiry) => {
    if (birth && issue && expiry) {
      let birth_date_formatter = birth.split("/");
      let birth_date_formatted =
        birth_date_formatter[1] +
        "/" +
        birth_date_formatter[0] +
        "/" +
        birth_date_formatter[2];

      let issue_date_formatter = issue.split("/");
      let issue_date_formatted =
        issue_date_formatter[1] +
        "/" +
        issue_date_formatter[0] +
        "/" +
        issue_date_formatter[2];

      let expiry_date_formatter = expiry.split("/");
      let expiry_date_formatted =
        expiry_date_formatter[1] +
        "/" +
        expiry_date_formatter[0] +
        "/" +
        expiry_date_formatter[2];

      var b_date = new Date(`${birth_date_formatted}`);
      var i_date = new Date(`${issue_date_formatted}`);
      var e_date = new Date(`${expiry_date_formatted}`);

      if (e_date > i_date && i_date > b_date && e_date > b_date) {
        // console.log("Valid Dates");
      } else {
        //console.log("Invalid Dates");
        setInvalidDates(true);
        // setCnicErrors({
        //   ...cnicErrors,
        //   invalidDates: true,
        // });
      }
    }
  };

  // CNIC Expiry Check
  const cnicExpiry = (expiry) => {
    if (expiry) {
      let expiry_date_formatter = expiry.split("/");
      let expiry_date_formatted =
        expiry_date_formatter[1] +
        "/" +
        expiry_date_formatter[0] +
        "/" +
        expiry_date_formatter[2];

      let e_date = new Date(`${expiry_date_formatted}`);
      let today = new Date();

      if (e_date.getTime() <= today.getTime()) {
        //console.log("CNIC Expired");
        setCnicExpired(true);
        // setCnicErrors({
        //   ...cnicErrors,
        //   cnicExpired: true,
        // });
      } else {
        var timeDiff = Math.abs(today.getTime() - e_date.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays <= 60) {
          setCnincNearExpiry(true);
          // setCnicErrors({
          //   ...cnicErrors,
          //   cnincNearExpiry: true,
          // });
        } else {
          //console.log("Everything is fine");
        }
      }
    }
  };

  // Close Modal
  const handleOk = () => {
    setReset(!reset);
    setIsModalVisible(false);
    setBackendErr(false);
    setDifferentCnics(false);
  };

  // Close Modal
  const handleCancel = () => {
    setReset(!reset);
    setIsModalVisible(false);
    setBackendErr(false);
    setDifferentCnics(false);
  };

  // Gender Extraction From CNIC
  const genderCheck = (front, back) => {
    if (front !== null) {
      let front_without_dashes = front.replace(/-/g, "");
      if (front_without_dashes[front_without_dashes.length - 1] % 2 === 0) {
        setGender("Female");
      } else {
        setGender("Male");
      }
    } else {
      let back_without_dashes = back.replace(/-/g, "");
      if (back_without_dashes[back_without_dashes.length - 1] % 2 === 0) {
        setGender("Female");
      } else {
        setGender("Male");
      }
    }
  };

  // CNIC EXtraction API
  const sendDataAPI = async () => {
    let apiData = {
      cnic_front: cnicPic.front_image[0].base64,
      cnic_back: cnicPic.back_image[0].base64,
    };

    setLoading(true);
    await axios({
      method: "post",
      url: "http://173.212.242.18:8001/api/cnicExtraction/extractCNIC",
      data: apiData,
      headers: {
        //Authorization: "Bearer " + props.accessToken,
        //"X-CSRFToken": cookies.get("csrftoken"),
        //"content-type": `multipart/form-data; boundary=${formData._boundary}`,
      },
      withCredentials: false,
    })
      .then((response) => {
        console.log("Response", response.data.result);
        setNames({
          ...names,
          eng_name: response.data.result.eng_name,
          eng_fname: response.data.result.eng_fname,
          urdu_name: response.data.result.urdu_name,
          urdu_fname: response.data.result.urdu_fname,
          name_trans: response.data.result.name_trans,
          fname_trans: response.data.result.fname_trans,
        });
        setResponseId(response.data.result.id);

        if (response.data.result.id > 0 && response.data.result.id < 7) {
          setData(response.data.result);

          setResponseCNICNum({
            ...responseCNICNum,
            front_cnic: response.data.result.front_cnic,
            back_cnic: response.data.result.back_cnic,
          });

          similarCnic(
            response.data.result.front_cnic,
            response.data.result.back_cnic
          );

          genderCheck(
            response.data.result.front_cnic,
            response.data.result.back_cnic
          );

          ageValidation(response.data.result.birth, response.data.result.issue);
          cnicExpiry(response.data.result.expiry);
          datesValidation(
            response.data.result.birth,
            response.data.result.issue,
            response.data.result.expiry
          );
        } else {
          setBackendErr(true);
          setDifferentCnics(true);
          setIsModalVisible(true);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        message.error("Server Error", 4);
        setLoading(false);
      });
  };

  /// CONTINUE HEREEE

  return (
    <>
      <Cliploader loading={loading} />
      <div className='cnic-flex-parent'>
        <div className='cnic-flex-child'>
          <div className='cnic-flex-grandchild'>
            <p className='heading'>CNIC Data Extraction</p>
            <div className='errors'>
              {responseId === 3 ||
              (responseId === 4 && differentCnics === false) ? (
                <span className='conflictingValues'>
                  <span>
                    <img src={errorIcon} alt='errIcon' className='errIcon' />
                  </span>
                  {/* Difference between issue date and birth date is not 18 years */}
                  Misplaced images
                </span>
              ) : (
                ""
              )}

              {responseId === 5 ||
              (responseId === 6 && differentCnics === false) ? (
                <span className='conflictingValues'>
                  <span>
                    <img src={errorIcon} alt='errIcon' className='errIcon' />
                  </span>
                  {/* Difference between issue date and birth date is not 18 years */}
                  Errors and omissions expected as
                  {data.front_type !== null
                    ? " back of CNIC "
                    : " front of CNIC "}
                  is invalid
                </span>
              ) : (
                ""
              )}

              {manualCheck && differentCnics === false ? (
                <span className='conflictingValues'>
                  <span>
                    <img src={errorIcon} alt='errIcon' className='errIcon' />
                  </span>
                  {/* Difference between issue date and birth date is not 18 years */}
                  Manual check required
                </span>
              ) : (
                ""
              )}
              {/* {console.log("cnicErrors.underAge", cnicErrors.underAge)} */}

              {invalidDates && differentCnics === false ? (
                <span className='conflictingValues'>
                  <span>
                    <img src={errorIcon} alt='errIcon' className='errIcon' />
                  </span>
                  Dates on CNIC are Invalid
                  {/* Manual check required! */}
                </span>
              ) : (
                ""
              )}

              {cnicExpired && differentCnics === false ? (
                <span className='conflictingValues'>
                  <span>
                    <img src={errorIcon} alt='errIcon' className='errIcon' />
                  </span>
                  CNIC has been Expired
                  {/* Manual check required! */}
                </span>
              ) : (
                ""
              )}
              {underAge && differentCnics === false ? (
                <span className='conflictingValues'>
                  <span>
                    <img src={errorIcon} alt='errIcon' className='errIcon' />
                  </span>{" "}
                  Difference between issue date and birth date is not 18 years
                  {/* Manual check required! */}
                </span>
              ) : (
                ""
              )}

              {differentCnics && differentCnics === false ? (
                <span className='conflictingValues'>
                  <span>
                    <img src={errorIcon} alt='errIcon' className='errIcon' />
                  </span>
                  Images are of different CNICs
                  {/* Manual check required! */}
                </span>
              ) : (
                ""
              )}

              {cnincNearExpiry && differentCnics === false ? (
                <span className='conflictingValues'>
                  <span>
                    <img src={errorIcon} alt='errIcon' className='errIcon' />
                  </span>
                  CNIC is about to expire
                  {/* Manual check required! */}
                </span>
              ) : (
                ""
              )}
            </div>
            <div className='data-section-parent'>
              <div className='data-section-child'>
                <div className='data-section-grandchild'>
                  <p>CNIC Number: </p>
                  <p>Date of Issue:</p>
                  <p>Date of Expiry:</p>
                </div>
                <div className='data-section-grandchild'>
                  {manualCheck &&
                  differentCnics === false &&
                  Object.keys(data).includes("front_cnic") ? (
                    <RadioComponent
                      setData={getInputs}
                      data={responseCNICNum}
                      value={rtype.type}
                    />
                  ) : (
                    <p>
                      {data && differentCnics === false
                        ? data.front_cnic === null || data.front_cnic === ""
                          ? data.back_cnic === null || data.back_cnic === ""
                            ? "-"
                            : data.back_cnic
                          : data.front_cnic
                        : ""}
                    </p>
                  )}
                  <p className={manualCheck ? "manualCheck-style" : ""}>
                    {data && differentCnics === false
                      ? data.issue === null || data.issue === ""
                        ? "-"
                        : data.issue
                      : ""}
                  </p>
                  <p>
                    {data && differentCnics === false
                      ? data.expiry === null || data.expiry === ""
                        ? "-"
                        : data.expiry
                      : ""}
                  </p>
                </div>
              </div>
              <div className='data-section-child'>
                <div className='data-section-grandchild'>
                  <p>Date of Birth:</p>
                  <p>Gender:</p>
                  {data &&
                  data.back_type !== "old_front" &&
                  data.front_type !== "old_front" &&
                  data.back_type !== "old_back" &&
                  data.front_type !== "old_back" &&
                  (data.id === 1 ||
                    data.id === 3 ||
                    data.id === 5 ||
                    data.id === 6) ? (
                    <p>Country:</p>
                  ) : (
                    ""
                  )}
                </div>
                <div className='data-section-grandchild'>
                  <p>
                    {data && differentCnics === false
                      ? data.birth === null || data.birth === ""
                        ? "-"
                        : data.birth
                      : ""}
                  </p>
                  <p>{data && differentCnics === false ? gender : "-"}</p>
                  {/* (data.eng_gender === null || data.eng_gender === "") &&
                      (data.urdu_gender === null || data.urdu_gender === "") ? (
                        { genderCheck }
                      ) : */}
                  {/* <p>
                    {data && differentCnics === false ? (
                      data.eng_gender === null || data.eng_gender === "" ? (
                        data.urdu_gender === null || data.urdu_gender === "" ? (
                          "-"
                        ) : (
                          <span className='urdu_font'>{data.urdu_gender}</span>
                        )
                      ) : data.eng_gender === "M" ? (
                        "Male"
                      ) : data.eng_gender === "F" ? (
                        "Female"
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </p> */}
                  <p>
                    {data &&
                    differentCnics === false &&
                    data.back_type !== "old_front" &&
                    data.front_type !== "old_front" &&
                    data.back_type !== "old_back" &&
                    data.front_type !== "old_back"
                      ? data.country === null || data.country === ""
                        ? "-"
                        : data.country
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='cnic-flex-grandchild'>
            <p className='heading'>Name and Address Extraction</p>
            <Table
              name='names_table'
              cnicNames={names}
              responseId={responseId}
              differentCnics={differentCnics}
              data={data ? data : ""}
            />
          </div>
        </div>
        <div className='cnic-flex-child'>
          <div className='cnic-flex-child-header'>
            <div
              className={activeTab === false ? "scroll" : ""}
              onClick={() => setActiveTab(!activeTab)}>
              <span>Upload CNIC Images</span>
            </div>
            <div>
              <span
                className={activeTab === true ? "scroll" : ""}
                onClick={() => setActiveTab(!activeTab)}>
                Live Webcam Scan
              </span>
            </div>

            {/* <div>
              <p>Upload CNIC Images</p>
            </div>
            <div>Live Webcam Scan</div> */}
          </div>
          {activeTab === false ? (
            <div className='cnic-flex-child-body'>
              <div className='cnic-flex-grandchild'>
                <div className='image-placeholder'>
                  <div>
                    <p className='heading'>CNIC Front Phot</p>
                  </div>
                  <DropZone
                    setCnicPic={setCnicPic}
                    name='front_image'
                    reset={reset}
                    setEnableContinue={setEnableContinue}
                    setCnicExpired={setCnicExpired}
                    setUnderAge={setUnderAge}
                    setInvalidDates={setInvalidDates}
                    setDifferentCnics={setDifferentCnics}
                    setManualCheck={setManualCheck}
                    setCnincNearExpiry={setCnincNearExpiry}
                    setResponseId={setResponseId}
                    setNames={setNames}
                    setGender={setGender}
                  />
                </div>
                <div className='image-placeholder'>
                  <p className='heading'>CNIC Back Photo</p>
                  <DropZone
                    setCnicPic={setCnicPic}
                    name='back_image'
                    reset={reset}
                    setEnableContinue={setEnableContinue}
                    setCnicExpired={setCnicExpired}
                    setUnderAge={setUnderAge}
                    setInvalidDates={setInvalidDates}
                    setDifferentCnics={setDifferentCnics}
                    setManualCheck={setManualCheck}
                    setCnincNearExpiry={setCnincNearExpiry}
                    setResponseId={setResponseId}
                    setNames={setNames}
                    setGender={setGender}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className='cnic-flex-child-body'>
              <div className='cnic-flex-grandchild'>
                <div className='image-placeholder'>
                  <div>
                    <p className='heading'>CNIC Front Phot WEBCAM</p>
                  </div>

                  {/* <BlurrDetection chimg={chimg} /> */}

                  {/* <CropImage chimg={chimg} setchimg={setchimg} /> */}

                  {chimg !== null ? (
                    <img
                      src={chimg}
                      style={{
                        // width: "300px",
                        // height: "300px",
                        marginLeft: "30px",
                      }}
                    />
                  ) : (
                    <WebcamDetection name='front_image' setchimg={setchimg} />
                  )}

                  {chimg ? console.log("chimg", chimg) : ""}
                </div>
                <div className='image-placeholder'>
                  <p className='heading'>CNIC Back Photo WEBCAM</p>
                  {/* <WebcamDetection name='back_image' /> */}
                </div>
              </div>
            </div>
          )}

          <div className='cnic-flex-grandchild'>
            <div>
              <button
                disabled={!enableContinue}
                className={
                  enableContinue ? "reset-button enable" : "reset-button"
                }
                onClick={() => {
                  setReset(!reset);
                  setCnicExpired(false);
                  setUnderAge(false);
                  setInvalidDates(false);
                  setDifferentCnics(false);
                  setManualCheck(false);
                  setCnincNearExpiry(false);
                  setData({});
                }}>
                Reset
              </button>
            </div>
            <div>
              <button
                onClick={sendDataAPI}
                disabled={!enableContinue}
                className={
                  enableContinue ? "continue-button enable" : "continue-button"
                }>
                Process
              </button>
            </div>
          </div>
        </div>
      </div>
      <ErrorDataModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        backendErr={backendErr}
      />
    </>
  );
};

export default Dashboard;
