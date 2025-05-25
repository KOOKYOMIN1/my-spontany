import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Header({ user }) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/"); // 로그인 후 홈으로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // 로그아웃 후 홈으로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "6px 12px",
        borderRadius: "8px",
      }}
    >
      {user ? (
        <>
          <span style={{ fontSize: "14px", color: "#333" }}>
            {user.displayName || user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: "14px",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#444",
            }}
          >
            로그아웃
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          style={{
            fontSize: "14px",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#444",
          }}
        >
          로그인
        </button>
      )}
    </div>
  );
}

export default Header;