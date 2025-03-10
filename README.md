# CV Generator

This tool automatically generates PDF versions of your CV/resume from a Markdown file. It downloads your CV from a specified URL, creates both French and English PDF versions using OpenAI's translation capabilities, and sends them directly to your email.

## Features

- Downloads CV content from a markdown file (hosted on Gist or any accessible URL)
- Converts markdown to properly formatted HTML and PDF
- Creates an English translation using OpenAI's API
- Generates professional PDF documents with proper formatting
- Automatically emails the generated documents to a specified address
- Configurable via environment variables
- Can be triggered via GitHub Actions workflow

## Prerequisites

- Node.js (v18+)
- Yarn package manager
- OpenAI API key
- SMTP email account for sending emails

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/jujax/cv.git
   cd cv
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in the `.env` file

## Configuration

Edit the `.env` file with your specific settings:

```
OPENAI_API_KEY=your_openai_api_key
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
RECIPIENT_EMAIL=where_to_send_the_cv
MARKDOWN_FILE_URL=url_to_your_cv_markdown_file
```

## Usage

Run the generator with:

```bash
yarn start
```

This will:
1. Download your markdown CV from the specified URL
2. Convert it to HTML with proper styling
3. Generate a PDF version
4. Translate it to English using OpenAI
5. Generate an English PDF version
6. Send both PDFs to your specified email

## GitHub Actions Integration

This project includes a GitHub Actions workflow that can generate and send your CV automatically. It can be triggered manually or set up to run on a schedule.

To use it:
1. Add your environment variables as secrets in your GitHub repository settings
2. Trigger the workflow manually or configure it to run on a schedule

## Project Structure

```
cv/
├── .env.example          # Example environment variables
├── .github/workflows/    # GitHub Actions workflow configurations
├── index.js              # Main application file
├── style.css             # CSS styling for the CV
├── package.json          # Project dependencies
└── README.md             # This file
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.