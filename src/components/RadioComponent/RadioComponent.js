import React from "react";
import { Radio } from "antd";
import { Form } from "antd";
import "./styles.css";

export default function RadioComponent(props) {
  return (
    <Form.Item style={{ marginTop: "-6px" }}>
      {/* {console.log("Data: ", props.data)} */}
      <Radio.Group
        // name={props.name}
        onChange={props.setData}
        value={props.value}>
        {props.data
          ? Object.keys(props.data).map((item, index) => {
              return (
                <Radio
                  style={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#000000",
                  }}
                  className='radio-component'
                  key={index}
                  value={props.data ? props.data[item] : "abc"}>
                  {props.data[item]}
                </Radio>
              );
            })
          : ""}
      </Radio.Group>
    </Form.Item>
  );
}
