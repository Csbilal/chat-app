import React, { useState, useRef, useMemo } from "react";
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import popIcon41 from "../../images/popIcon41.png";
import io from "socket.io-client";
import { useTheme } from "@emotion/react";
import Icon from "../../images/Icon.png";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import GifBoxIcon from "@mui/icons-material/GifBox";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Picker from "emoji-picker-react";
import axios from "axios";

import pdfIcon from "../../images/pdfIcon.png";
import files from "../../images/file.png";
import { useCallback } from "react";
import MicIcon from "@mui/icons-material/Mic";

import RecordRTC from "recordrtc";

const Chat = () => {
  const [showEmojiPicker, setShowEmojiPiker] = useState(false);

  const [initialMsg, setInitialMsg] = useState([]);
  const [msg, setMsg] = useState([]);
  const [thisMsg, setThisMsg] = useState("");
  const [file, setfile] = useState();
  const [image, setImages] = useState();
  const [typing, setTyping] = useState();
  const [isTyping, setIsTyping] = useState();
  const [activeUser, setActiveUser] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userData, setUserData] = useState([]);

  // VOICE STATE
  const [recorder, setRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  console.log(audioBlob, "Aduis---v");

  const [isRecording, setIsRecording] = useState(false);
  const [voice, setVoice] = useState("");
  console.log(voice, "voice---v");

  //////////////////////////////////////////

  // console.log(activeUser, "aactiverUser------------");

  const socket = io("http://localhost:8080");
  const location = useLocation();
  const theme = useTheme();
  // let myAddress = "123";

  const user = JSON.parse(localStorage.getItem("loginUser"));
  let myAddress = user?.user?._id;

  const bottomRef = useRef(null);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  // console.log(location?.state?._id, "jasdhasdkashjkdkjha");
  useEffect(() => {
    socket.emit("create-room", {
      user1: location?.state?._id,
      user2: myAddress,
    });

    socket.emit("user_status", location?.state?._id);
  }, []);

  useEffect(() => {
    socket.on("user-data", (user) => {
      setUserData(user);
    });
  }, [socket, userData]);

  console.log(userData, "userDara");

  console.log(onlineUsers, "onlineusers");

  useEffect(() => {
    // console.log(onlineUsers, "onlineUsers");
  }, [onlineUsers]);

  useEffect(() => {
    socket.on("recieve-message", ({ name, message, type }) => {
      console.log(name, message, "messaf");
      msg.push({ walletAddress: name, message, type });
      setMsg([...msg]);
    });

    socket.on("recieve-room", ({ room }) => {
      setInitialMsg([...room?.messages]);
      setMsg([]);
    });
  }, []);

  const handleKeyDown = () => {
    socket.emit("typing", myAddress);
  };

  const alltypes = [
    {
      id: 1,
      extention: "pdf",
      img: pdfIcon,
    },
    {
      id: 2,
      extention: "docx",
      img: files,
    },
    {
      id: 3,
      extention: "txt",
      img: files,
    },
    {
      id: 4,
      extention: "xlsx",
      img: files,
    },
    {
      id: 5,
      extention: "csv",
      img: files,
    },
    {
      id: 6,
      extention: "ppt",
      img: files,
    },
    {
      id: 7,
      extention: "html",
      img: files,
    },
    {
      id: 8,
      extention: "css",
      img: files,
    },
  ];

  const typingHandler = (e) => {
    setThisMsg(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", myAddress);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", myAddress);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket.on("disconnect", {
      user1: location?.state?.id,
    });
  }, []);

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const allMsg = [...initialMsg, ...msg];
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (image) {
        socket.emit("message", {
          name: myAddress,
          message: image,
          otherUser: location?.state?._id,
          type: "file",
        });
      } else {
        socket.emit("message", {
          name: myAddress,
          message: event.target.value,
          otherUser: location?.state?._id,
          type: "text",
        });
      }
      setThisMsg("");
    }
  };

  const handlePicEmoji = () => {
    setShowEmojiPiker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiData, event) => {
    console.log(emojiData, "emoj");
    let messages = thisMsg;
    messages += emojiData.emoji;
    setThisMsg(messages);
  };

  const onFileChange = (e) => {
    setfile(e.target.files[0]);
    setThisMsg(e.target.files[0].name);
  };

  useEffect(() => {
    const setImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
          const res = await axios.post(
            "http://localhost:8080/file/uploads",
            data
          );
          await setImages(await res.data);
          // console.log(res.data, "------------------------");
        } catch (error) {
          console.log(error);
        }
      }
    };
    setImage();
    setImages("");
    setfile("");
  }, [file]);

  //  ////// //// / // / / // / / / // VOICE  SEND

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const newRecorder = RecordRTC(stream, { type: "audio" });
        setRecorder(newRecorder);
        newRecorder.startRecording();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorder.stopRecording(() => {
      setAudioBlob(recorder.getBlob());
    });
  };

  const sendVoice = async () => {
    try {
      const formData = new FormData();

      formData.append("file", audioBlob);
      const response = await axios.post(
        "http://localhost:8080/api/voice",
        formData
      );
      setVoice(await response.data);

      if (voice) {
        socket.emit("message", {
          name: myAddress,
          message: voice,
          otherUser: location?.state?._id,
          type: "audio",
        });
      }

      console.log(response.data, "a--asas");
    } catch (error) {
      console.log(error);
    }
  };
  // const sendAudio = () => {};

  // ///////////////////////////////////////////////////

  const getAllUser = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/getAllusers");
      console.log(res.data, "data");
      const newData = res.data.filter((x) => x._id == location?.state?._id);
      console.log(newData, "abc");
      setOnlineUsers(newData);
    } catch (error) {}
  }, [location]);

  useEffect(() => {
    getAllUser();
  }, [getAllUser, userData]);

  return (
    <Box
      sx={{
        border: "1px solid #0DF17F",
        borderRadius: "23px",
        width: { md: "700px", xs: "100%" },
      }}
    >
      <Box
        sx={{
          padding: "0.5rem",
          background: "#155A3E",
          display: "flex",
          justifyContent: "space-between",
          borderTopLeftRadius: "23px",
          alignItem: "center",
          borderTopRightRadius: "23px",
        }}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar src={popIcon41}></Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{ color: "white" }}
            primary={
              <Typography type="body2" style={{ color: "#FFFFFF" }}>
                {location?.state?.name}
              </Typography>
            }
            secondary={
              <>
                <Typography
                  type="body2"
                  style={{
                    color: "#EBF0F0",
                    fontSize: "0.7rem",
                    opacity: "0.6",
                  }}
                >
                  {/* {activeUser === location?.state?._id ? "online" : "offline"} */}

                  {/* {onlineUsers?.map((user) => {
                  return <div> {user.status} </div>;
                })} */}
                  {userData?.status === "online" ? (
                    <div>online</div>
                  ) : (
                    <div>
                      offline <br /> lastseen at {userData?.lastseen}
                    </div>
                  )}
                </Typography>
              </>
            }
          />
        </ListItem>
        <Box sx={{ textAlign: "center" }} mt={1.3}>
          <Box
            width="120px"
            height="42px"
            bgcolor="#0DF17F"
            borderRadius="50px"
            sx={{ cursor: "pointer" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            color="black"
            fontWeight="700"
            fontSize="14px"
            style={{ zIndex: 1 }}
          >
            follow
          </Box>
        </Box>
      </Box>

      <div className="chatBody">
        {/* <Box className="chat-msg">
          <Avatar src={popIcon41}></Avatar>
          <Box
            sx={{
              backgroundColor: "#155A3E",
              padding: "0.5rem 1rem",
              marginLeft: "1rem",
              borderRadius: "15px",
              color: "white",
            }}
          >
            Hi , How are you doing{{{{{{
          </Box>
        </Box}}}}}}> */}

        {allMsg.map((msg) => {
          // console.log(msg.message, "----------------");
          // console.log(typeof msg.type);
          return typeof msg?.type == "string" ? (
            <Box
              className={
                msg.walletAddress === myAddress
                  ? "chat-msg chat-reciver"
                  : "chat-msg"
              }
            >
              {msg?.type === "text" ? (
                <Box
                  sx={{
                    backgroundColor: "transparent",
                    padding: "0.5rem 1rem",
                    border: "1px solid #0DF17F",
                    borderRadius: "15px",
                    color: "white",
                  }}
                >
                  {msg?.message}
                </Box>
              ) : msg?.type === "audio" ? (
                <Box>
                  <audio src={msg?.message} controls />
                  {/* <audio src={voice}  controls /> */}
                </Box>
              ) : (
                <Box>
                  {alltypes?.filter((item) => {
                    console.log(msg?.message?.split(".")[0]);
                    return item.extention === msg?.message?.split(".")[1];
                  }).length > 0 ? (
                    <>
                      {alltypes
                        .filter(
                          (item) =>
                            item.extention === msg?.message?.split(".")[1]
                        )
                        .map((item, i) => {
                          console.log(item, "image ");
                          return (
                            <a
                              href={msg.message}
                              target="_blank"
                              style={{ textDecoration: "none" }}
                              key={i}
                            >
                              <Box
                                style={{
                                  color: "white",
                                  display: "flex",
                                  maxWidth: "200px",
                                  objectFit: "cover",
                                }}
                              >
                                <img
                                  src={item.img}
                                  alt="pdf"
                                  style={{ width: "20%" }}
                                ></img>
                                <Typography>
                                  {msg.message.split("/").pop()}
                                </Typography>
                              </Box>
                            </a>
                          );
                        })}
                    </>
                  ) : (
                    <a href={msg.message} target="_blank">
                      <img src={msg.message} alt="img2" width="200px"></img>
                    </a>
                  )}
                </Box>
              )}

              <Avatar src={popIcon41} sx={{ marginLeft: "1rem" }}></Avatar>
            </Box>
          ) : (
            <>
              <img
                src={msg.message.toString("base64")}
                width={244}
                height={255}
                alt="abc"
                style={{ float: "right" }}
              />
            </>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <Box mb={2} px={6} sx={{ position: "relative" }}>
        <Box sx={{ position: "absolute", top: "-470px" }}>
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </Box>
        <TextField
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          sx={{
            width: { xs: "100%", md: "100%" },

            borderRadius: "10px",
            "& label.Mui-focused": {
              color: theme.primary.text,
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "#0DF17F",
              borderRadius: "10px",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#0DF17F",
                borderRadius: "10px",
              },
              "&:hover fieldset": {
                borderColor: "#0DF17F",
                borderRadius: "10px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0DF17F",
              },
            },

            input: {
              color: theme.primary.text,
              fontSize: { xs: "12px", md: "14px" },
            },
            background: theme.primary.bg,
          }}
          id="standard-name"
          value={thisMsg}
          onChange={typingHandler}
          type="text"
          placeholder={"Thank you so much that very sweet of you "}
          InputProps={{
            startAdornment: (
              <>
                <Box
                  alignItems="center"
                  sx={{
                    cursor: "pointer",
                    margin: "0.7rem 2rem",
                    display: { md: "flex", xs: "none" },
                  }}
                >
                  <SentimentSatisfiedAltIcon
                    sx={{
                      fontSize: "2.5rem",
                      color: "#0E7C54",
                    }}
                    onClick={handlePicEmoji}
                  />

                  <GifBoxIcon
                    sx={{
                      fontSize: "2.5rem",
                      color: "#0E7C54",
                    }}
                  />
                  <label htmlFor="inputfile">
                    <AttachFileIcon
                      sx={{
                        fontSize: "2.5rem",
                        color: "#0E7C54",
                      }}
                    />
                  </label>

                  <input
                    type="file"
                    id="inputfile"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      onFileChange(e);
                    }}
                  ></input>
                  <Box
                    sx={{
                      height: "30px",
                      borderLeft: "3px solid #0E7C54",
                      marginLeft: "1rem",
                    }}
                  ></Box>
                </Box>
              </>
            ),
            endAdornment: (
              <>
                <Box>
                  <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                  >
                    {isRecording ? (
                      <>
                        "Stop" <MicIcon />
                      </>
                    ) : (
                      <>
                        "start" <MicIcon />
                      </>
                    )}
                  </button>
                  {audioBlob && (
                    <button onClick={sendVoice}>Send Voice </button>
                  )}
                </Box>
              </>
            ),
          }}
          on
        />
      </Box>
    </Box>
  );
};

export default Chat;
