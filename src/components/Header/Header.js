import React from "react";
import styles from "./Header.module.scss";
import { Layout } from "antd";
import "./styles.css";
import Title from "../Images/Title/appTitle.svg";
import avatar from "../Icons/avatar.svg";
import notification from "../Icons/notifications.svg";

export default function Header() {
  const { Header } = Layout;

  return (
    <div className={styles.Container} id="AutoMLHeader">
      <Header className={styles.header}>
        <div className={styles.rightContent}>
          <img
            src={notification}
            alt="avatar"
            className={styles.notification}
          />
          <img src={avatar} alt="avatar" className={styles.avatar} />
        </div>

        <div className="logo" />
        {/* <h2>
          Beyond<span> Data</span>
        </h2> */}
        <img src={Title} alt="title" className={styles.titleImg} />
      </Header>
    </div>
  );
}
