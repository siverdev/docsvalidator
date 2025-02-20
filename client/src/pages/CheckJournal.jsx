import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import ResultsList from "../components/ResultsList";
import axios from "axios";

const CheckJournal = () => {
  const [checkResults, setCheckResults] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [checklistError, setChecklistError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/journal-checklist");
        if (!res.data.checklist) setChecklistError(true);
        setChecklist(res.data.checklist);
      } catch (error) {
        setChecklistError(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="ml-8 mt-2">
      {/* Назва сторінки */}
      <h1 className="text-2xl font-bold mb-4">Перевірка щоденника звіту</h1>

      {/* Критерії оцінки */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Критерії перевірки:</h2>
        {checklistError ? (
          <div className="text-red-500">Помилка при завантаженні чекліста</div>
        ) : (
          <ul className="list-disc pl-5">
            {checklist.map((item) => (
              <li key={item.id} className="mb-1">
                {item.title}: {item.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Форма завантаження файлу */}
      <FileUpload onCheckComplete={(result) => setCheckResults(result)} />

      {/* Відображення результатів перевірки */}
      {checkResults && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Результати:</h2>
          <ResultsList results={checkResults} />
        </div>
      )}
    </div>
  );
};

export default CheckJournal;
