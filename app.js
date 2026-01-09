const express = require("express");
const mysql = require("mysql2");
const bodyparser = require("body-parser");
const util = require("util");
require("dotenv").config();

const conn = mysql.createConnection({
    host: "bco4bolv6aqbdzjujadi-mysql.services.clever-cloud.com",
    user: "uu3ade5c9j62djhg",
    password: "uvQAYfiaFPslo8TsafUR",
    database: "bco4bolv6aqbdzjujadi"
});

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const exe = util.promisify(conn.query).bind(conn);

// Home page - Add mobile form
app.get("/", (req, res) => {
    res.render("add_mobile");
});

// Save mobile
app.post("/save", async (req, res) => {
    const d = req.body;
    const result = await exe(`
        INSERT INTO mobile_shop (model_name, brand, price, stock)
        VALUES ('${d.model_name}','${d.brand}','${d.price}','${d.stock}')
    `);
    const insertedId = result.insertId;
    res.redirect("/view/" + insertedId);
});

// View newly added mobile
app.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    const data = await exe(`SELECT * FROM mobile_shop WHERE id='${id}'`);
    res.render("card", { mobile: data[0], mode: "view" });
});

// Edit mobile - show form with pre-filled data
app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const data = await exe(`SELECT * FROM mobile_shop WHERE id='${id}'`);
    res.render("edit", { mobile: data[0] });
});

// Update mobile
app.post("/update", async (req, res) => {
    const d = req.body;
    await exe(`
        UPDATE mobile_shop SET
        model_name='${d.model_name}',
        brand='${d.brand}',
        price='${d.price}',
        stock='${d.stock}'
        WHERE id='${d.id}'
    `);
    res.redirect("/view/" + d.id);
});

// Delete mobile
app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await exe(`DELETE FROM mobile_shop WHERE id='${id}'`);
    res.redirect("/");
});

// app.listen(1000, () => {
//     console.log("Server running on port 1000");
// });
app.listen(process.env.PORT || 1000)