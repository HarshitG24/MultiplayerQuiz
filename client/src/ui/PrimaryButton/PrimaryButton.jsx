import "./PrimaryButton.css";

export default function PrimaryButton({ onClick, type, children }) {
  return (
    <button
      className={`primary-btn ${
        type === "primary" ? "primary-color" : "secondary-color"
      }`}
      onClick={onClick}
      type={`${type === "primary" ? "submit" : "button"}`}>
      {children}
    </button>
  );
}
