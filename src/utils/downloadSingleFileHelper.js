import { jsPDF } from "jspdf";
import TurndownService from "turndown";

// CONTANTS ==================================================================
// ============================================================================

const PDF_MARGINS = [15, 15, 15, 15];
const PDF_SCALE = 0.3;
const EXPORT_CSS = `
      body {
       font-family: 'Courier', monospace;
        font-size: 13pt;
        color: wheat;
        background-color: #1a1a1a;
      }
        mark {
  border-radius: 0.1rem !important;
  padding: 0 0.1rem !important;
  color: white !important;

}

      h1 { font-size: 18pt; color: #dc7633; }
      h2 { font-size: 16pt; color: #27ae60; }
      h3 { font-size: 14pt; color: #7f8c8d; }
      h4, h5, h6 { font-size: 12pt; color: #95a5a6; }

      p, span, label {
        font-size: 13pt;
        margin: 8px 0;
      }

      input[type="checkbox"] {
        transform: scale(1.4);
        cursor: pointer;
        margin-right: 8px;
        vertical-align: middle;
        background-color: #dc7633;
        color: black;
      }
li {
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
padding: 4px 0;
width: fit-content;
}
      .task-item {
        display: flex;
        align-items: center;
        margin: 6px 0;
      }

      .task-item span {
        font-size: 11pt;
      }

      blockquote {
        max-width: 100%;
        box-sizing: border-box;
        padding: 10px 16px;            
    background: #090909;
    border-left: 4px solid #6b91ff;
    font-style: italic;
    color: #a8a8a8;
    
        font-style: italic;
     
        margin: 12px 0;
      }
    `



// FUNCTIONS =====================================================================
export const downloadAsHTML = (content, title) => {

  const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${title || "note"}</title>
          <style> body{font-family: 'Consolas', monospace !important; max-width: 800px; margin: 0 auto} ${EXPORT_CSS}</style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

  const blob = new Blob([fullHTML], { type: "text/html" });
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
  console.log("🚀 ~ downloadAsMarkdown ~ content:", content);
  const turndownService = new TurndownService(); // ← create instance
  const markdown = turndownService.turndown(content);
  console.log("🚀 ~ downloadAsMarkdown ~ markdown:", markdown)


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
  // Create a temporary container to work with HTML content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // Convert HTML to plain text with some structure preserved
  const convertNodeToText = (node) => {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        return node.nodeValue;

      case Node.ELEMENT_NODE:
        const tag = node.tagName.toLowerCase();

        if (["br"].includes(tag)) return "\n";
        if (["p", "div"].includes(tag)) return getTextFromChildren(node) + "\n\n";
        if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
          return `\n${getTextFromChildren(node).toUpperCase()}\n\n`;
        }
        if (tag === "blockquote") {
          return `> ${getTextFromChildren(node)}\n\n`;
        }
        if (tag === "ul" || tag === "ol") {
          return getTextFromChildren(node);
        }
        if (tag === "li") {
          return `- ${getTextFromChildren(node)}\n`;
        }
        if (tag === "input" && node.type === "checkbox") {
          return node.checked ? "[x] " : "[ ] ";
        }
        return getTextFromChildren(node);

      default:
        return "";
    }
  };

  const getTextFromChildren = (node) =>
    Array.from(node.childNodes)
      .map(convertNodeToText)
      .join("");

  const plainText = getTextFromChildren(tempDiv).trim();

  // Create and download the .txt file
  const blob = new Blob([plainText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title || "note"}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

