import "./Card.css";
export default function Card({ onSubmit, children }) {
  return (
    <form id="card" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
