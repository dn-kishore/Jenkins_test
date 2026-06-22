const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('Hostel_Rules.pdf'));

doc.fontSize(20).text('DormDen Hostel - House Rules', { align: 'center' });
doc.moveDown();

doc.fontSize(12);

const rules = [
    {
        title: '1. Gate Timing',
        description: 'Main gate closes at 10:30 PM. Late entry requires prior approval from the warden. Repeated violations may result in penalty.'
    },
    {
        title: '2. Guest Policy',
        description: 'Guests are allowed only in common areas till 8 PM. Overnight guests are strictly prohibited without management approval.'
    },
    {
        title: '3. Noise Policy',
        description: 'Quiet hours are from 10 PM to 7 AM. No loud music or gatherings during this time.'
    },
    {
        title: '4. Kitchen Usage',
        description: 'Common kitchen can be used from 6 AM to 10 PM. Clean up after use. Label your food items in the refrigerator.'
    },
    {
        title: '5. Laundry',
        description: 'Laundry room available from 7 AM to 9 PM. Do not leave clothes unattended. Remove clothes within 30 minutes of cycle completion.'
    },
    {
        title: '6. Smoking & Alcohol',
        description: 'Smoking is prohibited inside the building. Designated smoking area is in the backyard. Alcohol consumption only in private rooms.'
    },
    {
        title: '7. Maintenance',
        description: 'Report any maintenance issues to the front desk immediately. Do not attempt repairs yourself.'
    },
    {
        title: '8. Security',
        description: 'Always carry your ID card. Do not share access codes. Report suspicious activity to security.'
    }
];

rules.forEach(rule => {
    doc.font('Helvetica-Bold').text(rule.title);
    doc.font('Helvetica').text(rule.description);
    doc.moveDown();
});

doc.moveDown();
doc.fontSize(10).text('Last Updated: January 2026', { align: 'right' });

doc.end();

console.log('Test PDF created: Hostel_Rules.pdf');
