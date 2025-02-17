// api.js — Імітація API
export async function checkReport(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          results: [
            { id: 1, title: "Назва університету", status: "correct" },
            { id: 2, title: "ПІБ студента", status: "error" },
            { id: 3, title: "Підпис керівника", status: "correct" }
          ]
        });
      }, 1500);
    });
  }
  