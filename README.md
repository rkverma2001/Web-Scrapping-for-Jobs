# Naukri IT Jobs Scraper

This script scrapes IT job listings from Naukri.com and saves them to an Excel file.

## Requirements

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the script file (`naukri_scraper.js`).
2. Install dependencies by running `npm install` in the project directory.

## Usage

1. Run the script using Node.js: npm run dev

2. The script will launch a headless browser using Puppeteer, navigate to Naukri's IT jobs page, scrape the job listings, and save them to an HTML file (`naukri_it_jobs.html`).
3. It will then parse the HTML file using Cheerio, extract relevant job information, and save it to an Excel file (`jobs.xlsx`).
4. You can find the scraped job data in the Excel file.

## Configuration

- You can modify the `pageUrl` variable in the script to scrape job listings from a different Naukri page.
- Adjust column widths in the Excel file by updating the `worksheet["!cols"]` array in the script.

## Notes

- Ensure that Puppeteer is configured properly to work with your environment.
- This script is provided as-is and may require updates to work with future changes to the Naukri website layout.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
