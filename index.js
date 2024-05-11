const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const fs = require("fs");

const pageUrl = "https://www.naukri.com/it-jobs";

// Function to scrape Naukri website for IT jobs
(async () => {
  try {
    // Launch Puppeteer and create a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set user agent to mimic a browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    );

    // Navigate to the page URL and wait until network activity is idle
    await page.goto(pageUrl, {
      waitUntil: "networkidle2",
    });

    // Get HTML content of the page
    const htmlContent = await page.content();

    // Write HTML content to a file
    fs.writeFileSync("naukri_it_jobs.html", htmlContent);
    console.log("HTML content saved to naukri_it_jobs.html");

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("Error while scraping Naukri:", error);
  }
})();

// Function to read HTML content from file
const getDataFromFile = () => {
  try {
    return fs.readFileSync("naukri_it_jobs.html", { encoding: "utf-8" });
  } catch (error) {
    console.error("Error while reading HTML file:", error);
    return null;
  }
};

// Read HTML content from file
const pageHtmlString = getDataFromFile();

// Check if HTML content exists
if (pageHtmlString) {
  // Load HTML content into Cheerio for parsing
  const $ = cheerio.load(pageHtmlString);

  // Array to store job data
  const jobData = [];

  // Iterate over job elements and extract data
  $(".styles_jlc__main__VdwtF .srp-jobtuple-wrapper").each((index, element) => {
    const jobTitle = $(element)
      .find(".srp-jobtuple-wrapper .row1 .title")
      .attr("title")
      .trim();
    const company = $(element)
      .find(".srp-jobtuple-wrapper .row2 .comp-name")
      .attr("title")
      .trim();
    const experience = $(element)
      .find(".srp-jobtuple-wrapper .expwdth")
      .attr("title")
      .trim();
    const salary = $(element).find(".srp-jobtuple-wrapper .sal").text().trim();
    const location = $(element)
      .find(".srp-jobtuple-wrapper .locWdth")
      .attr("title")
      .trim();
    const description = $(element)
      .find(".srp-jobtuple-wrapper .job-desc")
      .text()
      .trim();
    const postDate = $(element)
      .find(".srp-jobtuple-wrapper .job-post-day")
      .text()
      .trim();
    const jobId = $(element).attr("data-job-id");

    // Extract tags
    const tags = [];
    $(element)
      .find(".tags-gt .tag-li")
      .each((index, element) => {
        tags.push($(element).text().trim());
      });

    // Create job object and push to job data array
    const job = {
      jobTitle,
      company,
      experience,
      salary,
      location,
      description,
      postDate,
      tags: tags.join(", "),
    };

    jobData.push(job);
  });

  // Convert job data to Excel worksheet
  const worksheet = xlsx.utils.json_to_sheet(jobData);

  // Set column widths
  worksheet["!cols"] = [
    { width: 15 },
    { width: 30 },
    { width: 20 },
    { width: 15 },
    { width: 20 },
    { width: 20 },
    { width: 50 },
    { width: 15 },
    { width: 50 },
  ];

  // Create a new workbook
  const workbook = xlsx.utils.book_new();

  // Add worksheet to workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");

  // Write workbook to Excel file
  xlsx.writeFile(workbook, "jobs.xlsx");
} else {
  console.error("HTML content is missing or empty.");
}
