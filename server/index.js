// Imports
import express from "express";
import mammoth from "mammoth";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import checklist from "./data/journal_checklist.json" with {type: "json"};

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
        res.status(200).json({ checklist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Помилка під час завантаження критеріїв відповідності" });
    }
})

function checkNameInSection(text, sectionTitle, fullName) {
    const sectionRegex = new RegExp(`${sectionTitle}([\\s\\S]*?)(?=\\n[A-ZА-ЯІЇЄҐ])`, "i");
    const match = text.match(sectionRegex);
    
    if (!match) {
        return { section: sectionTitle, found: false, reason: "Розділ не знайдено" };
    }

    return match[1].includes(fullName)
        ? { section: sectionTitle, found: true }
        : { section: sectionTitle, found: false, reason: `ПІБ "${fullName}" не знайдено` };
}

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Файл не завантажено" });
  try {
    const filePath = path.join("public/docs", req.file.filename);
    const data = await mammoth.extractRawText({ path: filePath });
    const text = data.value;

    // Перевірка тексту за чек-листом
    const results = checklist.map(item => {
        const regex = new RegExp(item.regex, "i");
        const match = text.match(regex);
        console.log("MATCH ---", match[0])

        return {
            id: item.id,
            title: item.title,
            status: match ? "correct" : "error",
        };
    });

    // Видалення файлу після обробки
    fs.unlinkSync(filePath);

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка обробки файлу" });
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