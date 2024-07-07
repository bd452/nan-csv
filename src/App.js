import React, { useState } from 'react';
import Papa from 'papaparse';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import './App.css';

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function App() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const generateDocument = () => {
    const filteredData = data.filter(person => {
      const birthMonth = new Date(person.Birthday).getMonth() + 1;
      return birthMonth === parseInt(month, 10);
    }).sort((a, b) => new Date(a.Birthdate) - new Date(b.Birthdate));

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: filteredData.map(person =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `${person["First Name"]} ${person["Last Name"]} ${person.Birthday}`,
                  font: "Calibri",
                  size: 36
                }
                ),
              ],
            })
          ),
        },
      ],
    });

    const monthNumber = parseInt(month, 10);
    const monthName = months[monthNumber - 1];

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${monthName} Birthdays.docx`);
    });
  };

  return (
    <div className="container">
      <h1>Birthday Filter</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <input type="number" placeholder="Enter month (1-12)" value={month} onChange={handleMonthChange} />
      <button onClick={generateDocument}>Generate Document</button>
    </div>
  );
}

export default App;