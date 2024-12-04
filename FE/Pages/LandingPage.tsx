import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Container = styled("div")({
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ff0000",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 9999,
});

const HelloText = styled("h1")({
  fontFamily: "'Comfortaa', cursive",
  fontSize: "4rem",
  color: "#ffffff",
  textTransform: "uppercase",
  letterSpacing: "2px",
  animation: "fadeIn 1.5s ease-in",
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
});

const ButtonContainer = styled("div")({
  position: "absolute",
  bottom: "10%",
  display: "flex",
  gap: "20px",
  justifyContent: "center",
});

const StyledButton = styled(Button)({
  padding: "10px 30px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  borderRadius: "25px",
  textTransform: "none",
  fontSize: "1.2rem",
  fontFamily: "'Comfortaa', cursive",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-3px)",
  },
});

const LandingPage = () => {
  const navigate = useNavigate();

  console.log("Landing page rendered");
  return (
    <Container>
      <HelloText>Hello</HelloText>
      <ButtonContainer>
        <StyledButton onClick={() => navigate("/market")}>Market</StyledButton>
        <StyledButton onClick={() => navigate("/portfolio")}>
          Portfolio
        </StyledButton>
        <StyledButton onClick={() => navigate("/watchlist")}>
          Watchlist
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default LandingPage;
