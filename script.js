document.addEventListener('DOMContentLoaded', () => {
    // --- Referensi Elemen DOM ---
    const osSelect = document.getElementById('osSelect');
    const deviceSelect = document.getElementById('deviceSelect');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const uaOutput = document.getElementById('uaOutput');
    const copyFeedback = document.getElementById('copyFeedback');
    
    // --- MEMORI UNTUK MENYIMPAN HISTORY ---
    const generatedHistory = new Set();

    // --- DATABASE PERANGKAT DENGAN GENERATOR DINAMIS ---
    const uaDatabase = {
        "Android": {
            template: "Mozilla/5.0 (Linux; Android {android_version}; {model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{chrome_version} Mobile Safari/537.36",
            devices: [
                { name: "Samsung (Seri S)", generator: "samsungS" },
                { name: "Samsung (Seri A)", generator: "samsungA" },
                { name: "Samsung (Seri Z Fold/Flip)", generator: "samsungF" },
                { name: "Google Pixel", generator: "pixel" },
                { name: "Xiaomi/Redmi/Poco", generator: "xiaomi" },
                { name: "OnePlus/Oppo/Realme", generator: "oppo" },
                { name: "Sony Xperia", generator: "sonyXperia" },
                { name: "ASUS ROG/Zenfone", generator: "asusROG" },
                { name: "Motorola Edge/Razr", generator: "motorola" }
            ]
        },
        "iOS (iPhone)": {
            template: "Mozilla/5.0 (iPhone; CPU iPhone OS {ios_version} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/{safari_version} Mobile/{ios_build} Safari/604.1",
            devices: [
                { name: "iPhone (High-End)", generator: "iphoneHigh" },
                { name: "iPhone (Standard)", generator: "iphoneMid" },
                { name: "iPhone (SE)", generator: "iphoneSE" }
            ]
        },
        "iPadOS (iPad)": {
            template: "Mozilla/5.0 (iPad; CPU OS {ios_version} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/{safari_version} Mobile/{ios_build} Safari/604.1",
            devices: [
                 { name: "iPad Pro", generator: "ipadPro" },
                 { name: "iPad Air", generator: "ipadAir" },
                 { name: "iPad (Standard)", generator: "ipadStandard" }
            ]
        }
    };

    // --- KUMPULAN FUNGSI GENERATOR ---
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomLetter = () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[getRandomInt(0, 25)];

    const dynamicGenerators = {
        // ... (Semua generator dinamis tetap sama)
        samsungS: () => `SM-S9${getRandomInt(10, 99)}${getRandomLetter()}`,
        samsungA: () => `SM-A${getRandomInt(10, 99)}6${getRandomLetter()}`,
        samsungF: () => `SM-F${getRandomInt(7, 9)}3${getRandomInt(1, 9)}${getRandomLetter()}`,
        pixel: () => `Pixel ${getRandomInt(7, 9)}${['', ' Pro', 'a'][getRandomInt(0,2)]}`,
        xiaomi: () => `${getRandomInt(21, 23)}${getRandomInt(10,12)}${getRandomLetter()}${getRandomLetter()}${getRandomLetter()}${getRandomInt(1,9)}G`,
        oppo: () => `CPH${getRandomInt(2000, 2600)}`,
        sonyXperia: () => `XQ-${getRandomLetter()}${getRandomLetter()}${getRandomInt(10, 99)}`,
        asusROG: () => `AI${getRandomInt(22, 23)}0${getRandomInt(1, 5)}-${getRandomLetter()}`,
        motorola: () => `XT${getRandomInt(2100, 2400)}-${getRandomInt(1, 5)}`,
        iphoneHigh: () => `iPhone${getRandomInt(15,16)},${getRandomInt(1,3)}`,
        iphoneMid: () => `iPhone${getRandomInt(14,15)},${getRandomInt(4,8)}`,
        iphoneSE: () => `iPhone14,6`,
        ipadPro: () => `iPad${getRandomInt(13, 14)},${getRandomInt(8, 11)}`,
        ipadAir: () => `iPad13,${getRandomInt(1, 2)}`,
        ipadStandard: () => `iPad${getRandomInt(12, 13)},${getRandomInt(1, 7)}`,
        chromeVersion: () => `${getRandomInt(115, 120)}.0.${getRandomInt(5000, 6100)}.${getRandomInt(1, 199)}`,
        safariVersion: () => `${getRandomInt(15, 17)}.${getRandomInt(1, 6)}`,
        iosBuild: () => `${getRandomInt(15, 21)}${getRandomLetter()}${getRandomInt(100, 500)}`,
        androidVersion: () => `${getRandomInt(12, 14)}`,
        iosVersion: () => `${getRandomInt(15, 17)}_${getRandomInt(0, 6)}_${getRandomInt(0, 2)}`
    };

    // --- FUNGSI UTAMA ---
    const populateDeviceSelect = (os) => {
        deviceSelect.innerHTML = '';
        uaDatabase[os].devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.name;
            option.textContent = device.name;
            deviceSelect.appendChild(option);
        });
    };

    const generateUserAgent = () => {
        const selectedOS = osSelect.value;
        const selectedDeviceName = deviceSelect.value;
        const deviceData = uaDatabase[selectedOS].devices.find(d => d.name === selectedDeviceName);
        if (!deviceData) return;

        let finalUA;
        let attempts = 0;

        do {
            const template = uaDatabase[selectedOS].template;
            const modelGenerator = dynamicGenerators[deviceData.generator];
            const model = modelGenerator ? modelGenerator() : 'Unknown';

            if (selectedOS === "Android") {
                finalUA = template
                    .replace("{android_version}", dynamicGenerators.androidVersion())
                    .replace("{model}", model)
                    .replace("{chrome_version}", dynamicGenerators.chromeVersion());
            } else if (selectedOS === "iOS (iPhone)" || selectedOS === "iPadOS (iPad)") {
                finalUA = template
                    .replace(/{ios_version}/g, dynamicGenerators.iosVersion())
                    .replace(/{safari_version}/g, dynamicGenerators.safariVersion())
                    .replace(/{ios_build}/g, dynamicGenerators.iosBuild());
            }
            attempts++;
            if (attempts > 50) {
                finalUA = "Gagal menghasilkan UA unik, silakan coba lagi.";
                break;
            }
        } while (generatedHistory.has(finalUA));

        generatedHistory.add(finalUA);
        
        uaOutput.textContent = finalUA;
        uaOutput.classList.add('generated');
        console.log(`Total UA Unik Dihasilkan: ${generatedHistory.size}`);
    };

    const copyToClipboard = () => {
        if (!uaOutput.classList.contains('generated')) return;
        navigator.clipboard.writeText(uaOutput.textContent).then(() => {
            copyFeedback.classList.add('show');
            setTimeout(() => copyFeedback.classList.remove('show'), 2000);
        });
    };
    
    // --- INISIALISASI & EVENT LISTENERS ---
    const osList = Object.keys(uaDatabase);
    osList.forEach(os => {
        const option = document.createElement('option');
        option.value = os;
        option.textContent = os;
        osSelect.appendChild(option);
    });
    populateDeviceSelect(osList[0]);

    osSelect.addEventListener('change', (e) => populateDeviceSelect(e.target.value));
    generateBtn.addEventListener('click', generateUserAgent);
    copyBtn.addEventListener('click', copyToClipboard);

    // --- MODAL LOGIC ---
    const tutorialModal = document.getElementById('tutorialModal');
    const openTutorialBtn = document.getElementById('openTutorialBtn');
    const closeBtn = document.querySelector('.modal .close-btn');
    const tutorialVideo = document.getElementById('tutorialVideo');
    const videoSrc = tutorialVideo.src;
    tutorialVideo.src = ""; // Kosongkan src saat awal untuk performa

    const openModal = () => {
        tutorialVideo.src = videoSrc;
        tutorialModal.classList.add('show');
    };

    const closeModal = () => {
        tutorialModal.classList.remove('show');
        tutorialVideo.src = ""; // Hentikan video dengan mengosongkan src
    };

    openTutorialBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == tutorialModal) {
            closeModal();
        }
    });
});
