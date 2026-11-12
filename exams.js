const documentButtons = document.querySelectorAll(".subject-list button");

const pdfViewer = document.getElementById("pdf-viewer");

const pdfTitle = document.getElementById("pdf-title");

const downloadButton = document.getElementById("download-pdf");

const pdfSection = document.querySelector(".pdf-section");

documentButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const pdfPath = button.dataset.pdf;

        pdfViewer.src = encodeURI(pdfPath);

        pdfTitle.textContent = button.textContent.trim();

        downloadButton.href = encodeURI(pdfPath);

        downloadButton.hidden = false;

        // Jump to the PDF viewer
        pdfSection.scrollIntoView({ behavior: "smooth", block: "start" });

    });

});
