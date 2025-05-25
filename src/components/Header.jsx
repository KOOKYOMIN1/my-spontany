import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

function Header({ user }) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="relative">
      <Link
        to="/"
        className="text-2xl font-bold text-purple-700 p-4 inline-block"
      >
        Spontany
      </Link>

      <div className="absolute top-4 right-4 text-sm">
        {user ? (
          <div>
            <span className="mr-2 font-medium text-gray-700">
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-600 underline hover:text-black"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-gray-600 underline hover:text-black"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;