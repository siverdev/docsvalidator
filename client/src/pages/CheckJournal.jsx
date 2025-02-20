import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import ResultsList from "../components/ResultsList";

const CheckJournal = () => {
  const [checkResults, setCheckResults] = useState(null);
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    setChecklist([
        { "id": 1, "title": "Назва університету", "regex": "Київський національний університет імені Тараса Шевченка" },
        { "id": 2, "title": "Факультет", "regex": "Факультет комп’ютерних наук та кібернетики" },
        { "id": 3, "title": "Кафедра", "regex": "Кафедра теорії та технології програмування" }
    ]
    )
    // Завантаження чекліста з сервера
    // fetch("/journal-checklist")
    //   .then((res) => res.json())
    //   .then((data) => setChecklist(data.checklist))
    //   .catch((error) => console.error("Помилка завантаження чекліста:", error));
  }, []);

  return (
    <div className="ml-8 mt-2">
      {/* Назва сторінки */}
      <h1 className="text-2xl font-bold mb-4">Перевірка щоденника звіту</h1>

      {/* Критерії оцінки */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Критерії перевірки:</h2>
        <ul className="list-disc pl-5">
          {checklist.map((item) => (
            <li key={item.id} className="mb-1">{item.title}</li>
          ))}
        </ul>
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
