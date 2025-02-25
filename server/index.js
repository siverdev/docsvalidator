// Imports
import express from "express";
import mammoth from "mammoth";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv"
import path from "path";
import fs from "fs";
import checklist from "./data/journal_checklist.json" with {type: "json"};
import InternshipJournal from "./classes/InternshipJournal.js";
import { analyzeWithAI, validateJournal } from "./lib/validation.js";

// Configurations
const app = express();  
dotenv.config();

// Middleware
app.use(cors());

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, "public/docs");
    },
    filename: (req, file, cb) => {
       const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
       cb(null, uniqueSuffix + "_" + file.originalname);
    }
 });
 
 const upload = multer({storage: storage});
 

// Routes
app.get("/journal-checklist", async (req, res) => {
    try {
        return res.status(200).json({ checklist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Помилка під час завантаження критеріїв відповідності" });
    }
})

app.post("/validate", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Файл не завантажено" });

  try {
    const filePath = path.join("public/docs", req.file.filename);
    const data = await mammoth.extractRawText({ path: filePath });
    const text = data.value;

    if(!req.body.ownerName){
        return res.status(400).json({ error: "Передано неповний набір даних" });
    }

    const journal = new InternshipJournal(text, req.body.ownerName);
    journal.splitIntoSections();

    const criteriaToCheck = req.body.criteriaToCheck ? JSON.parse(req.body.criteriaToCheck) : null;
    const validationResults = await validateJournal(journal, criteriaToCheck);
    const AISuggestions = await analyzeWithAI(journal, validationResults);

    // Видалення файлу після обробки
    fs.unlinkSync(filePath);

    return res.status(200).json({ validationResults, AISuggestions });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "Помилка обробки файлу" });
  }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack, err.name, err.code);
    res.status(500).json({
        errorMessage: "Щось пішло не так. Спробуйте пізніше."
    })
});


// App
const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})