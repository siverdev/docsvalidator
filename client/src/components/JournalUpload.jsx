import { useState } from "react";
import axios from "axios";

const JournalUpload = ({ onCheckComplete, criteriaToCheck }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null); 

      };

    const handleNameChange = (e) => {
      setFullName(e.target.value);
      setFullNameError(false);
    };

    const formatFullName = (name) => {
      return name
          .trim()
          .replace(/\s{2,}/g, ' ') 
          .replace(/\s+$/, '')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
    };
  
    const validateFullName = (name) => {
        const fullNamePattern = /^[А-ЯЁІЇЄҐ][а-яёіїєґ]+\s[А-ЯЁІЇЄҐ][а-яёіїєґ]+\s[А-ЯЁІЇЄҐ][а-яёіїєґ]+$/;
        return fullNamePattern.test(name);
    };
  
    const handleCheck = async () => {
      if (!file){
        setError("Оберіть файл для перевірки.");
        return;
      };
      const formattedName = formatFullName(fullName);
      if(!validateFullName(formattedName)){
        setFullNameError(true);
        return;
      }
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ownerName", formattedName);
      console.log(criteriaToCheck)
      formData.append("criteriaToCheck", JSON.stringify(criteriaToCheck));

      try {
          const response = await axios.post("http://localhost:3000/validate", formData, {
              headers: { "Content-Type": "multipart/form-data" },
          });

          onCheckComplete(response.data.validationResults);
         
      } catch (err) {
          setError("Не вдалося перевірити файл.");
      }
      setLoading(false);
    };


    return (
      <div className="mb-2">
          <div className="flex flex-col mb-4">
            <label className="mb-2" htmlFor="fullName">ПІБ власника щоденника:</label>
            <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={handleNameChange}
                placeholder="Василенко Іван Андрійович"
                className={`w-100 p-2 border rounded-lg focus:outline-none focus:ring-2 ${fullNameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-500 focus:ring-blue-500'}`}
            />
            {fullNameError && <p className="text-red-500">ПІБ вказано невірно</p>}
        </div>

        <p className="mb-2" htmlFor="fullName">Заповнений щоденник:</p>
        <div className="inline-flex flex-col gap-4 p-4 border rounded-lg shadow max-w-sm self-start">
          <input
            id="journal"
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="file-input border p-2 cursor-pointer"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleCheck}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Перевірка..." : "Завантажити та перевірити"}
          </button>
        </div>
      </div>
    );
    
};

export default JournalUpload;