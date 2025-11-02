export interface ChartExportData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
}

export async function exportChartAsCSV(
  data: ChartExportData,
  filename: string = 'chart-data'
): Promise<void> {
  const headers = ['Label', ...data.datasets.map((d) => d.label)];
  const rows = data.labels.map((label, i) => [
    label,
    ...data.datasets.map((d) => d.data[i] || 0),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

export async function exportChartAsJSON(
  data: ChartExportData,
  filename: string = 'chart-data'
): Promise<void> {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
}

export function exportTableAsCSV(
  tableData: Array<Record<string, any>>,
  filename: string = 'table-data'
): void {
  if (tableData.length === 0) return;

  const headers = Object.keys(tableData[0]);
  const rows = tableData.map((row) =>
    headers.map((header) => {
      const value = row[header];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    })
  );

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
