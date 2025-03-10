require("dotenv").config();
const marked = require("marked");
const puppeteer = require("puppeteer");
const { OpenAI } = require("openai");
const axios = require("axios");
const nodemailer = require("nodemailer");

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

async function downloadMarkdownFile(url) {
	try {
		const { data } = await axios.get(url);
		console.log("File downloaded successfully!");
		return data;
	} catch (error) {
		console.error("Error during download:", error);
		throw error;
	}
}

function convertMarkdownToHTML(inputMarkdownFile) {
	try {
		const outputHtmlFile = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CV</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            ${marked.parse(inputMarkdownFile)}
        </body>
        </html>
        `;
		console.log("Conversion successful!");
		return outputHtmlFile;
	} catch (error) {
		console.error("Error during conversion:", error);
		throw error;
	}
}

async function convertHTMLToPDF(inputHtmlFile) {
	try {
		const browser = await puppeteer.launch({
			args: ["--no-sandbox", "--disable-setuid-sandbox"]
		});
		const page = await browser.newPage();
		await page.setContent(inputHtmlFile, {
			waitUntil: "domcontentloaded"
		});

		const pdfFile = await page.pdf({
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
		console.log("PDF generated !");
		return pdfFile;
	} catch (error) {
		console.error("Error during PDF conversion:", error);
		throw error;
	}
}

async function translateText(inputFile, targetLanguage) {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: `You are a professional translator. Translate the text to ${targetLanguage}, 
					while keeping the markdown syntax intact.`
				},
				{
					role: "user",
					content: inputFile
				}
			],
			temperature: 0.3 // Low value for more accurate translations
		});
		console.log("Translation successful!");
		return response.choices[0].message.content.trim();
	} catch (error) {
		console.error("Erreur de traduction:", error);
		throw error;
	}
}

async function sendPdfByMail(...pdfFiles) {
	// Send the PDF files by email with the nodemailer library and the SMTP protocol
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD
		}
	});

	try {
		const info = await transporter.sendMail({
			from: process.env.SMTP_USER,
			to: process.env.RECIPIENT_EMAIL,
			subject: "CV Documents",
			text: "Please find attached CV documents.",
			attachments: pdfFiles.map((pdf, index) => ({
				filename: `cv-${index + 1}.pdf`,
				content: pdf
			}))
		});
		console.log("Emails sent successfully:", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

async function main() {
	const markdownFileFrench = await downloadMarkdownFile(
		process.env.MARKDOWN_FILE_URL
	);
	const htmlFileFrench = convertMarkdownToHTML(markdownFileFrench);
	const pdfFileFrench = await convertHTMLToPDF(htmlFileFrench);

	const markdownFileTranslated = await translateText(
		markdownFileFrench,
		"english"
	);
	const htmlFileTranslated = convertMarkdownToHTML(markdownFileTranslated);
	const pdfFileTranslated = await convertHTMLToPDF(htmlFileTranslated);

	sendPdfByMail(pdfFileFrench, pdfFileTranslated);
}

main();
