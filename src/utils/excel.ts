import * as XLSX from 'xlsx';

/**
 * Excel export and import utilities powered by SheetJS
 */

export function exportToExcel(data: any[], fileName: string, sheetName = 'Data') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export interface StudentImportRow {
  NIS: string;
  NISN?: string;
  Nama: string;
  Kelas: string;
  Jenis_Kelamin?: 'L' | 'P';
  UID_RFID?: string;
  Nama_Orang_Tua?: string;
  Email_Orang_Tua?: string;
  isValid?: boolean;
  errors?: string[];
}

export async function parseStudentExcel(file: File): Promise<StudentImportRow[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(ws);

  return rows.map((r) => {
    const nis = String(r['NIS'] || r['nis'] || '').trim();
    const nisn = String(r['NISN'] || r['nisn'] || '').trim();
    const nama = String(r['Nama'] || r['nama'] || r['Name'] || '').trim();
    const kelas = String(r['Kelas'] || r['kelas'] || r['Class'] || '').trim();
    const gender = (String(r['Jenis_Kelamin'] || r['gender'] || 'L').toUpperCase().startsWith('P') ? 'P' : 'L') as 'L' | 'P';
    const rfid = String(r['UID_RFID'] || r['rfid_uid'] || r['RFID'] || `RFID-${nis}`).trim();
    const parentName = String(r['Nama_Orang_Tua'] || r['parent_name'] || '').trim();
    const parentEmail = String(r['Email_Orang_Tua'] || r['parent_email'] || '').trim();

    return {
      NIS: nis,
      NISN: nisn,
      Nama: nama,
      Kelas: kelas,
      Jenis_Kelamin: gender,
      UID_RFID: rfid,
      Nama_Orang_Tua: parentName,
      Email_Orang_Tua: parentEmail,
    };
  });
}

export function downloadStudentTemplate() {
  window.location.href = '/api/students?action=template';
}
