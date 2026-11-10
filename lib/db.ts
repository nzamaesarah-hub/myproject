import fs from "node:fs";
import path from "node:path";
// @ts-expect-error node:sqlite is available in the required Node 24 runtime; starter typings are Node 20.
import { DatabaseSync } from "node:sqlite";
import { projects as starterProjects } from "../data/portfolio";
import { strengths } from "../data/skills";
import { certificates as starterCertificates } from "../data/certificates";

// Built into Node 24; keeping SQLite local makes this project easy to run for class.

export type Project = {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
};

export type Certificate = {
  id: number;
  title: string;
  issuer: string;
  year: string;
  image: string;
  url: string;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  approved: number;
};

export type Skill = { id: number; title: string; description: string };

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "portfolio.sqlite");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db: any = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT '',
    text TEXT NOT NULL,
    approved INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS project_likes (
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL,
    PRIMARY KEY (project_id, visitor_id)
  );
  CREATE TABLE IF NOT EXISTS project_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

if (db.prepare("SELECT COUNT(*) AS total FROM projects").get().total === 0) {
  const insert = db.prepare("INSERT INTO projects (title, category, year, image, description) VALUES (?, ?, ?, ?, ?)");
  for (const project of starterProjects) {
    insert.run(project.title, project.category, project.year, project.image.startsWith("/") ? project.image : `/${project.image}`, "");
  }
}

if (db.prepare("SELECT COUNT(*) AS total FROM skills").get().total === 0) {
  const insert = db.prepare("INSERT INTO skills (title, description) VALUES (?, ?)");
  for (const skill of strengths) insert.run(skill.title, skill.description);
}

if (!db.prepare("SELECT 1 FROM app_settings WHERE key=?").get("starter_certificates_added")) {
  const insert = db.prepare("INSERT INTO certificates (title, issuer, year, image, url) VALUES (?, ?, ?, ?, ?)");
  for (const certificate of starterCertificates) {
    const alreadyAdded = db.prepare("SELECT 1 FROM certificates WHERE url=?").get(certificate.url);
    if (!alreadyAdded) insert.run(certificate.title, certificate.issuer, certificate.year, certificate.image, certificate.url);
  }
  db.prepare("INSERT INTO app_settings (key, value) VALUES (?, ?)").run("starter_certificates_added", "yes");
}

export function listProjects(): Project[] {
  return db.prepare("SELECT * FROM projects ORDER BY id DESC").all().map((row: Project) => ({ ...row }));
}

export function listCertificates(): Certificate[] {
  return db.prepare("SELECT * FROM certificates ORDER BY year DESC, id DESC").all();
}

export function listSkills() {
  return db.prepare("SELECT * FROM skills ORDER BY id").all();
}

export function listPublicTestimonials(): Testimonial[] {
  return db.prepare("SELECT id, name, role, text, approved FROM testimonials WHERE approved = 1 ORDER BY id DESC").all().map((row: Testimonial) => ({ ...row }));
}

export function listAdminData() {
  return {
    projects: listProjects(),
    certificates: listCertificates(),
    skills: listSkills(),
    comments: db.prepare("SELECT c.*, p.title AS project_title FROM project_comments c JOIN projects p ON p.id=c.project_id ORDER BY c.id DESC").all(),
    testimonials: db.prepare("SELECT * FROM testimonials ORDER BY id DESC").all(),
    messages: db.prepare("SELECT * FROM messages ORDER BY id DESC").all(),
  };
}

export function createContactMessage(name: string, email: string, text: string) {
  return db.prepare("INSERT INTO messages (name, email, text) VALUES (?, ?, ?)").run(name, email, text);
}

export function createTestimonial(name: string, role: string, text: string) {
  return db.prepare("INSERT INTO testimonials (name, role, text) VALUES (?, ?, ?)").run(name, role, text);
}

export function getProjectActivity(projectId: number, visitorId: string) {
  const likes = db.prepare("SELECT COUNT(*) AS total FROM project_likes WHERE project_id=?").get(projectId).total as number;
  const liked = Boolean(db.prepare("SELECT 1 FROM project_likes WHERE project_id=? AND visitor_id=?").get(projectId, visitorId));
  const comments = db.prepare("SELECT id, name, text, created_at FROM project_comments WHERE project_id=? ORDER BY id DESC").all(projectId);
  return { likes, liked, comments };
}

export function projectExists(projectId: number) {
  return Boolean(db.prepare("SELECT 1 FROM projects WHERE id=?").get(projectId));
}

export function setProjectLike(projectId: number, visitorId: string, liked: boolean) {
  if (liked) db.prepare("INSERT OR IGNORE INTO project_likes (project_id, visitor_id) VALUES (?, ?)").run(projectId, visitorId);
  else db.prepare("DELETE FROM project_likes WHERE project_id=? AND visitor_id=?").run(projectId, visitorId);
}

export function addProjectComment(projectId: number, name: string, text: string) {
  return db.prepare("INSERT INTO project_comments (project_id, name, text) VALUES (?, ?, ?)").run(projectId, name, text);
}

const tableFor = { projects: "projects", certificates: "certificates", skills: "skills", testimonials: "testimonials" } as const;
export type EditableCollection = keyof typeof tableFor;

export function saveAdminRecord(collection: EditableCollection, id: number | null, input: Record<string, unknown>) {
  const table = tableFor[collection];
  if (collection === "projects") {
    const values = [input.title, input.category, input.year, input.image ?? "", input.description ?? ""];
    if (id) db.prepare("UPDATE projects SET title=?, category=?, year=?, image=?, description=? WHERE id=?").run(...values, id);
    else db.prepare("INSERT INTO projects (title, category, year, image, description) VALUES (?, ?, ?, ?, ?)").run(...values);
  } else if (collection === "certificates") {
    const values = [input.title, input.issuer, input.year, input.image ?? "", input.url ?? ""];
    if (id) db.prepare("UPDATE certificates SET title=?, issuer=?, year=?, image=?, url=? WHERE id=?").run(...values, id);
    else db.prepare("INSERT INTO certificates (title, issuer, year, image, url) VALUES (?, ?, ?, ?, ?)").run(...values);
  } else if (collection === "skills") {
    const values = [input.title, input.description ?? ""];
    if (id) db.prepare("UPDATE skills SET title=?, description=? WHERE id=?").run(...values, id);
    else db.prepare("INSERT INTO skills (title, description) VALUES (?, ?)").run(...values);
  } else {
    const values = [input.name, input.role ?? "", input.text, Number(Boolean(input.approved))];
    if (id) db.prepare("UPDATE testimonials SET name=?, role=?, text=?, approved=? WHERE id=?").run(...values, id);
    else db.prepare("INSERT INTO testimonials (name, role, text, approved) VALUES (?, ?, ?, ?)").run(...values);
  }
}

export function deleteAdminRecord(collection: EditableCollection | "messages" | "comments", id: number) {
  const table = collection === "messages" ? "messages" : collection === "comments" ? "project_comments" : tableFor[collection];
  db.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);
}

