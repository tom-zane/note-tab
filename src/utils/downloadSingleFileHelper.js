import { jsPDF } from "jspdf";
import TurndownService from "turndown";



export const downloadAsHTML = (content, title) => {
    // const content = editor.getHTML();
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

};

export const downloadAsMarkdown = (content, title) => {
    // const content = editor.getHTML();
    const markdown = new TurndownService.turndown(content);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

};

export const downloadAsTxt = (content, title) => {
    // const content = editor.getHTML();
    const plainText = content
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
        .replace(/\n\s*\n/g, "\n\n"); // Remove extra newlines
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

};

export const downloadAsPDF = (content, title) => {
    const doc = new jsPDF({
        unit: "px",
        hotfixes: ["px_scaling"],
    });

    // const content = editor.getHTML();

    // Improved styling for PDF
    const styledContent = `
      <div style="font-family: Arial, sans-serif; color: #333">
        <h1 style="font-size: 24px; color: #000; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
          ${title || "Note"}
        </h1>
        <div style="font-size: 14px; line-height: 1.6;">
          ${content
            .replace(/<ul data-type="taskList">/g, '<ul style="list-style: none; padding-left: 0;">')
            .replace(/<li data-type="taskItem"([^>]*)>/g, '<li style="display: flex; align-items: center; margin: 8px 0;">')
            .replace(/<input type="checkbox"([^>]*)>/g, '<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #333; border-radius: 3px; margin-right: 8px;">$1</span>')}
        </div>
      </div>
    `;

    doc.html(styledContent, {
        callback: function (pdf) {
            pdf.save(`${title}.pdf`);
        },
        x: 20,
        y: 20,

        html2canvas: {
            scale: 1,
            letterRendering: true,
            useCORS: true,
        },
    });


};