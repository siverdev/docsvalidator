// components/ResultsList.jsx
const ResultsList = ({ results }) => {
    if (!results || results.length === 0) {
      return <p className="text-gray-500">Результатів немає</p>;
    }
  
    return (
      <div className="mt-4 space-y-2">
        {results.map((item) => (
          <div
            key={item.id}
            className={`p-2 rounded-lg text-gray ${
              item.status === "correct" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {item.title} — {item.status === "correct" ? "✅ Правильно" : "❌ Помилка"}
          </div>
        ))}
      </div>
    );
  }

export default ResultsList;