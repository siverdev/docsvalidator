// components/ResultsList.jsx
const ResultsList = ({ results }) => {
    if (!results.validationResults || results.validationResultslength === 0) {
        return <p className="text-gray-500">Результатів немає</p>;
    }

    return (
        <div className="mt-4 space-y-2">
            {results.validationResults.map((item) => (
                <div
                    key={item.id}
                    className={`p-2 rounded-lg ${
                        item.status === "correct" ? "bg-green-200" : "bg-red-200"
                    }`}
                >
                    {item.title} — {item.result} {item.status === "correct" ? "✅" : "❌"}
                </div>
            ))}

            {results.AISuggestions && (
                <div className="mt-6 p-4 border rounded-lg bg-blue-100">
                    <h3 className="text-lg font-semibold mb-2">Висновок AI:</h3>
                    <div className="whitespace-pre-line text-gray-800">{results.AISuggestions}</div>
                </div>
            )}
        </div>
    );
  }

export default ResultsList;