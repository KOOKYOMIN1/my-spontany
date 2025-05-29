// ✅ 완성형 Home.jsx (작성란 유지 + 매칭 취소 버튼 추가 + 상태 메시지 표시)

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import ChatBox from "../components/ChatBox";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import "../index.css";

const CITY_SUGGESTIONS = ["서울", "부산", "제주", "대구", "인천", "광주", "대전", "울산", "강릉", "속초", "여수", "전주", "경주"];

function Home() {
  const [origin, setOrigin] = useState("");
  const [departure, setDeparture] = useState("");
  const [budget, setBudget] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [mood, setMood] = useState("");
  const [style, setStyle] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [matchUser, setMatchUser] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingUsersCount, setMatchingUsersCount] = useState(0);
  const [matchStatusMessage, setMatchStatusMessage] = useState("");

  const today = new Date();
  const backgroundImage = "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')";

  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem("matchStatus") || '{}');
    if (saved[todayKey]) setMatchCount(saved[todayKey]);
    const premiumStatus = localStorage.getItem("isPremium");
    if (premiumStatus === "true") setIsPremium(true);

    const unsubscribe = onSnapshot(collection(db, "matchingQueue"), (snapshot) => {
      setMatchingUsersCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  const saveMatch = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem("matchStatus") || '{}');
    saved[todayKey] = (saved[todayKey] || 0) + 1;
    localStorage.setItem("matchStatus", JSON.stringify(saved));
    setMatchCount(saved[todayKey]);
  };

  const formatBudget = (value) => {
    const numeric = value.replace(/[^0-9]/g, "");
    return numeric ? parseInt(numeric).toLocaleString() : "";
  };

  const handleBudgetChange = (e) => {
    setBudget(formatBudget(e.target.value));
  };

  const handleRandomMatch = async () => {
    if (!auth.currentUser) return alert("로그인 후 이용해주세요");
    if (!origin || !departure || !budget || !startDate || !endDate || !mood || !style)
      return alert("모든 항목을 작성해주세요");

    setIsMatching(true);
    setMatchStatusMessage(`매칭 중입니다... 현재 매칭 대기 중인 유저: ${matchingUsersCount}명`);

    const uid = auth.currentUser.uid;
    const myRef = doc(db, "matchingQueue", uid);
    await setDoc(myRef, {
      userId: uid,
      timestamp: serverTimestamp(),
    });

    const snapshot = await getDocs(collection(db, "matchingQueue"));
    const queue = [];
    snapshot.forEach(doc => queue.push(doc.data()));

    const other = queue.find((u) => u.userId !== uid);

    if (other) {
      const otherRef = doc(db, "matchingQueue", other.userId);
      await deleteDoc(myRef);
      await deleteDoc(otherRef);

      const sortedIds = [uid, other.userId].sort();
      const matchId = `match-${sortedIds[0]}-${sortedIds[1]}`;

      await setDoc(doc(db, "matchedRooms", matchId), {
        userA: uid,
        userB: other.userId,
        timestamp: serverTimestamp(),
      });

      setMatchUser({ uid: other.userId, matchId });
      saveMatch();
      setIsMatching(false);
      setMatchStatusMessage("");
      alert("🎉 매칭이 성사되었습니다!");
    } else {
      setMatchStatusMessage(`매칭 중입니다... 현재 매칭 대기 중인 유저: ${matchingUsersCount}명`);
    }
  };

  const handleCancelMatch = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await deleteDoc(doc(db, "matchingQueue", uid));
    } catch (err) {
      console.error("❌ 매칭 취소 오류:", err);
    }
    setIsMatching(false);
    setMatchStatusMessage("");
  };

  const handlePremiumPayment = async () => {
    try {
      const response = await fetch("/api/create-toss-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: auth.currentUser?.uid,
          amount: 3900,
          orderName: "Spontany 프리미엄 이용권",
        }),
      });
      const { paymentUrl } = await response.json();
      localStorage.setItem("isPremium", "true");
      setIsPremium(true);
      window.location.href = paymentUrl;
    } catch (err) {
      alert("결제 요청 중 오류가 발생했습니다.");
      console.error("❌ 결제 요청 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center py-16 px-4 relative" style={{ backgroundImage }}>
      <div className="w-[1200px] bg-white bg-opacity-90 backdrop-blur-lg rounded-[2rem] shadow-xl p-10 border border-gray-200 animate-fade-in mb-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">랜덤 동행 감성 여행 만들기</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input type="text" placeholder="출발지" value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none" />
          <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full">
            <option value="">도착지 유형 선택</option>
            <option value="국내">국내</option>
            <option value="해외">해외</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input type="text" placeholder="예산 (₩)" value={budget} onChange={handleBudgetChange} className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none" />
          <DatePicker selected={startDate} onChange={(update) => setDateRange(update)} startDate={startDate} endDate={endDate} selectsRange minDate={today} locale={ko} dateFormat="yyyy년 MM월 dd일" placeholderText="여행 날짜 선택" className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full text-center focus:ring-2 focus:ring-yellow-300 focus:outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full">
            <option value="">감정을 선택하세요</option>
            <option value="설렘">설렘</option>
            <option value="힐링">힐링</option>
            <option value="기분전환">기분전환</option>
          </select>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full">
            <option value="">여행 스타일 선택</option>
            <option value="즉흥형">즉흥형</option>
            <option value="계획형">계획형</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <button onClick={handleRandomMatch} className="w-full py-3 px-4 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold shadow-md transition">
              랜덤 매칭하기
            </button>
            <p className="mt-2 text-sm text-gray-600 text-center">
              {isMatching ? matchStatusMessage : "하루 2회 매칭 제한"}
            </p>
            {isMatching && (
              <button onClick={handleCancelMatch} className="mt-2 w-full py-2 px-4 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium">
                매칭 취소하기
              </button>
            )}
          </div>

          <div className="flex-1">
            <button onClick={handlePremiumPayment} className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold shadow-md transition">
              프리미엄 결제하기
            </button>
            <div className="mt-2 text-sm text-gray-600 text-center space-y-1">
              <p>프리미엄 유저들과 매칭 가능</p>
              <p>무제한 매칭</p>
              <p>고급 필터 제공</p>
            </div>
          </div>
        </div>

        {!isPremium && (
          <p className="text-xs text-center mt-2 text-gray-500">무료 유저는 하루 2회까지 여행 매칭이 가능해요.</p>
        )}
      </div>

      {matchUser && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-xl p-4 z-40">
          <h2 className="text-lg font-semibold mb-2">매칭된 유저와 채팅</h2>
          <ChatBox matchId={matchUser.matchId} />
        </div>
      )}

      <button onClick={() => setShowChat(!showChat)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-xl shadow-lg flex items-center justify-center hover:bg-blue-700 z-50">
        💬
      </button>
    </div>
  );
}

export default Home;
