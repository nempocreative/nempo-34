import { useEffect, useState } from 'react';
import { Download, FileSpreadsheet, LoaderCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import workbookUrl from '../jadwal-kerja-kala-muda-ggs.xlsx?url';

type CellValue = string | number | boolean;
type WorkbookCell = {
  value: CellValue;
  columnSpan: number;
  rowSpan: number;
};
type WorkbookRow = {
  rowNumber: number;
  cells: WorkbookCell[];
};
type WorkbookSheet = {
  name: string;
  rows: WorkbookRow[];
};

export function SpreadsheetViewer() {
  const [sheets, setSheets] = useState<WorkbookSheet[]>([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function loadWorkbook() {
      try {
        const response = await fetch(workbookUrl);
        if (!response.ok) {
          throw new Error('File spreadsheet tidak dapat dimuat.');
        }

        const workbook = XLSX.read(await response.arrayBuffer(), {
          type: 'array',
          cellDates: true,
        });
        const loadedSheets = workbook.SheetNames.map((name) => {
          const worksheet = workbook.Sheets[name];
          if (!worksheet['!ref']) return { name, rows: [] };

          const range = XLSX.utils.decode_range(worksheet['!ref']);
          const coveredCells = new Set<string>();
          const rows: WorkbookRow[] = [];

          for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
            const cells: WorkbookCell[] = [];

            for (
              let columnIndex = range.s.c;
              columnIndex <= range.e.c;
              columnIndex += 1
            ) {
              const cellKey = `${rowIndex}:${columnIndex}`;
              if (coveredCells.has(cellKey)) continue;

              const address = XLSX.utils.encode_cell({
                r: rowIndex,
                c: columnIndex,
              });
              const sourceCell = worksheet[address];
              const value = sourceCell ? XLSX.utils.format_cell(sourceCell) : '';
              const merge = worksheet['!merges']?.find(
                ({ s }) => s.r === rowIndex && s.c === columnIndex,
              );
              const columnSpan = merge ? merge.e.c - merge.s.c + 1 : 1;
              const rowSpan = merge ? merge.e.r - merge.s.r + 1 : 1;

              if (merge) {
                for (let mergedRow = merge.s.r; mergedRow <= merge.e.r; mergedRow += 1) {
                  for (
                    let mergedColumn = merge.s.c;
                    mergedColumn <= merge.e.c;
                    mergedColumn += 1
                  ) {
                    if (mergedRow !== rowIndex || mergedColumn !== columnIndex) {
                      coveredCells.add(`${mergedRow}:${mergedColumn}`);
                    }
                  }
                }
              }

              cells.push({ value, columnSpan, rowSpan });
            }

            if (cells.some((cell) => cell.value !== '')) {
              rows.push({ rowNumber: rowIndex + 1, cells });
            }
          }

          return { name, rows };
        });

        if (isCurrent) {
          setSheets(loadedSheets);
          setActiveSheet(loadedSheets[0]?.name ?? '');
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Terjadi kesalahan saat membaca spreadsheet.',
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadWorkbook();
    return () => {
      isCurrent = false;
    };
  }, []);

  const currentSheet = sheets.find((sheet) => sheet.name === activeSheet);

  return (
    <section
      aria-label="Spreadsheet jadwal kerja Kala Muda"
      className="w-full max-w-7xl px-1 pb-6 max-[640px]:px-3"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 max-[640px]:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-900">
                Jadwal Kerja Kala Muda
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Pratinjau spreadsheet · {sheets.length || 4} lembar
              </p>
            </div>
          </div>
          <a
            href={workbookUrl}
            download="jadwal-kerja-kala-muda-ggs.xlsx"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#062f4d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b4d69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd00] focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Unduh Excel
          </a>
        </header>

        {isLoading ? (
          <div
            className="flex min-h-48 items-center justify-center gap-3 text-sm font-medium text-slate-600"
            role="status"
          >
            <LoaderCircle className="h-5 w-5 animate-spin text-emerald-700" />
            Membuka spreadsheet…
          </div>
        ) : error ? (
          <div
            className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        ) : (
          <>
            <div
              className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 pt-3"
              role="tablist"
              aria-label="Lembar spreadsheet"
            >
              {sheets.map((sheet) => (
                <button
                  key={sheet.name}
                  type="button"
                  role="tab"
                  aria-selected={activeSheet === sheet.name}
                  onClick={() => setActiveSheet(sheet.name)}
                  className={`shrink-0 rounded-t-lg border border-b-0 px-4 py-2 text-sm font-semibold transition-colors ${
                    activeSheet === sheet.name
                      ? 'border-slate-200 bg-white text-[#062f4d]'
                      : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {sheet.name}
                </button>
              ))}
            </div>

            <div
              className="max-h-[66vh] min-h-56 overflow-auto"
              role="tabpanel"
              aria-label={activeSheet}
            >
              {currentSheet && currentSheet.rows.length > 0 ? (
                <table className="w-full border-collapse text-left text-sm">
                  <tbody>
                    {currentSheet.rows.map((row) => {
                      const values = row.cells.map((cell) =>
                        String(cell.value).trim(),
                      );
                      const isTitle = row.rowNumber === 1;
                      const isSection = [
                        'PEMBAGIAN SHIFT',
                        'JADWAL MINGGUAN',
                        'SISTEM SHIFT & PEMASUKAN',
                        'CATATAN',
                      ].some((title) => values.includes(title));
                      const isColumnHeader = values.includes('Hari');
                      const isShiftInfo = ['Shift 1', 'Shift 2'].some((shift) =>
                        values.includes(shift),
                      );
                      const isBullet = values.some((value) =>
                        value.startsWith('•'),
                      );
                      const isNote = values.some((value) =>
                        value.startsWith('Silakan isi nama'),
                      );

                      return (
                        <tr
                          key={`${activeSheet}-${row.rowNumber}`}
                          className={
                            isTitle
                              ? 'bg-[#062f4d] text-white'
                              : isSection
                                ? 'bg-[#A90E59] text-white'
                                : isColumnHeader
                                  ? 'bg-[#fdf2f8] text-[#062f4d]'
                                  : isBullet
                                    ? 'bg-[#fff9f7]'
                                    : isNote
                                      ? 'bg-amber-50'
                                      : row.rowNumber % 2 === 0
                                        ? 'bg-slate-50 hover:bg-emerald-50/60'
                                        : 'bg-white hover:bg-emerald-50/60'
                          }
                        >
                          <th
                            scope="row"
                            className={`sticky left-0 z-10 min-w-12 border-b border-r px-3 py-2 text-right text-xs font-medium tabular-nums ${
                              isTitle
                                ? 'border-white/15 bg-[#062f4d] text-white/70'
                                : isSection
                                  ? 'border-white/20 bg-[#A90E59] text-white/70'
                                  : 'border-slate-200 bg-slate-100 text-slate-500'
                            }`}
                          >
                            {row.rowNumber}
                          </th>
                          {row.cells.map((cell, cellIndex) => (
                            <td
                              key={`${activeSheet}-${row.rowNumber}-${cellIndex}`}
                              colSpan={cell.columnSpan}
                              rowSpan={cell.rowSpan}
                              className={`min-w-28 whitespace-pre-wrap break-words border-b border-r px-3 py-2 align-top ${
                                isTitle
                                  ? 'border-white/15 text-base font-semibold'
                                  : isSection
                                    ? 'border-white/20 font-semibold tracking-wide'
                                    : isColumnHeader
                                      ? 'border-slate-200 py-3 font-semibold'
                                      : isShiftInfo && cellIndex === 0
                                        ? 'border-slate-200 font-semibold text-[#062f4d]'
                                        : isBullet
                                          ? 'border-slate-200 py-3 leading-relaxed text-slate-700'
                                          : isNote
                                            ? 'border-slate-200 py-3 leading-relaxed text-slate-700'
                                            : 'border-slate-200 text-slate-700'
                              }`}
                            >
                              {String(cell.value)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-sm text-slate-500">
                  Lembar ini belum berisi data.
                </p>
              )}
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
              <span>
                {currentSheet?.rows.length ?? 0} baris ditampilkan
              </span>
              <span>Mode pratinjau · unduh Excel untuk mengedit</span>
            </footer>
          </>
        )}
      </div>
    </section>
  );
}
