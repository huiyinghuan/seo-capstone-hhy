// import React from "react";
// import SitemapViewer from "./SitemapViewer";

// function App() {
//   return (
//     <div className="App">
//       <SitemapViewer />
//     </div>
//   );
// }

// export default App;


// SitemapViewer.js
import React, { useState } from "react";

const SitemapViewer = () => {
  const [url, setUrl] = useState("");
  const [sitemapUrls, setSitemapUrls] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSitemapUrls([]);

    try {
      const response = await fetch("http://localhost:8000/api/get-sitemap/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await response.json();
      setSitemapUrls(data.sitemap_urls);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Sitemap Viewer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          required
        />
        <button type="submit">Get Sitemap</button>
      </form>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {sitemapUrls.length > 0 && (
        <div>
          <h2>Sitemap URLs</h2>
          <ul>
            {sitemapUrls.map((sitemapUrl, index) => (
              <li key={index}>
                <a href={sitemapUrl} target="_blank" rel="noopener noreferrer">
                  {sitemapUrl}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SitemapViewer;

