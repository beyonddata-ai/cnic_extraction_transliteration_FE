import React, { useState } from "react";
import styles from "./SideBar.module.scss";
import { Layout } from "antd";
import logo from "../Images/Title/title.svg";
import "./styles.css";

export default function SideBar() {
  const { Sider } = Layout;
  const [val, setval] = useState("1");

  return (
    <Sider
      width={71}
      className={styles.sidebar}
      id="SideBar"
      style={{ position: "absolute", height: `102vh` }}
    >
      <div className="title">
        <img src={logo} alt={"logo"} />
      </div>
    </Sider>
  );
}
