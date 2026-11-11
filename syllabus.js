
const subjectButtons = document.querySelectorAll(".subject-list button");

const pdfViewer = document.getElementById("pdf-viewer");

const pdfTitle = document.getElementById("pdf-title");

const downloadButton = document.getElementById("download-pdf");

subjectButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const pdfPath = button.dataset.pdf;

        pdfViewer.src = encodeURI(pdfPath);

        pdfTitle.textContent = button.textContent;

        downloadButton.href = encodeURI(pdfPath);

        downloadButton.hidden = false;

    });

});

