import { useTheme } from "@emotion/react";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import popIcon4 from "../../images/popIcon41.png";
import time from "../../images/time.png";
import Art3 from "../../images/Art3.png";
import card1 from "../../images/card1.png";
import card2 from "../../images/card2.png";
import card3 from "../../images/card3.png";
import card4 from "../../images/card4.png";
import tranding4 from "../../images/tranding4.png";
import currencyLogo from "../../images/Flow.png";
import img from "../../images/banner.png";

// import img from "../../images/img1.png";

// import img from "../../images/img.png";

export default function MarketPlaceCard({ name, _id }) {
  const theme = useTheme();
  return (
    <Box
      height="100%"
      textAlign="center"
      border="1px solid rgba(255, 255, 255, 0.5)"
      pb={2}
      borderRadius="10px"
      position="relative"
    >
      <img src={img} alt="" width="100%" height="200px" />

      <Typography
        pl={2}
        color={theme.primary.text}
        fontSize={{ xs: "16px", md: "18px" }}
        fontWeight="800"
        textAlign="left"
      >
        {name}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        color={theme.primary.text}
        justifyContent="space-between"
        mt={1}
        px={2}
      >
        <Typography
          color="rgba(255, 255, 255, 0.5)"
          fontSize={{ xs: "12px", md: "12px" }}
          fontWeight="300"
        >
          Price
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          fontWeight="700"
          fontSize="14px"
        >
          <img
            style={{ marginRight: "5px" }}
            width="12px"
            src={currencyLogo}
            alt=""
          />{" "}
          123
        </Box>
      </Box>
      <Box px={2} mt={1}>
        <Divider
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            width: "100%",
            height: "1px",
          }}
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        color={theme.primary.text}
        justifyContent="space-between"
        mt={1}
        px={2}
      >
        <Typography
          color="rgba(255, 255, 255, 0.5)"
          fontSize={{ xs: "12px", md: "12px" }}
          fontWeight="300"
        >
          Author
        </Typography>
        <Typography
          mt={0.5}
          color="#ffffff"
          fontSize={{ xs: "13px", md: "14px" }}
          fontWeight="400"
          display="flex"
          alignItems="center"
        >
          <img
            style={{ marginRight: "10px" }}
            width="25px"
            src={popIcon4}
            alt=""
          />{" "}
          name
        </Typography>
      </Box>
      <Box
        color={theme.primary.subtext}
        fontSize="12px"
        display="flex"
        alignItems="center"
        bgcolor={theme.primary.bgButtonTwo}
        fontWeight="700"
        p={1}
        sx={{
          width: "fit-content",
          borderRadius: "50px",
          position: "absolute",
          zIndex: 1,
          right: "8px",
          top: "10px",
        }}
      >
        <FavoriteBorderIcon
          style={{
            fontSize: "16px",
            color: theme.primary.subtext,
            marginRight: "6px",
          }}
        />
        facdad
      </Box>
      <Box
        color={theme.primary.text}
        fontSize="12px"
        display="flex"
        alignItems="center"
        bgcolor={theme.primary.bg}
        fontWeight="700"
        p={1}
        sx={{
          width: "fit-content",
          borderRadius: "50px",
          position: "absolute",
          zIndex: 1,
          left: "8px",
          top: "10px",
        }}
      >
        <img style={{ marginRight: "10px" }} width="15px" src={time} alt="" />{" "}
      </Box>
    </Box>
  );
}
