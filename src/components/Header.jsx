import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

function Header({ user }) {
  const handleLogout = async () => {
    await signOut(auth);
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
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "6px 10px",
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
              color: "#555",
              background: "none",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        </>
      ) : (
        <Link
          to="/login"
          style={{
            fontSize: "14px",
            color: "#555",
            textDecoration: "underline",
          }}
        >
          로그인
        </Link>
      )}
    </div>
  );
}

export default Header;