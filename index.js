const fs = require("fs");
const marked = require("marked");
const puppeteer = require("puppeteer");

const inputFile = "README.md";
const outputHtmlFile = "CV.html";
const outputPdfFile = "CV.pdf";

function convertMarkdownToHTML() {
	try {
		const markdownContent = fs.readFileSync(inputFile, "utf8");

		const htmlContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CV</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            ${marked.parse(markdownContent)}
        </body>
        </html>
        `;

		fs.writeFileSync(outputHtmlFile, htmlContent, "utf8");
		console.log(
			`Conversion successful! File saved as: ${outputHtmlFile}`
		);
	} catch (error) {
		console.error("Error during conversion:", error);
	}
}

async function convertHTMLToPDF() {
	try {
		const browser = await puppeteer.launch({
			args: ["--no-sandbox", "--disable-setuid-sandbox"]
		});
		const page = await browser.newPage();

		await page.goto(`file://${__dirname}/${outputHtmlFile}`, {
			waitUntil: "load"
		});

		await page.pdf({
			path: outputPdfFile,
			format: "A4",
			margin: {
				top: "15mm",
				right: "15mm",
				bottom: "15mm",
				left: "15mm"
			},
			printBackground: true
		});

		await browser.close();
		console.log(`PDF generated: ${outputPdfFile}`);
	} catch (error) {
		console.error("Error during PDF conversion:", error);
	}
}

convertMarkdownToHTML();
convertHTMLToPDF();
