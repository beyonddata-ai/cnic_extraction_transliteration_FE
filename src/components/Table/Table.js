import React from "react";
import "./style.css";

const Table = (props) => {
  return (
    <>
      <div className='table-wrapper'>
        <table className='bordered'>
          <tbody>
            <tr>
              <th></th>
              <th>Urdu</th>
              <th>English</th>
            </tr>
            <tr>
              <td>Name</td>
              <td className='urdu_font'>
                {props.differentCnics === false &&
                props.data.country === null &&
                (props.cnicNames.urdu_name !== null ||
                  props.cnicNames.urdu_name !== "")
                  ? props.cnicNames.urdu_name
                  : ""}
              </td>
              <td>
                {props.differentCnics === false &&
                (props.cnicNames.eng_name !== null ||
                  props.cnicNames.eng_name !== "")
                  ? props.cnicNames.eng_name
                  : ""}
              </td>
            </tr>
            <tr>
              <td>Father's Name</td>
              <td className='urdu_font'>
                {props.differentCnics === false &&
                props.data.country === null &&
                (props.cnicNames.urdu_fname !== null ||
                  props.cnicNames.urdu_fname !== "")
                  ? props.cnicNames.urdu_fname
                  : ""}
              </td>
              <td>
                {props.differentCnics === false &&
                (props.cnicNames.eng_fname !== null ||
                  props.cnicNames.eng_fname !== "")
                  ? props.cnicNames.eng_fname
                  : ""}
              </td>
            </tr>

            <tr>
              <td>Address</td>
              <td className='urdu_font'>
                {/* جی 11/1 سٹریٹ نمبر 162 ہاوس نمبر 233 اسلام آباد پاکستان جی 11/1
                سٹریٹ نمبر 162 ہاوس نمبر 233 اسلام آباد پاکستان */}
                {/* {props.differentCnics === false &&
                (props.cnicNames.urdu_name !== null ||
                  props.cnicNames.urdu_name !== "")
                  ? props.cnicNames.urdu_name
                  : ""} */}
              </td>
              <td>
                {/* {props.differentCnics === false &&
                (props.cnicNames.eng_name !== null ||
                  props.cnicNames.eng_name !== "")
                  ? props.cnicNames.eng_name
                  : ""} */}
              </td>
            </tr>
            <tr>
              <td>Permanent Address</td>
              <td className='urdu_font'>
                {/* جی 11/1 سٹریٹ نمبر 162 ہاوس نمبر 233 اسلام آباد پاکستان جی 11/1
                سٹریٹ نمبر 162 ہاوس نمبر 233 اسلام آباد پاکستان */}
                {/* {props.differentCnics === false &&
                (props.cnicNames.urdu_fname !== null ||
                  props.cnicNames.urdu_fname !== "")
                  ? props.cnicNames.urdu_fname
                  : ""} */}
              </td>
              <td>
                {/* {props.differentCnics === false &&
                (props.cnicNames.eng_fname !== null ||
                  props.cnicNames.eng_fname !== "")
                  ? props.cnicNames.eng_fname
                  : ""} */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
