import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import bodyParser from "body-parser";
import path from "path";
require("dotenv").config({ path: ".env" });
const app = express();

let formNames: Array<string> = [];
fs.readdirSync(path.join(__dirname, "../argumentbreaker/forms/")).forEach(
	(file) => {
		formNames.push(file.replace(".json", ""));
	}
);

app.use(express.static(path.join(__dirname, "/public/")));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (request: express.Request, response: express.Response) => {
	response.send("Please enter a valid form.");
});
app.get(
	"/:id",
	async (request: express.Request, response: express.Response) => {
		let id = request.params.id;
		if (formNames.indexOf(id) === -1) {
			response.redirect("/");
			return;
		}
		let formDataPath = path.join(
			__dirname,
			"../argumentbreaker/forms/",
			`${id}.json`
		);
		let data = JSON.parse(fs.readFileSync(formDataPath, "utf-8"));
		response.render("pages/form", { data: data });
	}
);
// mongoose.connect(process.env.DATABASE_URI as string);

app.listen(process.env.PORT, () => {
	console.log(`Listening at port ${process.env.PORT}`);
});
