// Branch timetables
// To add or change a branch, edit this list. Nothing else needs to change.
// The left side is the name shown on the tab, the right side is the PDF path.

const timetables = {

    "AIADS": "timetable/aiads.pdf",
    "AIML": "timetable/aiml.pdf",
    "Blockchain": "timetable/blockchain.pdf",
    "CSE-A": "timetable/cse_A.pdf",
    "CSE-B": "timetable/cse-B.pdf",
    "Cybersecurity": "timetable/cybersecurity.pdf",
    "IT": "timetable/IT.pdf",
    "VNCC": "timetable/VNCC.pdf",
    "Chemistry Lab": "timetable/chemistry_lab.pdf"

};


// HTML elements

const branchList = document.getElementById("branch-list");

const pdfViewer = document.getElementById("pdf-viewer");
const pdfTitle = document.getElementById("pdf-title");
const downloadButton = document.getElementById("download-pdf");
const pdfSection = document.querySelector(".pdf-section");


// Build one tab per branch

for (let branch in timetables) {

    const button = document.createElement("button");
    button.textContent = branch;

    button.addEventListener("click", function() {

        const pdfPath = encodeURI(timetables[branch]);

        pdfViewer.src = pdfPath;
        pdfTitle.textContent = branch + " Timetable";
        downloadButton.href = pdfPath;
        downloadButton.hidden = false;


          // Highlight the selected tab
        branchList.querySelectorAll("button").forEach(function(b) {
            b.classList.toggle("active", b === button);
        });

        // Jump to the PDF viewer
        pdfSection.scrollIntoView({ behavior: "smooth", block: "start" });

        });

    branchList.appendChild(button);

}
