const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


// Constants or configuration variables
const LOGO_IMAGE_PATH = path.resolve(__dirname, './PDF/Logo.jpeg');
const SIGNATURE_IMAGE_PATH = path.resolve(__dirname, './PDF/Signature.jpeg');
const QR_IMAGE_PATH = path.resolve(__dirname, './PDF/QR.jpeg');

function generateCertificateHeader(doc) {
    const maxWidth = 140;
    const maxHeight = 70;

    doc.image(LOGO_IMAGE_PATH, doc.page.width / 2 - maxWidth / 2, 60, {
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
}

function generateCertificateContent(doc, userName) {
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
}

function generateCertificateSignatures(doc) {
    const lineSize = 174;
    const signatureHeight = 390;

    doc.fillAndStroke('#021c27');
    doc.strokeOpacity(0.2);

    const startLine1 = 128;
    const endLine1 = startLine1 + lineSize;
    doc
        .moveTo(startLine1, signatureHeight)
        .lineTo(endLine1, signatureHeight)
        .stroke();

    // Image of Signature
    const signatureImageSize = 60;
    const signatureImagePosition = {
        x: startLine1 + (lineSize - signatureImageSize) / 2,
        y: signatureHeight - 40,
    };

    doc.image(SIGNATURE_IMAGE_PATH, signatureImagePosition.x, signatureImagePosition.y, {
        fit: [signatureImageSize, signatureImageSize],
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
}

function generateCertificateFooter(doc, certNum, date) {
    const bottomHeight = doc.page.height - 100;

    doc.image(QR_IMAGE_PATH, doc.page.width / 2 - 30, bottomHeight, {
        fit: [60, 60],
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
            bottomHeight - 20,
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
            bottomHeight,
            dateWidth,
            certHeight
        );
}

function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
        doc.moveDown();
    }
}

function generateCertificate(userName, certNum, date) {
    return new Promise((resolve, reject) => {
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

        // Create a buffer to store PDF chunks
        const chunks = [];

        // Handle errors
        doc.on('error', (err) => {
            reject(err);
        });

        // Capture chunks of the PDF stream
        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        // When the document is finished, resolve with the concatenated buffer
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            resolve(pdfBuffer);
        });

    
        // Header
        const maxWidth = 140;
        const maxHeight = 70;
    
        doc.image(LOGO_IMAGE_PATH, doc.page.width / 2 - maxWidth / 2, 60, {
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
            y: signatureHeight-40, // Adjust vertical position according to your requirement
        };
    
        doc.image(SIGNATURE_IMAGE_PATH, signatureImagePosition.x, signatureImagePosition.y, {
            fit: [signatureImageSize, signatureImageSize],
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
    
        doc.image(QR_IMAGE_PATH, doc.page.width / 2 - 30, bottomHeight, {
            fit: [60, 60],
        });    

        // End the document to trigger the 'end' event
        doc.end();
    });
}

module.exports = generateCertificate;
