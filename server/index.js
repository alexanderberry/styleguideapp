const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Routes

//Add entry
app.post("/styleguide", async(req, res) => {
    try {
        console.log(req.body);
        const data = req.body;
        const { title, entries_text } = data;
        const newEntry = await pool.query("INSERT INTO entries(title, entries_text) VALUES ($1, $2) RETURNING *", 
        [title, entries_text]);

        res.json(newEntry.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//Get all entries
app.get("/styleguide", async(req, res) => {
    try {
        const allEntries = await pool.query("SELECT * FROM entries");
        res.json(allEntries.rows);
    } catch (error) {
        console.error(error.message)
    }
});

//Get an entry
app.get("/styleguide/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const entry = await pool.query("SELECT * FROM entries WHERE entries_id = $1", [id]);
        
        res.json(entry.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//Update a specific entry. Supports variable modification (modify both title and entry text, or just one)
app.put("/styleguide/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        const { title, entries_text } = req.data;
        [res.locals.id, res.locals.title, res.locals.entries_text] = id, title, entries_text;
        if (title && entries_text) {
            const updateEntry = pool.query(
                "UPDATE entries SET (title, entries_text) = ($1, $2) WHERE entries_id = $3",
                [title, entries_text, id]
            );
            res.json("Entry updated!")
        }
        else next()
    } catch (error) {
        console.error(error.message);
    }
}, async(req, res) => {
    try {
        const request = "UPDATE entries SET " + 
        [res.locals.title && `title = ${res.locals.title}`, res.locals.entries_text && `entries_text = ${res.locals.entries_text}`].filter(Boolean) +
        ` WHERE entries_id = ${res.locals.id}`;
        const updateEntry = pool.query(request);
        res.json("Entry updated!")
    } catch (error) {
        console.error(error.message);
    }
});

app.delete("/styleguide/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteEntry = await pool.query("DELETE FROM entries WHERE entries_id = $1", [id]);
        res.json("Entry deleted.");
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(5000, () => {
    console.log("Server has started on Port 5000");
});
