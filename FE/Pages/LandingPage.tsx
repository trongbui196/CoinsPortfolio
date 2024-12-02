import { styled } from "@mui/material/styles";

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

const LandingPage = () => {
  console.log("Landing page rendered");
  return (
    <Container>
      <HelloText>Hello</HelloText>
    </Container>
  );
};

export default LandingPage;
