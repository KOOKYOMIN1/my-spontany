import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getUserPlans } from "../utils/getUserPlans";

function History() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getUserPlans(user.uid);
      setPlans(data);
    };

    fetchPlans();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        📚 나의 여행 히스토리
      </h1>

      {plans.length === 0 ? (
        <p className="text-gray-500 text-center">여행 기록이 없습니다.</p>
      ) : (
        <div className="grid gap-6">
          {plans.map((plan, idx) => (
            <div
              key={plan.id || idx}
              className="bg-white shadow-md rounded-xl p-6"
            >
              <p><strong>출발지:</strong> {plan.departure}</p>
              <p><strong>예산:</strong> ₩{plan.budget.toLocaleString()}</p>
              <p><strong>감정:</strong> {plan.mood}</p>
              <p><strong>동행:</strong> {plan.withCompanion ? "동행" : "혼자"}</p>
              <p className="text-sm text-gray-400 mt-2">
                생성일: {new Date(plan.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;