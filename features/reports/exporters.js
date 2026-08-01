/** Small export helpers used by the report screens (Excel via SheetJS, print via the browser). */
import * as XLSX from "xlsx";

function exportRowsToExcel(sheets, filename) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(sh => {
    const ws = XLSX.utils.aoa_to_sheet(sh.rows);
    XLSX.utils.book_append_sheet(wb, ws, sh.name.slice(0, 31));
  });
  XLSX.writeFile(wb, filename);
}

function printReport() {
  window.print();
}

export { exportRowsToExcel, printReport };
