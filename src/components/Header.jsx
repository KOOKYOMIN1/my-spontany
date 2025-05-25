import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

function Header({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center mb-6">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Spontany 
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <Link
            to="/history"
            className="text-sm text-indigo-600 hover:underline"
          >
             나의 히스토리
          </Link>

          <span className="text-sm text-gray-600">
            안녕하세요, <strong>{user.displayName}</strong>님
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <span className="text-sm text-gray-500">로그인 필요</span>
      )}
    </header>
  );
}

export default Header;