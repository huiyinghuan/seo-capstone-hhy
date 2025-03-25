# seo-capstone-hhy
This repository comprises of the development of Huan Hui Ying's capstone project on "Developing a Comprehensive Search Engine Optimisation (SEO) Tool with Actionable Insights and Competitor Analysis"

# SEO Competitor Analysis Tool

## Overview

The **SEO Competitor Analysis Tool** is a powerful platform that provides side-by-side competitor analysis on a URL level. It helps users analyze their website's SEO performance, compare it with competitors, and get actionable insights to improve SEO. The tool uses Python Django for the backend and ReactJS for the frontend, offering a seamless user experience and easy-to-understand SEO reports.

## Features

- **Competitor Analysis on URL Level:** Compare the SEO performance of any website with its competitors.
- **Technical SEO Audits:** Technical SEO audits 
- **Actionable SEO Insights:** Get actionable recommendations to improve SEO based on the technical audit.
- **Real-Time SEO Audit:** Perform on-demand SEO audits for your website and competitors.
- **User-Friendly Interface:** The platform is intuitive and requires no sign-up or login, prioritizing user convenience and privacy.
- **Content Analysis**: The platfor allows users to connect to Google Search Console, selecting their sites got content analysis
- **No Data Retention:** Data is not stored after a session ends, ensuring privacy.

## Technologies Used

- **Backend:** Python, Django
- **Frontend:** ReactJS
- **File System Storage** tmp file
- **Libraries & Tools:**
  - BeautifulSoup for web scraping
  - Fetch API for requests
  - Django Backend Routing for navigation
  - Material-UI for React components
  - Lucide React for icons
  - OpenAI API for SEO recommendations
  - Google Lighthouse API
  - Google PageSpeed Insights
  - Keyword Density
  - Flesch Reading Ease 

## Getting Started

### Prerequisites

To run this project locally, you will need:

- Python 3.10.1
- Node.js (with npm )
- Django 5.1.3
- ReactJS (with Create React App)

### Backend Setup (Django)

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/seo-competitor-analysis-tool.git](https://github.com/huiyinghuan/seo-capstone-hhy.git)
   cd seo-capstone-hhy
   ```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Start the Django development server:

```bash
python manage.py runserver
```

4. The backend API will be available at http://localhost:8000.

### Frontend Setup (React)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   
### **Usage** 🚀  

1. **Open the frontend** in your browser.  
2. **Enter a URL** to start the SEO audit.  
3. The tool will perform a technical audit, providing insights such as:
   - Title length
   -  Meta Description
   - Canonical tag presence
   - Meta Tag
   - Sitemap Status
   - Mobile Friendliness
   - Image Alt Text
   - Structured Data
   - Keyword Density
     
4. If any issues, the "Action" column will display the "Recommended Fixes" button, which will trigger suggestions for fixing the issues.
5. Apply the recommendations directly or use them as a guide to improve your site's SEO.
