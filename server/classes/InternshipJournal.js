export default class InternshipJournal {
    constructor(text, ownerName) {
      this.name = "Щоденник практики";
      this.text = text;
      this.ownerName = ownerName;
    }

    // Sections: rules, info, assignment, provisions, evaluation, task, schedule, review
    splitIntoSections() {
      const sections = {};
      let currentKey = null;
      let currentText = [];

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

      const text = this.text;

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

      if (currentKey) {
        sections[currentKey] = currentText.join("\n").trim();
      }

      this.sections = sections;

    }

}