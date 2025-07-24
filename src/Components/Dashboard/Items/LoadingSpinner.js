import { ClipLoader } from "react-spinners";

function LoadingSpinner() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <ClipLoader
        color={"#052992ff"}
        size={50}
        speedMultiplier={1}
      />
    </div>
  );
}

export default LoadingSpinner;
