const PDFDocument = require('pdfkit');
const axios = require('axios');


// Constants or configuration variables
const LOGO_IMAGE_PATH = `https://firebasestorage.googleapis.com/v0/b/ideafi-374e1.appspot.com/o/WhatsApp%20Image%202023-12-18%20at%2016.56.58_b042ea69.jpg?alt=media&token=b63bc85d-cd2c-46ea-9b99-59a1fd165479`;

const SIGNATURE_IMAGE_PATH = `https://firebasestorage.googleapis.com/v0/b/ideafi-374e1.appspot.com/o/WhatsApp%20Image%202023-12-18%20at%2018.23.56_1a3c1b91.jpg?alt=media&token=38186dc2-0520-4b44-a334-c259f29afeb3`;

const QR_IMAGE_PATH = `https://firebasestorage.googleapis.com/v0/b/ideafi-374e1.appspot.com/o/WhatsApp%20Image%202023-12-18%20at%2018.23.56_1a3c1b91.jpg?alt=media&token=38186dc2-0520-4b44-a334-c259f29afeb3`;

function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
        doc.moveDown();
    }
}

async function generateCertificate(userName, certNum, date) {
    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
    });

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

    // Margin
    const distanceMargin = 18;

    doc
        .fillAndStroke('#0e8cc3')
        .lineWidth(20)
        .lineJoin('round')
        .rect(
            distanceMargin,
            distanceMargin,
            doc.page.width - distanceMargin * 2,
            doc.page.height - distanceMargin * 2,
        )
        .stroke();




    // Header
    const maxWidth = 140;
    const maxHeight = 70;

    const logo = await fetchImage(LOGO_IMAGE_PATH);
    doc.image(logo, doc.page.width / 2 - maxWidth / 2, 60, {
        fit: [maxWidth, maxHeight],
        align: 'center',
    });

    jumpLine(doc, 5);

    doc
        .fontSize(10)
        .fill('#021c27')
        .text('Super Course for IP Rights Learning', {
            align: 'center',
        });

    jumpLine(doc, 2);

    // Content
    doc
        .fontSize(16)
        .fill('#021c27')
        .text('CERTIFICATE OF ACHIEVEMENT', {
            align: 'center',
        });

    jumpLine(doc, 1);

    doc
        .fontSize(10)
        .fill('#021c27')
        .text('Present to', {
            align: 'center',
        });

    jumpLine(doc, 2);

    doc
        .fontSize(24)
        .fill('#021c27')
        .text(userName, {
            align: 'center',
        });

    jumpLine(doc, 1);

    doc
        .fontSize(10)
        .fill('#021c27')
        .text('Successfully completed the IP Rights Learning.', {
            align: 'center',
        });

    jumpLine(doc, 7);

    doc.lineWidth(1);

    // Signatures
    const lineSize = 174;
    const signatureHeight = 390;

    doc.fillAndStroke('#021c27');
    doc.strokeOpacity(0.2);

    const startLine1 = 128;
    const endLine1 = 128 + lineSize;
    doc
        .moveTo(startLine1, signatureHeight)
        .lineTo(endLine1, signatureHeight)
        .stroke();

    // Image of Signature
    const signatureImageSize = 60; // Adjust size according to your requirement
    const signatureImagePosition = {
        x: startLine1 + (lineSize - signatureImageSize) / 2,
        y: signatureHeight - 40, // Adjust vertical position according to your requirement
    };

    const sign = await fetchImage(SIGNATURE_IMAGE_PATH);
    doc.image(sign, signatureImagePosition.x, signatureImagePosition.y, {
        fit: [signatureImageSize, signatureImageSize],
        align: 'center',
    });

    doc
        .fontSize(10)
        .fill('#021c27')
        .text('Dr Krishnamurthy', startLine1, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

    doc
        .fontSize(10)
        .fill('#021c27')
        .text('Ministry of Commerce and Industry', startLine1, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

    jumpLine(doc, 4);

    // Certificate No
    const certCont = `Certificate No: ${certNum}`;
    const certWidth = doc.widthOfString(certCont);
    const certHeight = doc.currentLineHeight();

    doc.fontSize(10)
        .fill('#021c27')
        .text(
            certCont,
            doc.page.width / 2 - certWidth / 2,
            468, // Adjusted vertical position for Certificate No
            certWidth,
            certHeight
        );

    jumpLine(doc, 4);

    // Issue Date
    const issueDate = `Issue Date: ${date}`;
    const dateWidth = doc.widthOfString(issueDate);
    doc
        .fontSize(10)
        .fill('#021c27')
        .text(
            issueDate,
            doc.page.width / 2 - dateWidth / 2,
            488, // Adjusted vertical position for Issue Date
            dateWidth,
            certHeight
        );

    // Footer
    const bottomHeight = doc.page.height - 100;

    const qr = await fetchImage(QR_IMAGE_PATH);
    doc.image(qr, doc.page.width / 2 - 30, bottomHeight, {
        fit: [60, 60],
        align: 'center',
    });

    return new Promise((resolve, reject) => {
        const chunks = [];

        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            resolve(pdfBuffer);
        });

        doc.on('error', (err) => {
            reject(err);
        });

        doc.end();
    });
}

async function fetchImage(src) {
    const image = await axios
        .get(src, {
            responseType: 'arraybuffer'
        })
    return image.data;
}

module.exports = generateCertificate;
