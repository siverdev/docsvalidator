// pages/Home.jsx
import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ResultsList from "../components/ResultsList";

const Home = ()  => {
  const [checkResults, setCheckResults] = useState(null);

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Перевірка звіту з практики</h1>
      <FileUpload onCheckComplete={(result) => setCheckResults(result.results)} />
      {checkResults && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Результати:</h2>
          <ResultsList results={checkResults} />
        </div>
      )}
    </div>
  );
}

export default Home;
