
const subjectButtons = document.querySelectorAll(".subject-list button");

const pdfViewer = document.getElementById("pdf-viewer");

const pdfTitle = document.getElementById("pdf-title");

const downloadButton = document.getElementById("download-pdf");

const pyqLink = document.getElementById("pyq-link");

const pyqSubjects = {
    "Applied Chemistry": "applied-chemistry",
    "Linear Algebra and Calculus": "linear-algebra-and-calculus",
    "Fundamentals of Electronics Engineering": "basic-electronics",
    "Fundamentals of Computer Science and Engineering": "introduction-to-cse"
};

subjectButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const pdfPath = button.dataset.pdf;

        pdfViewer.src = encodeURI(pdfPath);

        pdfTitle.textContent = button.textContent;

        downloadButton.href = encodeURI(pdfPath);

        downloadButton.hidden = false;

        const slug = pyqSubjects[button.textContent.trim()];
        pyqLink.hidden = !slug;
        if (slug) pyqLink.href = "pyq.html#" + slug;

        // Jump to the PDF viewer
        document.querySelector(".pdf-section").scrollIntoView({ behavior: "smooth", block: "start" });


    });

});

