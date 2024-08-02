// layout.js
export const metadata = {
  title: 'Shopping List',
  description: 'A simple and efficient grocery shopping list application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        />
        <style>{`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
          }
          header, footer {
            background-color: #333;
            color: #fff;
            text-align: center;
            padding: 1rem 0;
          }
          header h1 {
            font-size: 2rem;
            font-weight: bold;
          }
          footer p {
            font-size: 0.875rem;
          }
          .container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          main {
            flex: 1;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }
          .table-container {
            margin-top: 2rem;
          }
          .table th, .table td {
            font-size: 1rem;
            font-weight: normal;
          }
          .table th {
            font-weight: bold;
          }
          .table input {
            font-size: 1rem;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <header>
            <h1>Shopping List</h1>
          </header>
          <main>{children}</main>
          <footer>
            <p>&copy; 2024 Shopping List. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
