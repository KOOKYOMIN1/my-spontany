function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <h1 className="text-4xl font-bold mb-4">Spontany</h1>
      <p className="text-lg text-gray-700 mb-2">
        여행이 필요한 순간, 감정이 안내하는 방향으로 떠나요
      </p>
      <p className="text-sm text-gray-600">
        로그인하면 당신의 감정 기반 여행 히스토리를 저장해드려요.
      </p>
    </div>
  );
}

export default LoginPage;