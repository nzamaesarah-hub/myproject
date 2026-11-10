import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import express, { type NextFunction, type Request, type RequestHandler, type Response } from "express";
import multer from "multer";
import {
  COOKIE_NAME,
  ONE_WEEK,
  createAdminCookieValue,
  isValidAdminCookie,
  validAdminPassword,
} from "../lib/admin-auth";
import {
  addProjectComment,
  createContactMessage,
  createTestimonial,
  deleteAdminRecord,
  getProjectActivity,
  listAdminData,
  projectExists,
  saveAdminRecord,
  setProjectLike,
  type EditableCollection,
} from "../lib/db";

const app = express();
const api = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const editableCollections: EditableCollection[] = ["projects", "certificates", "skills", "testimonials"];
const deletableCollections = [...editableCollections, "messages", "comments"];

app.use(express.json({ limit: "1mb" }));

function cookieValue(request: Request, name: string) {
  const part = request.headers.cookie?.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`));
  if (!part) return undefined;
  try { return decodeURIComponent(part.slice(name.length + 1)); }
  catch { return undefined; }
}

const requireAdmin: RequestHandler = (request, response, next) => {
  if (!isValidAdminCookie(cookieValue(request, COOKIE_NAME))) {
    response.status(401).json({ error: "Silakan login sebagai admin." });
    return;
  }
  next();
};

function positiveId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validRequiredFields(collection: EditableCollection, input: Record<string, unknown>) {
  const required: Record<EditableCollection, string[]> = {
    projects: ["title", "category", "year"],
    certificates: ["title", "issuer", "year"],
    skills: ["title"],
    testimonials: ["name", "text"],
  };
  return required[collection].every((key) => typeof input[key] === "string" && String(input[key]).trim().length > 0);
}

api.get("/health", (_request, response) => response.json({ ok: true, service: "express-api" }));

api.get("/projects/:id", (request, response) => {
  const id = positiveId(request.params.id);
  if (!id || !projectExists(id)) return response.status(404).json({ error: "Proyek tidak ditemukan." });
  const visitorId = typeof request.query.visitorId === "string" ? request.query.visitorId : "";
  return response.json(getProjectActivity(id, visitorId));
});

api.post("/projects/:id/like", (request, response) => updateLike(request, response, true));
api.delete("/projects/:id/like", (request, response) => updateLike(request, response, false));

function updateLike(request: Request, response: Response, liked: boolean) {
  const id = positiveId(request.params.id);
  const visitorId = String(request.body?.visitorId ?? "");
  if (!id || !projectExists(id)) return response.status(404).json({ error: "Proyek tidak ditemukan." });
  if (visitorId.length < 8 || visitorId.length > 100) return response.status(400).json({ error: "ID pengunjung tidak valid." });
  setProjectLike(id, visitorId, liked);
  return response.json({ ok: true });
}

api.post("/projects/:id/comments", (request, response) => {
  const id = positiveId(request.params.id);
  const name = String(request.body?.name ?? "").trim();
  const text = String(request.body?.text ?? "").trim();
  if (!id || !projectExists(id)) return response.status(404).json({ error: "Proyek tidak ditemukan." });
  if (name.length < 2 || name.length > 100 || text.length < 2 || text.length > 1000) {
    return response.status(400).json({ error: "Isi nama dan komentar dengan benar." });
  }
  addProjectComment(id, name, text);
  return response.status(201).json({ ok: true });
});

api.post("/testimonials", (request, response) => {
  const name = String(request.body?.name ?? "").trim();
  const role = String(request.body?.role ?? "").trim();
  const text = String(request.body?.text ?? "").trim();
  if (name.length < 2 || name.length > 100 || role.length > 100 || text.length < 5 || text.length > 1000) {
    return response.status(400).json({ error: "Nama dan testimoni harus diisi dengan benar." });
  }
  createTestimonial(name, role, text);
  return response.status(201).json({ ok: true, message: "Terima kasih! Testimoni akan ditampilkan setelah disetujui." });
});

api.post("/contact", (request, response) => {
  const name = String(request.body?.name ?? "").trim();
  const email = String(request.body?.email ?? "").trim();
  const text = String(request.body?.text ?? "").trim();
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || text.length < 5 || text.length > 2000) {
    return response.status(400).json({ error: "Periksa kembali nama, email, dan pesanmu." });
  }
  createContactMessage(name, email, text);
  return response.status(201).json({ ok: true });
});

api.post("/admin/login", (request, response) => {
  const password = typeof request.body?.password === "string" ? request.body.password : "";
  if (!validAdminPassword(password)) return response.status(401).json({ error: "Kata sandi tidak cocok." });
  response.cookie(COOKIE_NAME, createAdminCookieValue(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK * 1000,
  });
  return response.json({ ok: true });
});

api.post("/admin/logout", (_request, response) => {
  response.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "strict", path: "/" });
  return response.json({ ok: true });
});

api.get("/admin/data", requireAdmin, (_request, response) => response.json(listAdminData()));

api.post("/admin/upload", requireAdmin, upload.single("file"), async (request, response) => {
  const file = request.file;
  if (!file) return response.status(400).json({ error: "Pilih gambar terlebih dahulu." });
  const extension = imageExtensions[file.mimetype];
  if (!extension) return response.status(415).json({ error: "Format yang diterima: JPG, PNG, atau WEBP." });
  const filename = `${randomUUID()}.${extension}`;
  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, filename), file.buffer, { flag: "wx" });
  return response.status(201).json({ path: `/uploads/${filename}` });
});

api.post("/admin/:collection", requireAdmin, (request, response) => {
  const collection = request.params.collection as EditableCollection;
  const input = request.body as Record<string, unknown>;
  if (!editableCollections.includes(collection)) return response.status(404).json({ error: "Bagian tidak ditemukan." });
  if (!input || typeof input !== "object" || !validRequiredFields(collection, input)) return response.status(400).json({ error: "Lengkapi kolom yang wajib diisi." });
  saveAdminRecord(collection, null, input);
  return response.status(201).json({ ok: true });
});

api.put("/admin/:collection", requireAdmin, (request, response) => {
  const collection = request.params.collection as EditableCollection;
  const input = request.body as Record<string, unknown>;
  if (!input || typeof input !== "object") return response.status(400).json({ error: "Data tidak valid." });
  const id = Number(input?.id);
  if (!editableCollections.includes(collection)) return response.status(404).json({ error: "Bagian tidak ditemukan." });
  if (!Number.isInteger(id) || id < 1) return response.status(400).json({ error: "ID tidak valid." });
  if (!validRequiredFields(collection, input)) return response.status(400).json({ error: "Lengkapi kolom yang wajib diisi." });
  saveAdminRecord(collection, id, input);
  return response.json({ ok: true });
});

api.delete("/admin/:collection", requireAdmin, (request, response) => {
  const collection = request.params.collection;
  const id = Number(request.query.id);
  if (!deletableCollections.includes(collection as (typeof deletableCollections)[number])) return response.status(404).json({ error: "Bagian tidak ditemukan." });
  if (!Number.isInteger(id) || id < 1) return response.status(400).json({ error: "ID tidak valid." });
  deleteAdminRecord(collection as EditableCollection | "messages" | "comments", id);
  return response.json({ ok: true });
});

api.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return response.status(413).json({ error: "Ukuran gambar maksimal 5 MB." });
  }
  console.error("Express API error:", error);
  return response.status(500).json({ error: "Terjadi kesalahan di server." });
});

app.use("/api", api);
app.listen(Number(process.env.API_PORT || 4000), "127.0.0.1", () => {
  console.log(`Express API berjalan di http://127.0.0.1:${process.env.API_PORT || 4000}`);
});
