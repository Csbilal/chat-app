import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
function Signout() {
  const token = localStorage.getItem("nft_aly_Token");
  const user = JSON.parse(localStorage.getItem("loginUser"));
  const socket = io("http://localhost:8080");

  const navigate = useNavigate();
  // useEffect(() => {
  // }, []);
  // const date = new Date().toLocaleString();

  let dates = new Date().toLocaleString();
  useEffect(() => {
    socket.emit("logout", { _id: user?.user?._id, timestamp: dates });

    setTimeout(() => {
      if (token) {
        localStorage.removeItem("nft_aly_Token");
        window.location = "/";
      } else {
        window.location = "/";
      }
    }, 2500);
  }, [socket, token, user]);

  return true;
}

export default Signout;
