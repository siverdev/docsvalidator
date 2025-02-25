import { useState, useEffect } from "react";
import FileUpload from "../components/JournalUpload";
import ResultsList from "../components/ResultsList";
import axios from "axios";
import NameForm from "../components/NameForm";
import JournalUpload from "../components/JournalUpload";

const CheckJournal = () => {
  const [checkResults, setCheckResults] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [checklistError, setChecklistError] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/journal-checklist");
        if (!res.data.checklist) setChecklistError(true);
        else {
          setChecklist(res.data.checklist);
          const initialCheckedState = res.data.checklist.reduce((acc, item) => {
            acc[item.id] = true; // Всі чекбокси за замовчуванням true
            return acc;
          }, {});
          setCheckedCriteria(initialCheckedState);
        }
      } catch (error) {
        setChecklistError(true);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (id) => {
    setCheckedCriteria((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="ml-8 mt-2">
      <h1 className="text-2xl font-bold mb-4">Перевірка щоденника звіту для катедри ТТП ФКНК</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Критерії перевірки:</h2>
        {checklistError ? (
          <div className="text-red-500">Помилка при завантаженні чекліста</div>
        ) : (
          <ul className="list-disc pl-5">
            {checklist.map((item, index) => (
              <li key={item.id} className="mb-1 flex items-center">
                <input
                  type="checkbox"
                  checked={checkedCriteria[item.id] || false}
                  onChange={() => handleCheckboxChange(item.id)}
                  disabled={index === 0} // Заборона зміни першого чекбокса
                  className="mr-2 w-5 h-5 cursor-pointer"
                />
                <span>{item.title}: {item.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">Щоденник для перевірки: </h2>

      <JournalUpload onCheckComplete={(result) => setCheckResults(result)} criteriaToCheck={Object.keys(checkedCriteria).filter(id => checkedCriteria[id]).map(id => parseInt(id, 10)) } />

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
