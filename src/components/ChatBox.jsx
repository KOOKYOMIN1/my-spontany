import { useState, useEffect } from "react";
import { db } from "../firebase";
import { auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

function ChatBox({ matchId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "chats", matchId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [matchId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    await addDoc(collection(db, "chats", matchId, "messages"), {
      sender: auth.currentUser.uid,
      text,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div>
      <div className="h-64 overflow-y-auto bg-gray-50 p-3 border border-gray-300 rounded-lg mb-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-sm mb-1 ${
              msg.sender === auth.currentUser.uid
                ? "text-right text-blue-600"
                : "text-left text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default ChatBox;