const fs = require('fs');
const pdf = require('pdf-parse');

async function extractPDFText() {
  try {
    const dataBuffer = fs.readFileSync('FORMULAS.pdf');
    const data = await pdf(dataBuffer);
    
    console.log('=== PDF CONTENT ===');
    console.log(data.text);
    console.log('\n=== PAGE COUNT ===');
    console.log('Total pages:', data.numpages);
    
    // Save extracted text to a file for easier reference
    fs.writeFileSync('formulas-extracted.txt', data.text, 'utf8');
    console.log('\n✅ Text extracted and saved to formulas-extracted.txt');
    
  } catch (error) {
    console.error('Error extracting PDF:', error);
  }
}

extractPDFText();
