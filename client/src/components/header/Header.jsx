import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import "./Header.css";
import JoinGameModal from "../modal/JoinGameModal";
import { useRef } from "react";

export default function Header() {
  const joinDialog = useRef();

  function handleJoin() {
    joinDialog.current.open();
  }

  return (
    <>
      <JoinGameModal ref={joinDialog} />
      <div className="header-container">
        <h1>QuizScript</h1>
        <div>
          <PrimaryButton onClick={handleJoin}>Join</PrimaryButton>
        </div>
      </div>
    </>
  );
}
