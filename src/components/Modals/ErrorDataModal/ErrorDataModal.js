import Modal from "antd/lib/modal/Modal";
import React from "react";
import "./styles.css";
import mainErrIcon from "./../../Icons/mainErrIcon.svg";

const ErrorDataModal = (props) => {
  return (
    <>
      <Modal
        visible={props.isModalVisible}
        width={332}
        title={"Error"}
        onOk={props.handleOk}
        onCancel={props.handleCancel}
        bodyStyle={{
          width: "332px",
          height: "300px",
          background: "#FFFFFF",
          // borderRadius: "20px",
        }}
        className='err-modal'>
        <div className='error-container'>
          <div className='mainIcon'>
            <img src={mainErrIcon} alt='mainErrIcon' />
          </div>
          <div className='error'>
            {props.backendErr ? (
              <p>Failed to detect CNICs</p>
            ) : (
              <p>Images don’t match</p>
            )}
          </div>
          <div className='error-description'>
            {props.backendErr ? (
              <p>
                System failed to detect CNICs. Make sure uploaded pictures are
                valid and in correct format.
              </p>
            ) : (
              <p>
                Our system detected two different CNICs. Select images of the
                same CNIC to proceed.
              </p>
            )}
            <p></p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ErrorDataModal;
