const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./src/libs/hbs-helper");
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
const port = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/views"));

app.use("/assets", express.static(path.join(__dirname, "./src/assets")));
app.use(express.urlencoded({ extended: true }));

app.get("/", home);
app.get("/testimonial", testimonial);
app.get("/contact", contact);

//PROJECT
app.get("/project", project);
app.post("/project", projectPost);
app.post("/delete-project/:id", projectDelete);
app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", editProjectPost);
app.get("/project-detail/:id", projectDetail);

const projects = [];

function home(req, res) {
  res.render("index");
}

async function project(req, res) {
  const query = `
    SELECT 
      id,
      name,
      TO_CHAR(start_date, 'DD Mon YYYY') as start_date,
      TO_CHAR(end_date, 'DD Mon YYYY') as end_date,
      description,
      technologies,
      image
    FROM projects
  `;
  
  let projects = await sequelize.query(query, { type: QueryTypes.SELECT });

  projects = projects.map((project) => ({
    ...project,
    nameProject: project.name,
    startDate: project.start_date,
    endDate: project.end_date
  }));

  res.render("project", { projects });
}

function testimonial(req, res) {
  res.render("testimonial");
}

function contact(req, res) {
  res.render("contact");
}

async function projectPost(req, res) {
  const { nameProject, description, startDate, endDate, technologies } = req.body;

  // Escape karakter khusus di description
  const escapedDescription = description.replace(/'/g, "''");

  const query = `
    INSERT INTO projects (
      name, 
      start_date, 
      end_date, 
      description, 
      technologies, 
      image
    ) 
    VALUES (
      '${nameProject}', 
      '${hbs.handlebars.helpers.formatToISO(startDate)}',
      ${endDate ? `'${hbs.handlebars.helpers.formatToISO(endDate)}'` : 'NULL'}, 
      '${escapedDescription}', 
      ${hbs.handlebars.helpers.formatTechArray(technologies)}, 
      'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg'
    )`;

  await sequelize.query(query, { type: QueryTypes.INSERT });
  res.redirect("/project");
}

async function projectDelete(req, res) {
  const { id } = req.params;

  const query = `DELETE FROM projects WHERE id = ${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect("/project");
}

async function editProject(req, res) {
  const { id } = req.params;
  
  const query = `
    SELECT 
      id,
      name,
      TO_CHAR(start_date, 'YYYY-MM-DD') as start_date,
      TO_CHAR(end_date, 'YYYY-MM-DD') as end_date,
      description,
      technologies,
      image
    FROM projects 
    WHERE id = ${id}
  `;
  
  const [project] = await sequelize.query(query, { type: QueryTypes.SELECT });
  res.render("edit-project", { project: hbs.handlebars.helpers.transformProject(project) });
}

async function editProjectPost(req, res) {
  const { id } = req.params;
  const { nameProject, description, startDate, endDate, technologies } = req.body;

  const query = `
    UPDATE projects 
    SET 
      name = '${nameProject}', 
      start_date = '${hbs.handlebars.helpers.formatToISO(startDate)}', 
      end_date = ${endDate ? `'${hbs.handlebars.helpers.formatToISO(endDate)}'` : 'NULL'}, 
      description = '${description}',  
      technologies = ${hbs.handlebars.helpers.formatTechArray(technologies)}
    WHERE id = ${id}
  `;

  await sequelize.query(query, { type: QueryTypes.UPDATE });
  res.redirect("/project");
}

async function projectDetail(req, res) {
  const { id } = req.params;
  
  const query = `
    SELECT 
      id,
      name as "nameProject",
      TO_CHAR(start_date, 'DD Mon YYYY') as "startDate",
      TO_CHAR(end_date, 'DD Mon YYYY') as "endDate",
      description,
      technologies,
      image
    FROM projects 
    WHERE id = ${id}
  `;
  
  const [project] = await sequelize.query(query, { type: QueryTypes.SELECT });
  
  project.technologies = Array.isArray(project.technologies) ? project.technologies : [];
  
  res.render("project-detail", { project });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
