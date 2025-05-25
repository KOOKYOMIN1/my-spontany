import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

function Header({ user }) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header>
      {/* 오른쪽 상단에 고정된 로그인/로그아웃 버튼 */}
      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 underline hover:text-black"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm text-gray-600 underline hover:text-black"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;