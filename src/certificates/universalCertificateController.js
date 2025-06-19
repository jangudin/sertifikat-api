const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Map lembaga ke folder dan background default
const lembagaConfig = {
    lafki: {
        background: {
            empty: 'https://sinar.kemkes.go.id/assets/sertifikat/lafkikosong.jpeg',
            lembaga: 'https://sinar.kemkes.go.id/assets/sertifikat/lafkilem.jpg',
            dirjen: 'https://sinar.kemkes.go.id/assets/sertifikat/lafkidir.jpg'
        },
        template: path.join(__dirname, 'lafki/templates/empty.html'),
        storage: path.join(process.cwd(), 'generate', 'lafki'),
        stars: {
            paripurna: 'https://sinar.kemkes.go.id/assets/capayan/paripurna.png',
            utama: 'https://sinar.kemkes.go.id/assets/capayan/utama.png',
            madya: 'https://sinar.kemkes.go.id/assets/capayan/madya.png'
        }
    },
    kars: {
        background: {
            empty: 'https://sinar.kemkes.go.id/assets/bgsertifikat/newKARS-0.jpg',
            lembaga: 'https://sinar.kemkes.go.id/assets/bgsertifikat/newKARS-1.jpg',
            dirjen: 'https://sinar.kemkes.go.id/assets/bgsertifikat/newKARS-2.jpg'
        },
        template: path.join(__dirname, 'KARS/templates/empty.html'),
        storage: path.join(process.cwd(), 'generate', 'kars'),
        stars: {
            paripurna: 'https://sinar.kemkes.go.id/assets/capayan/karsparipurna.png',
            utama: 'https://sinar.kemkes.go.id/assets/capayan/karsutama.png',
            madya: 'https://sinar.kemkes.go.id/assets/capayan/karsmadya.png'
        }
    },
    lam: {
        background: {
            empty: 'https://sinar.kemkes.go.id/assets/sertifikat/lamkprskosong.jpg',
            lembaga: 'https://sinar.kemkes.go.id/assets/sertifikat/lamkprslembaga.jpg',
            dirjen: 'https://sinar.kemkes.go.id/assets/sertifikat/lamkprsdirjen.jpg'
        },
        template: path.join(__dirname, 'LAM/templates/empty.html'),
        storage: path.join(process.cwd(), 'generate', 'lam'),
        stars: {
            paripurna: 'https://sinar.kemkes.go.id/assets/capayan/lamparipurna.png',
            utama: 'https://sinar.kemkes.go.id/assets/capayan/lamutama.png',
            madya: 'https://sinar.kemkes.go.id/assets/capayan/lammadya.png'
        }
    },
    lars: {
        background: {
            empty: 'https://sinar.kemkes.go.id/assets/sertifikat/larsKosong.png',
            lembaga: 'https://sinar.kemkes.go.id/assets/sertifikat/larsLembaga.png',
            dirjen: 'https://sinar.kemkes.go.id/assets/sertifikat/larsdirjen.png'
        },
        template: path.join(__dirname, 'LARS/templates/empty.html'),
        storage: path.join(process.cwd(), 'generate', 'lars'),
        stars: {
            paripurna: 'https://sinar.kemkes.go.id/assets/capayan/capayanParipurna.png',
            utama: 'https://sinar.kemkes.go.id/assets/capayan/capayanUtama.png',
            madya: 'https://sinar.kemkes.go.id/assets/capayan/capayanMadya.png'
        }
    },
    larsdhp: {
        background: {
            empty: 'https://sinar.kemkes.go.id/assets/sertifikat/larsdhp.jpg',
            lembaga: 'https://sinar.kemkes.go.id/assets/sertifikat/larsdhplem.jpg',
            dirjen: 'https://sinar.kemkes.go.id/assets/sertifikat/larsdhpdir.jpg'
        },
        template: path.join(__dirname, 'LARSDHP/templates/empty.html'),
        storage: path.join(process.cwd(), 'generate', 'larsdhp')
    },
    larsi: {
        background: {
            empty: 'https://sinar.kemkes.go.id/assets/sertifikat/larsi.png',
            lembaga: 'https://sinar.kemkes.go.id/assets/sertifikat/larsilembaga.jpg',
            dirjen: 'https://sinar.kemkes.go.id/assets/sertifikat/larsidir.jpg'
        },
        template: path.join(__dirname, 'LARSI/templates/empty.html'),
        storage: path.join(process.cwd(), 'generate', 'larsi'),
        stars: {
            paripurna: 'https://sinar.kemkes.go.id/assets/capayan/ParipurnaLarsi.png',
            utama: 'https://sinar.kemkes.go.id/assets/capayan/UtamaLarsi.png',
            madya: 'https://sinar.kemkes.go.id/assets/capayan/MadyaLarsi.png'
        }
    }
};

const generateUniversalCertificate = async (req, res) => {
    try {
        // console.log('GenerateUniversalCertificate');
        const requests = Array.isArray(req.body) ? req.body : [req.body];
        const results = [];
        for (const data of requests) {
            const { lembaga, name, date, registrationNumber, address, id_rekomendasi, validUntil, type, starLevel, provinsi } = data;
            if (!lembagaConfig[lembaga]) {
                return res.status(400).json({ success: false, message: 'Lembaga tidak dikenali.' });
            }
            // Ambil config sesuai lembaga
            const config = lembagaConfig[lembaga];

            // Ambil background sesuai type
            const typeLower = (type || '').toLowerCase();
            const backgroundUrl = config.background[typeLower] || config.background.empty;

            // Ambil starsUrl sesuai starLevel
            const starsUrl = config.stars && starLevel
                ? config.stars[starLevel.toLowerCase()] || ''
                : '';
            // console.log('starsUrl:', starsUrl);

            // Read template
            let template = fs.readFileSync(config.template, 'utf-8');

            // Replace background-image di template
            template = template.replace(
                /background-image:\s*url\(['"]?[^'")]+['"]?\);/,
                `background-image: url('${backgroundUrl}');`
            );

            // Replace variable di template
            template = template
                .replace(/\{\{\s*starsUrl\s*\}\}/g, starsUrl)
                .replace(/\{\{\s*starText\s*\}\}/g, data.starText || '') 
                .replace(/\{\{\s*name\s*\}\}/g, name || '')
                .replace(/\{\{\s*date\s*\}\}/g, date || '')
                .replace(/\{\{\s*registrationNumber\s*\}\}/g, registrationNumber || '')
                .replace(/\{\{\s*address\s*\}\}/g, address || '')
                .replace(/\{\{\s*validUntil\s*\}\}/g, validUntil || '')
                .replace(/\{\{\s*provinsi\s*\}\}/g, provinsi || '')
                .replace(/\{\{\s*kotaTanggal\s*\}\}/g, data.kotaTanggal || '');

            // Pastikan storage ada
            if (!fs.existsSync(config.storage)) {
                fs.mkdirSync(config.storage, { recursive: true });
            }

            // Generate PDF
            const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.setViewport({ width: 2480, height: 3508 });
            await page.setContent(template, { waitUntil: 'domcontentloaded' });

            // Tunggu semua font dan gambar selesai di-load
            await page.evaluateHandle('document.fonts.ready');
            await page.evaluate(async () => {
                const selectors = Array.from(document.images);
                await Promise.all(selectors.map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', resolve);
                    });
                }));
            });
            // Delay ekstra jika perlu (misal gambar background besar)
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 detik

            const pdf = await page.pdf({
                printBackground: true,
                width: '297mm',
                height: '420mm',
                landscape: false,
                preferCSSPageSize: true,
                margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
            });
            await browser.close();

            // Penamaan file
            let filename = '';
            if (lembaga === 'lafki') {
                if (typeLower === 'empty') {
                    filename = `${lembaga}${id_rekomendasi}.pdf`;
                } else if (typeLower === 'lembaga') {
                    filename = `${lembaga}lembaga${id_rekomendasi}.pdf`;
                } else if (typeLower === 'dirjen') {
                    filename = `${lembaga}dirjen${id_rekomendasi}.pdf`;
                } else {
                    filename = `${lembaga}${typeLower}${id_rekomendasi}.pdf`;
                }
            } else if (lembaga === 'kars') {
                if (typeLower === 'empty') {
                    filename = `${lembaga}_kosong${id_rekomendasi}.pdf`;
                } else if (typeLower === 'lembaga') {
                    filename = `${lembaga}_lembaga${id_rekomendasi}.pdf`;
                } else if (typeLower === 'dirjen') {
                    filename = `${lembaga}_dirjen${id_rekomendasi}.pdf`;
                } else {
                    filename = `${lembaga}_${typeLower}_${id_rekomendasi}.pdf`;
                }
            } else if (lembaga === 'lam') {
                if (typeLower === 'empty') {
                    filename = `${lembaga}kosong${id_rekomendasi}.pdf`;
                } else if (typeLower === 'lembaga') {
                    filename = `${lembaga}lembaga${id_rekomendasi}.pdf`;
                } else if (typeLower === 'dirjen') {
                    filename = `${lembaga}dirjen${id_rekomendasi}.pdf`;
                } else {
                    filename = `${lembaga}_${typeLower}_${id_rekomendasi}.pdf`;
                }
            }else if (lembaga === 'lars') {
                if (typeLower === 'empty') {
                    filename = `${lembaga}${id_rekomendasi}.pdf`;
                } else if (typeLower === 'lembaga') {
                    filename = `${lembaga}lembaga${id_rekomendasi}.pdf`;
                } else if (typeLower === 'dirjen') {
                    filename = `${lembaga}dirjen${id_rekomendasi}.pdf`;
                } else {
                    filename = `${lembaga}_${typeLower}_${id_rekomendasi}.pdf`;
                }
            }else if (lembaga === 'larsdhp') {
                if (typeLower === 'empty') {
                    filename = `${lembaga}${id_rekomendasi}.pdf`;
                } else if (typeLower === 'lembaga') {
                    filename = `${lembaga}lembaga${id_rekomendasi}.pdf`;
                } else if (typeLower === 'dirjen') {
                    filename = `${lembaga}dirjen${id_rekomendasi}.pdf`;
                } else {
                    filename = `${lembaga}_${typeLower}_${id_rekomendasi}.pdf`;
                }
            }else if (lembaga === 'larsi') {
                if (typeLower === 'empty') {
                    filename = `${lembaga}${id_rekomendasi}.pdf`;
                } else if (typeLower === 'lembaga') {
                    filename = `${lembaga}lembaga${id_rekomendasi}.pdf`;
                } else if (typeLower === 'dirjen') {
                    filename = `${lembaga}dirjen${id_rekomendasi}.pdf`;
                } else {
                    filename = `${lembaga}_${typeLower}_${id_rekomendasi}.pdf`;
                }
            } else {
                filename = `${lembaga}_${typeLower}_${id_rekomendasi || Date.now()}.pdf`;
            }
            const outputPath = path.join(config.storage, filename);
            fs.writeFileSync(outputPath, pdf);

            results.push({ filename, path: `generate/${data.lembaga}/${filename}` });
        }
        res.json({ success: true, message: 'Certificates generated successfully', results });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error generating certificates', error: error.message });
    }
};

module.exports = { generateUniversalCertificate };
