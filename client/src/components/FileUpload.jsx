import { useState } from "react";
import axios from "axios";

const FileUpload = ({ onCheckComplete }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null); 

      };

    const handleUpload = async () => {
      if (!file){
        setError("Оберіть файл для перевірки.");
        return;
      };
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      try {
          const response = await axios.post("http://localhost:3000/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
          });

          onCheckComplete(response.data.results);
          console.log(response.data)
      } catch (err) {
          setError("Не вдалося перевірити файл.");
      }
      setLoading(false);
    };
    return (
      <div className="inline-flex flex-col gap-4 p-4 border rounded-lg shadow max-w-sm self-start">
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          className="file-input border p-2 cursor-pointer"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Перевірка..." : "Завантажити та перевірити"}
        </button>
      </div>
    );
    
};

export default FileUpload;