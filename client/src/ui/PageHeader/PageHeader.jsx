import "./PageHeader.css";

export default function PageHeader({ style, children }) {
  return <h2 style={style}>{children}</h2>;
}
