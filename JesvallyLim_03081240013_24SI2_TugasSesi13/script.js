document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // --- Navigasi Halaman (INI UNTUK SIDEBAR ANDA) ---
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            // Hapus kelas aktif dari semua link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active-link', 'bg-blue-600', 'text-white');
                navLink.classList.add('hover:bg-gray-800', 'hover:text-white');
            });

            // Tambah kelas aktif ke link yang diklik
            this.classList.add('active-link', 'bg-blue-600', 'text-white');
            this.classList.remove('hover:bg-gray-800', 'hover:text-white');

            // Sembunyikan semua section
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Tampilkan section yang ditarget
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error('Target section not found:', targetId);
            }

            // Tutup sidebar di mobile setelah klik
            if (window.innerWidth < 768) {
                sidebar.classList.add('-translate-x-full');
            }
        });
    });

    // --- Toggle Sidebar Mobile ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.remove('-translate-x-full');
        });
    }

    if (closeMenu && sidebar) {
        closeMenu.addEventListener('click', function () {
            sidebar.classList.add('-translate-x-full');
        });
    }

    // --- Filter Kamar ---
    const filterButtonsKamar = document.querySelectorAll('.filter-btn-kamar');
    const roomCards = document.querySelectorAll('.room-card');

    filterButtonsKamar.forEach(button => {
        button.addEventListener('click', function () {
            const status = this.getAttribute('data-status');

            // Update style tombol
            filterButtonsKamar.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300', 'hover:bg-gray-50');
            });
            this.classList.add('bg-blue-600', 'text-white');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300', 'hover:bg-gray-50');

            // Filter cards
            roomCards.forEach(card => {
                if (status === 'semua' || card.getAttribute('data-status') === status) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Logika Modal Pemesanan ---
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal) {
        const modalPanel = bookingModal.querySelector('[data-modal-panel]');
        const openModalBtn = document.getElementById('open-modal-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const closeModalBtn2 = document.querySelector('.close-modal-btn-2'); // Tombol "Batal"
        const bookingForm = document.getElementById('booking-form');

        const openModal = () => {
            bookingModal.classList.remove('hidden');
            setTimeout(() => {
                if (modalPanel) {
                    modalPanel.classList.remove('opacity-0', '-translate-y-10');
                    modalPanel.classList.add('opacity-100', 'translate-y-0');
                }
            }, 10);
        };

        const closeModal = () => {
            if (modalPanel) {
                modalPanel.classList.add('opacity-0', '-translate-y-10');
                modalPanel.classList.remove('opacity-100', 'translate-y-0');
            }
            setTimeout(() => {
                bookingModal.classList.add('hidden');
                if (bookingForm) {
                    bookingForm.reset();
                }
                resetGeminiUI();
            }, 300);
        };

        if (openModalBtn) {
            openModalBtn.addEventListener('click', openModal);
        }
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        if (closeModalBtn2) {
            closeModalBtn2.addEventListener('click', closeModal);
        }
    }

    // --- Logika Modal Sukses Kontak (INI UNTUK POP-UP WHATSAPP) ---
    const contactForm = document.getElementById('contact-form');
    const contactSuccessModal = document.getElementById('contact-success-modal');
    
    if (contactForm && contactSuccessModal) {
        const contactModalPanel = contactSuccessModal.querySelector('[data-modal-panel]');
        const closeContactModalBtn = document.getElementById('close-contact-modal');

        const openContactModal = () => {
            contactSuccessModal.classList.remove('hidden');
            setTimeout(() => {
                if(contactModalPanel) {
                    contactModalPanel.classList.remove('opacity-0', '-translate-y-10');
                    contactModalPanel.classList.add('opacity-100', 'translate-y-0');
                }
            }, 10);
        };

        const closeContactModal = () => {
            if(contactModalPanel) {
                contactModalPanel.classList.add('opacity-0', '-translate-y-10');
                contactModalPanel.classList.remove('opacity-100', 'translate-y-0');
            }
            setTimeout(() => {
                contactSuccessModal.classList.add('hidden');
            }, 300);
        };

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            openContactModal();
            contactForm.reset();
        });

        if (closeContactModalBtn) {
            closeContactModalBtn.addEventListener('click', closeContactModal);
        }
    }
    // (FIXED) KESALAHAN SINTAKS DIHAPUS DARI SINI

    // --- Logika Gemini API ---
    const generateEmailBtn = document.getElementById('generate-email-btn');
    const geminiLoader = document.getElementById('gemini-loader');
    const emailDraftContainer = document.getElementById('email-draft-container');
    const emailDraftTextarea = document.getElementById('email-draft');
    const copyDraftBtn = document.getElementById('copy-draft-btn');
    const copySuccessMsg = document.getElementById('copy-success-msg');

    function resetGeminiUI() {
        if (geminiLoader) {
            geminiLoader.classList.add('hidden');
        }
        if (emailDraftContainer) {
            emailDraftContainer.classList.add('hidden');
        }
        if (emailDraftTextarea) {
            emailDraftTextarea.value = '';
        }
        if (generateEmailBtn) {
            generateEmailBtn.disabled = false;
            generateEmailBtn.innerHTML = '✨ Buat Draft Email';
        }
        if (copySuccessMsg) {
            copySuccessMsg.classList.add('hidden');
        }
    }

    if (generateEmailBtn) {
        generateEmailBtn.addEventListener('click', async function () {
            const guestName = document.getElementById('guestName').value;
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            const roomType = document.getElementById('roomType').value;
            const guestEmail = document.getElementById('guestEmail').value;

            if (!guestName || !checkIn || !checkOut || !guestEmail) {
                console.warn("Harap isi semua detail pemesanan terlebih dahulu.");
                let errorMsg = document.getElementById('gemini-error');
                if (!errorMsg) {
                    errorMsg = document.createElement('span');
                    errorMsg.id = 'gemini-error';
                    errorMsg.className = 'text-xs text-red-600 block text-right mt-1';
                    if (generateEmailBtn.parentElement) {
                        generateEmailBtn.parentElement.appendChild(errorMsg);
                    }
                }
                errorMsg.textContent = 'Harap isi Nama, Tgl Check-in/out, & Email.';
                setTimeout(() => errorMsg.textContent = '', 3000);
                return;
            }

            if (geminiLoader) geminiLoader.classList.remove('hidden');
            if (emailDraftContainer) emailDraftContainer.classList.add('hidden');
            generateEmailBtn.disabled = true;
            generateEmailBtn.innerHTML = 'Membuat draf...';

            const userQuery = `
                Tulis email konfirmasi pemesanan hotel yang ramah dan profesional untuk:
                - Nama Tamu: ${guestName}
                - Email Tamu: ${guestEmail}
                - Tanggal Check-in: ${checkIn}
                - Tanggal Check-out: ${checkOut}
                - Tipe Kamar: ${roomType}
                - Nama Hotel: Zenith Hotel
                Mulai email dengan "Yth. ${guestName}," dan akhiri dengan "Hormat kami, Tim Zenith Hotel".
                Pastikan email dalam Bahasa Indonesia.
                Hanya berikan isi emailnya saja, tanpa subjek.
            `;
            
            const systemPrompt = "Anda adalah asisten virtual untuk Zenith Hotel, tugas Anda adalah membuat draf email konfirmasi pemesanan dalam Bahasa Indonesia yang ringkas, ramah, dan profesional berdasarkan detail yang diberikan.";
            
            try {
                const generatedText = await callGeminiAPI(userQuery, systemPrompt);
                if (emailDraftTextarea) emailDraftTextarea.value = generatedText.trim();
                if (emailDraftContainer) emailDraftContainer.classList.remove('hidden');
            } catch (error) {
                console.error('Error calling Gemini API:', error);
                if (emailDraftTextarea) emailDraftTextarea.value = "Maaf, terjadi kesalahan saat membuat draf. Silakan coba lagi.";
                if (emailDraftContainer) emailDraftContainer.classList.remove('hidden');
            } finally {
                if (geminiLoader) geminiLoader.classList.add('hidden');
                generateEmailBtn.disabled = false;
                generateEmailBtn.innerHTML = '✨ Buat Ulang Draf';
            }
        });
    }

    async function callGeminiAPI(userQuery, systemPrompt) {
        console.log("Memanggil Gemini API dengan prompt:", userQuery);
        const apiKey = ""; // Biarkan kosong
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        let response;
        let retries = 3;
        let delay = 1000; 

        for (let i = 0; i < retries; i++) {
            try {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const result = await response.json();
                    const candidate = result.candidates?.[0];
                    if (candidate && candidate.content?.parts?.[0]?.text) {
                        return candidate.content.parts[0].text;
                    } else {
                        throw new Error('Struktur respons tidak valid dari API.');
                    }
                } else if (response.status === 429 || response.status >= 500) {
                    console.warn(`Attempt ${i + 1} failed with status ${response.status}. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; 
                } else {
                    throw new Error(`Error API: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error during fetch attempt ${i + 1}:`, error);
                if (i === retries - 1) { 
                    throw error; 
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
        
        throw new Error('Gagal mendapatkan respons setelah beberapa kali percobaan.');
    }

    if (copyDraftBtn) {
        copyDraftBtn.addEventListener('click', function () {
            const textToCopy = emailDraftTextarea.value;
            const copyHelper = document.getElementById('copy-helper');
            
            if (!copyHelper) {
                console.error('Elemen copy-helper tidak ditemukan!');
                return;
            }

            copyHelper.value = textToCopy;
            copyHelper.select();
            
            try {
                document.execCommand('copy');
                if (copySuccessMsg) {
                    copySuccessMsg.classList.remove('hidden');
                    setTimeout(() => {
                        copySuccessMsg.classList.add('hidden');
                    }, 2000); 
                }
            } catch (err) {
                console.error('Gagal menyalin teks: ', err);
                if (copySuccessMsg) {
                    copySuccessMsg.textContent = 'Gagal menyalin!';
                    copySuccessMsg.classList.remove('hidden', 'text-green-600');
                    copySuccessMsg.classList.add('text-red-600');
                    setTimeout(() => {
                        copySuccessMsg.classList.add('hidden');
                        copySuccessMsg.textContent = 'Tersalin!';
                        copySuccessMsg.classList.remove('text-red-600');
                        copySuccessMsg.classList.add('text-green-600');
                    }, 2000);
                }
            }
            window.getSelection().removeAllRanges();
        });
    }

    // --- (BARU) Logika Search Bar Tamu ---
    const guestSearchInput = document.getElementById('guest-search-input');
    const guestTable = document.getElementById('guest-table');
    
    if (guestSearchInput && guestTable) {
        const guestRows = guestTable.querySelectorAll('tbody .guest-row');
        guestSearchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            
            guestRows.forEach(row => {
                const guestNameCell = row.querySelector('.text-sm.font-medium.text-gray-900');
                const guestEmailCell = row.querySelector('.text-sm.text-gray-500');
                let guestName = guestNameCell ? guestNameCell.textContent.toLowerCase() : '';
                let guestEmail = guestEmailCell ? guestEmailCell.textContent.toLowerCase() : '';
                
                if (guestName.includes(searchTerm) || guestEmail.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // --- (BARU) Logika Tab Pengaturan ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // --- (BARU) Logika Chart.js untuk Laporan ---
    const revenueChartCanvas = document.getElementById('revenueChart');
    const roomTypeChartCanvas = document.getElementById('roomTypeChart');

    if (revenueChartCanvas) {
        new Chart(revenueChartCanvas, {
            type: 'line',
            data: {
                labels: ['Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November'],
                datasets: [{
                    label: 'Pendapatan (Juta Rp)',
                    data: [120, 150, 130, 180, 210, 240],
                    fill: true,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    if (roomTypeChartCanvas) {
        new Chart(roomTypeChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Deluxe King', 'Standard Twin', 'Suite', 'Standard Queen'],
                datasets: [{
                    label: 'Pemesanan',
                    data: [150, 120, 80, 95],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)', // blue
                        'rgba(34, 197, 94, 0.8)', // green
                        'rgba(239, 68, 68, 0.8)', // red
                        'rgba(245, 158, 11, 0.8)' // amber
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }

}); // <- Ini adalah penutup yang benar untuk DOMContentLoaded