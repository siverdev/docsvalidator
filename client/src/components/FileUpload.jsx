import { useState } from "react";
import { checkReport } from "../../api";

const FileUpload = ({ onCheckComplete }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };

    const handleUpload = async () => {
      if (!file) return alert("Оберіть файл");
      setLoading(true);
      const result = await checkReport(file);
      console.log("RESULT", result)
      onCheckComplete(result);
      setLoading(false);
    };

    return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow">
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="file-input border p-2"
      />
      <button 
        onClick={handleUpload} 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Перевірка..." : "Завантажити та перевірити"}
      </button>
    </div>
  );
};

export default FileUpload;