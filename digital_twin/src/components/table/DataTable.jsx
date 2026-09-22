import React, { useState } from 'react';
import './dataTable.css';

export default function DataTable({ dataset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!dataset || !dataset.rows || dataset.rows.length === 0) {
    return (
      <div className="table-card-container empty-state">
        <p>No tabular records available to display.</p>
      </div>
    );
  }

  const { columns, rows, table } = dataset;

  // Filter rows based on search term
  const filteredRows = rows.filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(row).some((val) => 
      String(val).toLowerCase().includes(term)
    );
  });

  // Pagination math
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // CSV Export utility
  const exportCSV = () => {
    const headerRow = columns.map((c) => `"${c.name}"`).join(',');
    const bodyRows = filteredRows.map((r) =>
      columns.map((c) => `"${r[c.key] !== undefined ? r[c.key] : ''}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...bodyRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${table}_telemetry_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-card-container">
      <div className="table-header-bar">
        <div className="table-title-group">
          <h3 className="table-title">DATABSE TELEMETRY RECORDS</h3>
          <span className="table-subtitle">
            Table: <code className="db-code">{table}</code> • {filteredRows.length} total rows
          </span>
        </div>

        <div className="table-actions">
          <div className="search-input-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search telemetry..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-field"
            />
          </div>

          <button onClick={exportCSV} className="export-csv-btn">
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="telemetry-table">
          <thead>
            <tr>
              <th className="th-index">#</th>
              {columns.map((col) => (
                <th key={col.key}>
                  {col.name} {col.unit ? `(${col.unit})` : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="no-matches">
                  No matching records found for "{searchTerm}"
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => {
                const globalIndex = startIndex + idx + 1;
                const isLowStock = row.low_stock_flag === 1;
                const isCriticalAlert = row.critical_severity > 0;

                return (
                  <tr 
                    key={idx} 
                    className={`${isLowStock ? 'row-warning' : ''} ${isCriticalAlert ? 'row-alert' : ''}`}
                  >
                    <td className="td-index">{globalIndex}</td>
                    {columns.map((col) => {
                      const val = row[col.key];

                      if (col.key === 'low_stock_flag') {
                        return (
                          <td key={col.key}>
                            <span className={`badge-pill ${val === 1 ? 'badge-danger' : 'badge-success'}`}>
                              {val === 1 ? 'LOW STOCK' : 'ADEQUATE'}
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={col.key} className={col.type === 'datetime' ? 'td-time' : ''}>
                          {val !== undefined && val !== null ? String(val) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="table-pagination-footer">
        <span className="pagination-info">
          Showing {filteredRows.length > 0 ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + rowsPerPage, filteredRows.length)} of {filteredRows.length} entries
        </span>

        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>
          <span className="page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
