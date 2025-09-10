import { Request, Response } from "express";
import HealthRecord from "../models/HealthRecord";
import { decryptJSON } from "../services/encryption";
import PDFDocument from "pdfkit";
import AuditLog from "../models/AuditLog";

export const exportPdf = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const records = await HealthRecord.find({ owner: user._id });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=health-records.pdf"
  );

  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(20).text(`${user.name} - Health Records`, { align: "center" });
  doc.moveDown();

  for (const r of records) {
    doc.fontSize(14).text(`${r.type.toUpperCase()} — ${r.title}`);
    doc.fontSize(12).text(`Meta: ${JSON.stringify(r.meta || {})}`);
    doc
      .fontSize(12)
      .text(`Notes: ${JSON.stringify(decryptJSON(r.notesEncrypted))}`);
    doc.moveDown();
  }

  await AuditLog.create({ user: user._id, action: "export_pdf" });
  doc.end();
};

export const exportJson = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const records = await HealthRecord.find({ owner: user._id });
  const out = records.map((r) => ({
    id: r._id,
    type: r.type,
    title: r.title,
    meta: r.meta,
    notes: decryptJSON(r.notesEncrypted),
  }));
  await AuditLog.create({ user: user._id, action: "export_json" });
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=health-records.json"
  );
  res.json(out);
};
