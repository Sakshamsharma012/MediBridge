import { createWorker } from 'tesseract.js';
import { BrowserMultiFormatReader } from '@zxing/browser';

let workerPromise;

async function getWorker() {
  if (!workerPromise) workerPromise = createWorker('eng');
  return workerPromise;
}

function clean(value = '') {
  return value.replace(/[|]/g, 'I').replace(/\s+/g, ' ').trim();
}

function parseDate(value) {
  if (!value) return '';
  const s = value.trim().replace(/[.]/g, '/').replace(/[-]/g, '/');
  let m;
  // YYYY/MM/DD
  if ((m = s.match(/\b(20\d{2})\/(\d{1,2})\/(\d{1,2})\b/))) {
    const [, y, mo, d] = m;
    return validDate(+y, +mo, +d);
  }
  // DD/MM/YYYY or MM/DD/YYYY: medicine packs commonly use DD/MM/YYYY.
  if ((m = s.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/))) {
    const [, d, mo, y] = m;
    return validDate(+y, +mo, +d);
  }
  // MM/YYYY or MM/YY expiry formats; use month end for the date input.
  if ((m = s.match(/\b(\d{1,2})\/(20\d{2}|\d{2})\b/))) {
    const mo = +m[1];
    let y = +m[2];
    if (y < 100) y += y >= 70 ? 1900 : 2000;
    if (mo >= 1 && mo <= 12 && y >= 2000 && y <= 2099) {
      const last = new Date(y, mo, 0).getDate();
      return validDate(y, mo, last);
    }
  }
  // DD-MMM-YYYY / MMM-YYYY
  const months = { JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12 };
  if ((m = s.toUpperCase().match(/\b(\d{1,2})[- ]([A-Z]{3})[- ](20\d{2})\b/))) {
    const mo = months[m[2]];
    if (mo) return validDate(+m[3], mo, +m[1]);
  }
  if ((m = s.toUpperCase().match(/\b([A-Z]{3})[- /](20\d{2})\b/))) {
    const mo = months[m[1]];
    if (mo) return validDate(+m[2], mo, new Date(+m[2], mo, 0).getDate());
  }
  return '';
}

function validDate(y, mo, d) {
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return '';
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function extractDate(text, labels) {
  const lines = text.split(/\n/).map(clean).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    if (labels.some(label => new RegExp(`\\b${label}\\b`, 'i').test(lines[i]))) {
      const nearby = `${lines[i]} ${lines[i + 1] || ''}`;
      const date = parseDate(nearby);
      if (date) return date;
    }
  }
  return '';
}

async function readBarcode(file) {
  let url;
  try {
    url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const reader = new BrowserMultiFormatReader();
    const result = await reader.decodeFromImageElement(img);
    return result?.getText?.() || '';
  } catch {
    return '';
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
}

export async function parseTabletImageOcr(file) {
  if (!file) throw new Error('Please select an image first.');

  const worker = await getWorker();
  const { data } = await worker.recognize(file);
  const rawOcrText = data.text || '';
  const text = rawOcrText.replace(/\r/g, '\n');
  const lines = text.split('\n').map(clean).filter(Boolean);

  const getAfter = (labels) => {
    const regex = new RegExp(`(?:${labels.join('|')})\\s*[:#.-]?\\s*([^\\n]{2,70})`, 'i');
    const match = text.match(regex);
    return match ? clean(match[1]).replace(/\b(EXP|MFG|MFD|BATCH|B\.NO|MRP|QTY)\b.*$/i, '').trim() : '';
  };

  const medicineLine = lines.find(line => /\b(tablet|capsule|mg|mcg|ml|syrup|paracetamol|amoxicillin|cetirizine|ibuprofen|metformin|pantoprazole|azithromycin)\b/i.test(line) && !/\b(batch|exp|mfg|mrp|manufactur)/i.test(line)) || '';
  const strengthMatch = text.match(/\b(\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|iu|%))\b/i);
  const dosageMatch = text.match(/\b(tablets?|capsules?|caplets?|syrup|suspension|injection|cream|ointment|drops?)\b/i);
  const batchMatch = text.match(/\b(?:BATCH(?:\s*(?:NO|NUMBER))?|B\.?\s*NO\.?)\s*[:#.-]?\s*([A-Z0-9/-]{3,25})/i);
  const mrpMatch = text.match(/\bMRP\s*[:.]?\s*(?:₹|RS\.?\s*)?([0-9]+(?:\.[0-9]{1,2})?)/i);
  const manufacturer = getAfter(['Mfg\.?\s*by', 'Manufactured by', 'Manufacturer']) || '';
  const medicineName = medicineLine.replace(/\b(tablets?|capsules?|mg|mcg|ml)\b.*$/i, '').replace(/[^\w()+./ -]/g, '').trim();

  // Generic/active ingredient is only filled when an explicit label is printed.
  const genericName = getAfter(['Composition', 'Each tablet contains', 'Each capsule contains', 'Generic name', 'Contains']);
  const expiryDate = extractDate(text, ['EXP(?:IRY)?(?:\s*DATE)?', 'USE\s*BEFORE', 'BEST\s*BEFORE']);
  const manufactureDate = extractDate(text, ['MFG(?:\.?\s*DATE)?', 'MFD', 'MANUFACTURED\s*DATE']);
  const barcode = await readBarcode(file);

  return {
    medicineName,
    genericName,
    strength: strengthMatch?.[1]?.replace(/\s+/g, ' ').trim() || '',
    dosageForm: dosageMatch?.[1] || '',
    manufacturer,
    batchNumber: batchMatch?.[1]?.replace(/[\s.,]+$/, '') || '',
    manufactureDate,
    expiryDate,
    barcode,
    mrp: mrpMatch?.[1] || '',
    confidence: Math.round(data.confidence || 0),
    rawOcrText,
    requiresReview: true,
  };
}
