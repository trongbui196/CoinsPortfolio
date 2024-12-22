import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Container with background image
const Container = styled("div")({
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url('https://plus.unsplash.com/premium_photo-1681400668073-a1947604dd36?q=80&w=1779&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 9999,
});

const HelloText = styled("div")({
  fontFamily: "'Comfortaa', cursive",
  color: "#ffffff",
  textAlign: "center",
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

const FLine = styled("h1")({
  fontSize: "4rem",
  lineHeight: "1",
  color: "black",
  textTransform: "uppercase",
  letterSpacing: "2px",
  margin: 0,
});

const SLine = styled("h2")({
  fontSize: "2rem",
  color: "black",
  textTransform: "uppercase",
  letterSpacing: "1px",
  margin: 0,
});

const ButtonContainer = styled("div")({
  position: "absolute",
  bottom: "10%",
  display: "flex",
  gap: "20px",
  justifyContent: "center",
});

// Styled Button
const StyledButton = styled(Button)({
  padding: "10px 30px",

  color: "#ffffff",
  borderRadius: "25px",
  textTransform: "none",
  fontSize: "1.5rem",
  fontFamily: "'Comfortaa', cursive",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
});

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <HelloText>
        <FLine>Coin Portfolio</FLine>
        <SLine>by Trong Bui</SLine>
      </HelloText>
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
