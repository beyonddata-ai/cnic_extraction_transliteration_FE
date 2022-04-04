import "antd/dist/antd.css";
import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Layout, { Content } from "antd/lib/layout/layout";
import styles from "./App.module.scss";
import SideBar from "../src/components/SideBar/SideBar.js";
import Header from "./components/Header/Header.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Layout style={{ height: "100vh" }}>
          <Header />
          <Layout>
            <SideBar />
            <Layout style={{ backgroundColor: "#F5FAFF" }}>
              <Content className={styles.content}>
                <Routes>
                  <Route exact path="/" element={<Dashboard />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
