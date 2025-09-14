import { useState, useRef, useEffect } from "react";
import files from "../../data/files.json";
import "./FileDownloadPanel.css";

/**
 * Renders a list of files with checkboxes.
 */
const FileDownloadPanel = () => {
  // Check which files is selected
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Reference for the "SelectAll" checkbox to manipuate state
  const selectAllRef = useRef(null);

  /**
   * Updates the selectAll checkbox state (checked, unchecked, indeterminate)
   */
  useEffect(() => {
    if (!selectAllRef.current) return;

    const total = files.length;
    const selected = selectedFiles.length;
    const checkbox = selectAllRef.current;

    checkbox.checked = false;
    checkbox.indeterminate = false;

    if (selected === 0) return;

    if (selected === total) {
      checkbox.checked = true;
      return;
    }
    checkbox.indeterminate = true;
  }, [selectedFiles, files.length]);

  // Selection of single row toggle
  const toggleRow = (id) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  // Toggle to select and unselect all files
  const toggleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((_, i) => i));
    }
  };

  /**
   * Handle download selected when userclick and 
   * display alert with path and device of selected files
   */
  const handleDownloadSelected = () => {
    if (selectedFiles.length === 0) {
      alert("No files selected.");
      return;
    }

    const availableFiles = selectedFiles
      .map((index) => files[index])
      .filter((file) => file.status === "available");

    if (availableFiles.length === 0) {
      alert("File not available to download");
      return;
    }

    // Message only for available files
    const message = availableFiles
      .map((file) => `Path: ${file.path}\nDevice: ${file.device}`)
      .join("\n\n");

    alert(message);
  };

  return (
    <div className="container">
      <ul className="list">
        <li className="row title">
          <div className="cell col-01">
            <label htmlFor="selectAll">
              <input
                id="selectAll"
                name="selectAll"
                type="checkbox"
                ref={selectAllRef}
                onChange={toggleSelectAll}
                aria-label="Select all files"
              />
            </label>
          </div>
          <div className="cell col-05">
            {selectedFiles.length
              ? `Selected ${selectedFiles.length}`
              : "None Selected"}
          </div>
          <div className="cell col-3">
            <button
              className="btn-download"
              onClick={handleDownloadSelected}
              aria-label="Download Selected files"
            >
              Download Selected
            </button>
          </div>
        </li>

        <li className="header">
          <div className="cell col-05"></div>
          <div className="cell col-1">Name</div>
          <div className="cell col-1">Device</div>
          <div className="cell col-4">Path</div>
          <div className="cell col-1">Status</div>
        </li>

        {files.map((file, index) => (
          <li
            key={file.name}
            className={`row ${selectedFiles.includes(index) ? "selected" : ""}`}
          >
            <div className="cell col-05">
              <label htmlFor={`file-${index+1}`}>
                <input
                  id={`file-${index+1}`}
                  name={file.name}
                  type="checkbox"
                  checked={selectedFiles.includes(index)}
                  onChange={() => toggleRow(index)}
                  aria-label={`select ${file.name} file to download`}
                />
              </label>
            </div>
            <div className="cell col-1">{file.name}</div>
            <div className="cell col-1">{file.device}</div>
            <div className="cell col-4">{file.path}</div>
            <div className="cell">
              {file.status === "available" && <div className="available"></div>}
            </div>
            <div className="cell sentence-case" style={{ flex: 1 }}>
              {file.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileDownloadPanel