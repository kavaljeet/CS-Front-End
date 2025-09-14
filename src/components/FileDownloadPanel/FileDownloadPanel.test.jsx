import { render, screen, fireEvent } from "@testing-library/react";
import FileDownloadPanel from "./FileDownloadPanel";
import files from '../../data/files.json'

beforeEach(() => {
  window.alert = vi.fn();
});

test("renders the file names", () => {
  render(<FileDownloadPanel />);
  files.forEach((file) => {
    expect(screen.getByText(file.name)).toBeInTheDocument();
  });
})

test("selects all files when selectAll checkbox clicked", () => {
  render(<FileDownloadPanel />);
  fireEvent.click(screen.getByLabelText(/select all/i));
  files.forEach((file) => {
    expect(screen.getByLabelText(new RegExp(file.name, "i"))).toBeChecked();
  });
});

test("display alerts when the file status is available", () => {
    render(<FileDownloadPanel />);
    fireEvent.click(screen.getByLabelText(/select all/i));
    fireEvent.click(screen.getByRole("button", { name: /download selected/i }));
  
    expect(window.alert).toHaveBeenCalled();
    const message = window.alert.mock.calls[0][0];
  
    expect(typeof message).toBe("string");
    expect(message).toMatch(/Device:/);
    expect(message).not.toMatch(/scheduled/i);
  });