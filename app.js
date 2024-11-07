const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const hbs = require("hbs");
require("./src/libs/hbs-helper");
const config = require("./config/config");
const { Sequelize, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/upload-file");
const fs = require('fs');

require("dotenv").config()

const environment = process.env.NODE_ENV
const sequelize = new Sequelize(config[environment]);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/views"));

app.use("/assets", express.static(path.join(__dirname, "./src/assets")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "my-session",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());

app.get("/", home);
app.get("/testimonial", testimonial);
app.get("/contact", contact);
app.get("/login", login);
app.post("/login", loginPost);
app.get("/register", register);
app.post("/register", registerPost);

//PROJECT
app.get("/project", isLogin, project);
app.post("/project", isLogin, upload.single("image"), projectPost);
app.post("/delete-project/:id", isLogin, checkProjectOwnership, projectDelete);
app.get("/edit-project/:id", isLogin, checkProjectOwnership, editProject);
app.post("/edit-project/:id", isLogin, checkProjectOwnership, upload.single("image"), editProjectPost);
app.get("/project-detail/:id", projectDetail);
app.post("/logout", logoutPost);

async function home(req, res) {
  const query = `
    SELECT 
      projects.*,
      users.name as author_name
    FROM projects 
    LEFT JOIN users ON projects.author_id = users.id
    ORDER BY projects.id DESC
  `;

  let projects = await sequelize.query(query, { type: QueryTypes.SELECT });

  projects = projects.map((project) => ({
    ...project,
    nameProject: project.name,
    startDate: project.start_date,
    endDate: project.end_date,
    author: project.author_name,
    image: '/' + project.image
  }));

  const user = req.session.user;
  res.render("index", { projects, user });
}

function login(req, res) {
  res.render("login");
}

async function loginPost(req, res) {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = '${email}'`;
  const user = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (!user.length) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }

  const isVerifiedPassword = await bcrypt.compare(password, user[0].password);

  if (!isVerifiedPassword) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }

  req.flash("success", "Login success");
  req.session.user = user[0];
  res.redirect("/");
}

function register(req, res) {
  res.render("register");
}

async function registerPost(req, res) {
  try {
    const { name, email, password } = req.body;

    const checkEmail = await sequelize.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      { type: QueryTypes.SELECT }
    );

    if (checkEmail.length > 0) {
      req.flash("error", "Email already registered");
      return res.redirect("/register");
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO users(name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    req.flash("success", "Registration successful! Please login.");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "Registration failed");
    res.redirect("/register");
  }
}

function logoutPost(req, res) {
  req.session.destroy((err) => {
    if (err) return console.error("Logout gagal!");

    console.log("Logout berhasil!");

    res.redirect("/");
  });
}

async function project(req, res) {
  const query = `
    SELECT 
      projects.*,
      users.name as author_name,
      users.id as author_id
    FROM projects 
    LEFT JOIN users ON projects.author_id = users.id
    ORDER BY projects.id DESC
  `;

  let projects = await sequelize.query(query, { type: QueryTypes.SELECT });

  projects = projects.map((project) => ({
    ...project,
    nameProject: project.name,
    startDate: project.start_date,
    endDate: project.end_date,
    author: project.author_name,
    isOwner: project.author_id === req.session.user.id
  }));

  const user = req.session.user;
  res.render("project", { projects, user });
}

function testimonial(req, res) {
  res.render("testimonial");
}

function contact(req, res) {
  res.render("contact");
}

async function projectPost(req, res) {
  try {
    const { nameProject, description, startDate, endDate, technologies } = req.body;

    if (!req.file) {
      req.flash('error', 'Please upload an image');
      return res.redirect('/project');
    }

    const imagePath = req.file.path;
    const author_id = req.session.user.id;

    const query = `
      INSERT INTO projects (
        name, 
        start_date, 
        end_date, 
        description, 
        technologies, 
        image,
        author_id
      ) 
      VALUES (
        '${nameProject}', 
        '${hbs.handlebars.helpers.formatToISO(startDate)}',
        ${endDate ? `'${hbs.handlebars.helpers.formatToISO(endDate)}'` : "NULL"}, 
        '${description}', 
        ${hbs.handlebars.helpers.formatTechArray(technologies)}, 
        '${imagePath}',
        ${author_id}
      )`;

    await sequelize.query(query, { type: QueryTypes.INSERT });
    req.flash('success', 'Project added successfully');
    res.redirect("/project");
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to add project');
    res.redirect("/project");
  }
}

async function projectDelete(req, res) {
  try {
    const { id } = req.params;

    // Ambil informasi image sebelum menghapus project
    const getImageQuery = `
      SELECT image 
      FROM projects 
      WHERE id = ${id}
    `;
    const [project] = await sequelize.query(getImageQuery, { type: QueryTypes.SELECT });

    if (project && project.image) {
      // Hapus file image dari folder uploads
      fs.unlink(project.image, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          // Lanjutkan proses meski gagal hapus file
        }
      });
    }

    // Hapus data project dari database
    const deleteQuery = `DELETE FROM projects WHERE id = ${id}`;
    await sequelize.query(deleteQuery, { type: QueryTypes.DELETE });

    req.flash('success', 'Project deleted successfully');
    res.redirect("/project");
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to delete project');
    res.redirect("/project");
  }
}

async function editProject(req, res) {
  const { id } = req.params;

  if (!req.session.user) {
    req.flash('error', 'Please login first');
    return res.redirect('/login');
  }

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

  const project = await sequelize.query(query, { type: QueryTypes.SELECT });
  res.render("edit-project", {
    project: hbs.handlebars.helpers.transformProject(project[0]),
    user: req.session.user
  });
}

async function editProjectPost(req, res) {
  try {
    const { id } = req.params;
    const { nameProject, description, startDate, endDate, technologies } = req.body;
    
    let imagePath = null;
    
    if (req.file) {
      imagePath = req.file.path;
    }

    const query = `
      UPDATE projects 
      SET 
        name = '${nameProject}', 
        start_date = '${hbs.handlebars.helpers.formatToISO(startDate)}', 
        end_date = ${
          endDate ? `'${hbs.handlebars.helpers.formatToISO(endDate)}'` : "NULL"
        }, 
        description = '${description}',  
        technologies = ${hbs.handlebars.helpers.formatTechArray(technologies)}
        ${imagePath ? `, image = '${imagePath}'` : ''} 
      WHERE id = ${id}
    `;

    await sequelize.query(query, { type: QueryTypes.UPDATE });
    req.flash('success', 'Project updated successfully');
    res.redirect("/project");
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update project');
    res.redirect(`/edit-project/${id}`);
  }
}

async function projectDetail(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      projects.id,
      projects.name as "nameProject",
      TO_CHAR(projects.start_date, 'DD Mon YYYY') as "startDate",
      TO_CHAR(projects.end_date, 'DD Mon YYYY') as "endDate",
      projects.description,
      projects.technologies,
      CONCAT('/', projects.image) as image,
      users.name as author
    FROM projects 
    LEFT JOIN users ON projects.author_id = users.id
    WHERE projects.id = ${id}
  `;

  const [project] = await sequelize.query(query, { type: QueryTypes.SELECT });

  project.technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  res.render("project-detail", { project });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Tambahkan middleware isLogin
function isLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Please login first');
    return res.redirect('/login');
  }
  next();
}

async function checkProjectOwnership(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    const query = `
      SELECT author_id 
      FROM projects 
      WHERE id = ${id}
    `;
    
    const [project] = await sequelize.query(query, { type: QueryTypes.SELECT });
    
    if (!project || project.author_id !== userId) {
      req.flash('error', 'You are not authorized to perform this action');
      return res.redirect('/project');
    }
    
    next();
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred');
    res.redirect('/project');
  }
}
