// Imports
import express from "express";
import mammoth from "mammoth";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import checklist from "./data/journal_checklist.json" with {type: "json"};
import shevchenko from "shevchenko";
import InternshipJournal from "./classes/InternshipJournal.js";


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

function splitIntoSections(text) {
    const sections = {};
    const parts = [
        { key: "rules", title: "Правила ведення й оформлення щоденника" },
        { key: "info", title: "ЩОДЕННИК ПРАКТИКИ" },
        { key: "assignment", title: "НАПРАВЛЕННЯ НА ПРАКТИКУ" },
        { key: "provisions", title: "5. Основні положення практики" },
        { key: "evaluation", title: "4. Висновок керівника практики від факультету про роботу студента" },
        { key: "task", title: "1. Завдання на практику" },
        { key: "schedule", title: "Календарний графік проходження практики" },
        { key: "review", title: "3.Характеристика й оцінка роботи студента на практиці" },
    ];

    let currentKey = null;
    let currentText = [];

    text.split("\n").forEach(line => {
        line = line.trim().replace(/\s+/g, " "); // Видаляємо зайві пробіли

        if (!line) return;

        // Перевіряємо, чи рядок є заголовком секції
        const part = parts.find(p => line === p.title);

        if (part) {
            if (currentKey) {
                sections[currentKey] = currentText.join("\n").trim();
            }
            currentKey = part.key;
            currentText = [line]; // Додаємо заголовок у секцію
            return;
        }

        if (currentKey) {
            currentText.push(line);
        }
    });

    // Додаємо останню секцію
    if (currentKey) {
        sections[currentKey] = currentText.join("\n").trim();
    }

    return sections;
}
//  {"id": 1, "title": "Назва щоденника", "description": "перевірка наявності ПІБ у родовому відмінку"},

app.post("/validate", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Файл не завантажено" });

  try {
    const filePath = path.join("public/docs", req.file.filename);
    const data = await mammoth.extractRawText({ path: filePath });
    const text = data.value;

    const journal = new InternshipJournal(text);
    journal.splitIntoSections();

    const ownerName = "Михайлов Михайло Михайлович";

    let validationResults = checklist;

    //0. Структура щоденника: перевірка наявності всіх розділів
    const sectionsAmnt = Object.keys(journal.sections).length;
    sectionsAmnt === 8
    ? validationResults[0] = {...validationResults[0], status: "correct", result: "наявні всі розділи"}
    : validationResults[0] = {...validationResults[0], status: "error", result: `не вистачає ${8-sectionsAmnt} розділів`};

    
    //потім перед валідацією в кожному окремому розділі треба перевіряти чи існує цей розділ в принципі
    //якщо не існує, то одразу повертати помилку "розділ відсутній"

    // 1
    //Info section
    if(!journal.sections.info){
        validationResults[1] = {...validationResults[1], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"}
    }else{
        // 1. Назва щоденника: перевірка наявності ПІБ у родовому відмінку
        // Отримуємо ім'я в родовому відмінку
        const nameParts = ownerName.split(" ");
        const ownerInfo = {
            givenName: nameParts[1],
            patronymicName: nameParts[2],
            familyName: nameParts[0]
        };
        const gender = await shevchenko.detectGender(ownerInfo); 
        ownerInfo.gender = gender;
        const inGenitiveOutput = await shevchenko.inGenitive(ownerInfo);
        const ownerNameGenitive = `${inGenitiveOutput.familyName} ${inGenitiveOutput.givenName} ${inGenitiveOutput.patronymicName}`; 
        const infoRegex = /студент(?:ка|\(а\/ки\))?\s+([А-ЯЇІЄҐ][а-яїієґ]+\s+[А-ЯЇІЄҐ][а-яїієґ]+\s+[А-ЯЇІЄҐ][а-яїієґ]+)/;
        const infoMatch = journal.sections.info.match(infoRegex);
        if (infoMatch) {
            const foundName = infoMatch[1];
            foundName === ownerNameGenitive
                ? validationResults[1] = {...validationResults[1], status: "correct", result: foundName}
                : validationResults[1] = {...validationResults[1], status: "error", result: foundName ? foundName : "Не вказано"};
        } else {
            validationResults[1] = {...validationResults[1], status: "error", result: "Не вказано"};
        }
    }

    //2,3,4,5,6
    //Assignment section
    if(!journal.sections.assignment){
        validationResults[2] = {...validationResults[2], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
        validationResults[3] = {...validationResults[3], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
        validationResults[4] = {...validationResults[4], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
        validationResults[5] = {...validationResults[5], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
        validationResults[6] = {...validationResults[6], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
    }else{
        // 2. Направлення на практику: перевірка наявності ПІБ у називному відмінку
        const assignmentRegex = /Студент(?:ка|\(ка\))?\s+([А-ЯЇІЄҐ][а-яїієґ]+\s+[А-ЯЇІЄҐ][а-яїієґ]+\s+[А-ЯЇІЄҐ][а-яїієґ]+)/;
        const assignmentMatch = journal.sections.assignment.match(assignmentRegex);
        if (assignmentMatch) {
            const foundName = assignmentMatch[1];
            foundName === ownerName 
                ? validationResults[2] = {...validationResults[2], status: "correct", result: foundName}
                : validationResults[2] = {...validationResults[2], status: "error", result: foundName ? foundName : "Не вказано"};
        } else {
            validationResults[2] = {...validationResults[2], status: "error", result: "Не вказано"};
        }

        // 3. Направлення на практику: перевірка місця виробничої практики
        const practicePlaceRegex = /направляється на виробничу практику на\s+(.+)/i;
        const match = journal.sections.assignment.match(practicePlaceRegex);
        if (match) {
            const place = match[1].trim().replace(/_+/g, ''); // Отримуємо місце практики без зайвих пробілів

            // Перевіряємо, чи починається воно з "кафедру" або "катедру"
            const departmentRegex = /^(кафедру|катедру)\s+(.+)/i;
            const departmentMatch = place.match(departmentRegex);
        
            if (departmentMatch) {
                const departmentName = departmentMatch[2].trim();
                
                departmentName === "теорії та технології програмування факультету комп’ютерних наук та кібернетики"
                    ? validationResults[3] = {...validationResults[3], status: "correct", result: `на ${place}` }
                    : validationResults[3] = {...validationResults[3], status: "error", result: `вказано катерду відмінну від ТТП ФКНК: "на ${departmentName}"` };
            } else {
                place.length > 0
                    ? validationResults[3] = { ...validationResults[3], status: "correct", result: `на ${place}` }
                    : validationResults[3] = { ...validationResults[3], status: "error", result: "Поле не заповнене" };
            }
        } else {
            validationResults[2] = { status: "error", result: "Не вказано" };
        }

        // 4. Направлення на практику: перевірка терміну практики
        const practiceTermRegex = /Термін практики:\s*з\s*(\d{2}\.\d{2}\.\d{4})\s*по\s*(\d{2}\.\d{2}\.\d{4})\s*року/i;
        const termMatch = journal.sections.assignment.replace(/_+/g, '').match(practiceTermRegex);

        if (termMatch) {
            const startDate = termMatch[1];
            const endDate = termMatch[2];
            const expectedStartDate = "20.01.2025";
            const expectedEndDate = "02.03.2025";

            startDate === expectedStartDate && endDate === expectedEndDate
                ? validationResults[4] = { ...validationResults[4], status: "correct", result: `з ${startDate} по ${endDate}` }
                : validationResults[4] = { ...validationResults[4], status: "error", result: `з ${startDate} по ${endDate} (невірний термін)` };
            
        } else {
            validationResults[4] = { ...validationResults[4], status: "error", result: "Термін практики не вказано або формат неправильний" };
        }

        // 5. Направлення на практику: перевірка наявності керівника практики
        const supervisorRegex = /Керівник практики від катедри\/підприємства:\s*(.+)/i;
        const supervisorMatch = journal.sections.assignment.replace(/_+/g, '').match(supervisorRegex);

        if (supervisorMatch) {
            const supervisor = supervisorMatch[1].trim();

            supervisor.length > 0
                ? validationResults[5] = { ...validationResults[5], status: "correct", result: supervisor }
                : validationResults[5] = { ...validationResults[5], status: "error", result: "Поле керівника практики не заповнене" };
        } else {
            validationResults[5] = { ...validationResults[5], status: "error", result: "Поле керівника практики не знайдено" };
        }

        // 6. Направлення на практику: перевірка керівника практики від факультету
        const facultySupervisorRegex = /Керівник практики від факультету:\s*(.+)/i;
        const facultyMatch = journal.sections.assignment.replace(/_+/g, '').match(facultySupervisorRegex);

        if (facultyMatch) {
            const facultySupervisor = facultyMatch[1].trim();
            const validNames = ["заступник декана Людмила ОМЕЛЬЧУК", "заступник декана Людмила Омельчук"];

            validNames.includes(facultySupervisor)
                ? validationResults[6] = { ...validationResults[6], status: "correct", result: facultySupervisor }
                : validationResults[6] = { ...validationResults[6], status: "error", result: facultySupervisor ? `${facultySupervisor}` : "Поле не заповнене" };
        } else {
            validationResults[6] = { ...validationResults[6], status: "error", result: "Поле керівника практики від факультету не знайдено" };
        }
    }

    //7,8
    if(!journal.sections.evaluation){
        validationResults[7] = {...validationResults[7], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
        validationResults[8] = {...validationResults[8], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
    }else{
        // 7. Висновок керівника практики: перевірка наявності висновку керівника практики про роботу студента
        const evaluationRegex = /Висновок керівника практики від факультету про роботу студента\s*\n([\s\S]*?)\nПідпис керівника/i;
        const evaluationMatch = journal.sections.evaluation.replace(/_+/g, '').match(evaluationRegex);

        if (evaluationMatch) {
            const evaluationText = evaluationMatch[1].trim();
            evaluationText.length > 0
                ? validationResults[7] = {...validationResults[7], status: "correct", result: `${evaluationText.substr(0,100)}...` }
                : validationResults[7] = {...validationResults[7], status: "error", result: "Висновок не заповнений" };
        } else {
            validationResults[7] = {...validationResults[7], status: "error", result: "Поле висновку не знайдено" };
        }

        // 8. Висновок керівника практики: перевірка наявності залікової оцінки з практики
        const evaluationText = journal.sections.evaluation.replace(/_+/g, '').trim(); 

        const gradeRegex = /Залікова оцінка з практики:\s*(\d+)/i; // Число має бути на тому ж рядку
        const gradeMatch = evaluationText.match(gradeRegex);

        if (gradeMatch) {
            const grade = parseInt(gradeMatch[1], 10);

            (grade >= 0 && grade <= 100)
                ? validationResults[8] = { ...validationResults[8], status: "correct", result: grade }
                : validationResults[8] = { ...validationResults[8], status: "error", result: `Некоректна оцінка: "${grade}"` };
        } else {
            validationResults[8] = { ...validationResults[8], status: "error", result: "Оцінка не вказана або формат неправильний" };
        }

    }

    //9
    if(!journal.sections.task){
        validationResults[9] = {...validationResults[9], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
    }else{
        //9. Завдання на практику: перевірка наявності завдання на практику
        const taskText = journal.sections.task.replace(/_+/g, '').trim(); 

        const taskRegex = /Завдання на практику\s*\n([\s\S]*)/i; // текст після "Завдання на практику"
        const taskMatch = taskText.match(taskRegex);

        if (taskMatch) {
            const taskContent = taskMatch[1].trim();
            
            if (taskContent.length === 0) {
                validationResults[9] = {...validationResults[9], status: "error", result: "завдання не заповнене" };
            } else if (taskContent.startsWith("//")) {
                validationResults[9] = {...validationResults[9], status: "error", result: "текст завдання є шаблоном (починається з //)" };
            } else {
                validationResults[9] = {...validationResults[9], status: "correct", result: taskContent };
            }
        } else {
            validationResults[9] = {...validationResults[9], status: "error", result: "розділ 'Завдання на практику' не знайдено" };
        }
    }

    //10
    if(!journal.sections.schedule){
        validationResults[10] = {...validationResults[10], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
    }else{
        //10. Календарний графік: перевірка наявності заповненого графіку проходження практики

    }
    //11
    if(!journal.sections.review){
        validationResults[11] = {...validationResults[11], status: "error", result: "неможливо зробити перевірку (розділ відсутній)"};
    }else{
        //11. Характеристика роботи студента: перевірка наявності характеристики роботи студента на практиці
        const reviewText = journal.sections.review.replace(/_+/g, '').trim(); 

        const reviewRegex = /Характеристика й оцінка роботи студент(а|ки) на практиці\s*\n([\s\S]*?)\nОцінка з практики:/i;
        const reviewMatch = reviewText.match(reviewRegex);

        if (reviewMatch) {
            const reviewContent = reviewMatch[2].trim();

            if (reviewContent.length === 0) {
                validationResults[11] = {...validationResults[11], status: "error", result: "характеристика студента не заповнена" };
            } else {
                validationResults[11] = {...validationResults[11], status: "correct", result: `${reviewContent.substr(0,100)}...`};
            }
        } else {
            validationResults[11] = {...validationResults[11], status: "error", result: "Розділ 'Характеристика й оцінка роботи студента на практиці' не знайдено" };
        }
    }
    
    // Видалення файлу після обробки
    fs.unlinkSync(filePath);

    res.status(200).json({ validationResults });
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