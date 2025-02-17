// Imports
import express from "express";

// Configurations
const app = express();  


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