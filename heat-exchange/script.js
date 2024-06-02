let canvas = document.getElementById("myCanvas");
let konten = canvas.getContext("2d");

// Gambar background
let background = new Image();
background.src = './assets/bg1.jpg'; // Ganti dengan path gambar Anda

background.onload = function() {
    // konten.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawContent(); // Gambar konten setelah background
};

function drawContent() {
    var gelasPiala1 = {
        tipe: "beaker",
        x: 0.5 * canvas.width - 40,
        y: 0.8 * canvas.height - 150,
        l: 80,
        t: 100,
        rad: 8,
        vol: 80,
        warnaGaris: "#ffffff",
        warnaIsi: "#2495ff"
    };

    function hexToRGBA(hex, alp) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alp + ')';
        }
        throw new Error('Kode hex warna salah, cek ulang!!');
    }

    function garis(x1, y1, x2, y2, tebal, warna) {
        konten.beginPath();
        konten.moveTo(x1, y1);
        konten.lineTo(x2, y2);
        konten.lineWidth = tebal;
        konten.strokeStyle = warna;
        konten.stroke();
    }

    function tabung(data) {
        if (data.tipe == "beaker") {
            // isi
            var dy = data.y + data.t;
            var h = data.vol / 100 * (data.t);
            if (data.vol > 0) {
                konten.beginPath();
                konten.fillStyle = hexToRGBA(data.warnaIsi, 0.7);
                konten.moveTo(data.x + 4, dy - h);
                konten.lineTo(data.x + data.l - 4, dy - h);
                konten.lineTo(data.x + data.l - 4, data.y + data.t - data.rad);
                konten.arc(data.x + data.l - data.rad, data.y + data.t - data.rad, data.rad - 4, 0, 0.5 * Math.PI);
                konten.lineTo(data.x + data.rad + 4, dy - 4);
                konten.arc(data.x + data.rad, data.y + data.t - data.rad, data.rad - 4, 0.5 * Math.PI, Math.PI);
                konten.lineTo(data.x + 4, dy - h);
                konten.fill();
            }
            // garis gelas
            konten.beginPath();
            konten.lineWidth = 2;
            konten.strokeStyle = hexToRGBA(data.warnaGaris, 0.8);
            konten.arc(data.x - data.rad, data.y + data.rad, data.rad, 1.5 * Math.PI, 0);
            konten.moveTo(data.x - data.rad, data.y);
            konten.lineTo(data.x + data.l + data.rad, data.y);
            konten.stroke();
            konten.beginPath();
            konten.arc(data.x + data.l + data.rad, data.y + data.rad, data.rad, Math.PI, Math.PI * 1.5);
            konten.moveTo(data.x + data.l, data.y + data.rad);
            konten.lineTo(data.x + data.l, data.y + data.t - data.rad);
            konten.arc(data.x + data.l - data.rad, data.y + data.t - data.rad, data.rad, 0, 0.5 * Math.PI);
            konten.lineTo(data.x + data.rad, data.y + data.t);
            konten.arc(data.x + data.rad, data.y + data.t - data.rad, data.rad, 0.5 * Math.PI, Math.PI);
            konten.lineTo(data.x, data.y + data.rad);
            konten.stroke();

            // skala
            var skala = (data.t) / 10;
            var skalaW = data.l / 6;
            if (skalaW < 4) skalaW = 4;
            for (var i = 0; i <= 9; i++) {
                if (i > 0) garis(data.x + 4, data.y + data.t - i * skala, data.x + 4 + skalaW, data.y + data.t - i * skala, 1, data.warnaGaris);
            }
        }
    }

    function drawRoundedRect(konten, x, y, width, height, radius) {
        konten.beginPath();
        konten.moveTo(x + radius, y);
        konten.lineTo(x + width - radius, y);
        konten.quadraticCurveTo(x + width, y, x + width, y + radius);
        konten.lineTo(x + width, y + height - radius);
        konten.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        konten.lineTo(x + radius, y + height);
        konten.quadraticCurveTo(x, y + height, x, y + height - radius);
        konten.lineTo(x, y + radius);
        konten.quadraticCurveTo(x, y, x + radius, y);
        konten.closePath();
    }

    function heater(x, y, l, t, tebal, warna, radius) {
        drawRoundedRect(konten, x, y, l, t, radius);
        konten.lineWidth = tebal;
        konten.strokeStyle = warna;
        konten.fillStyle = 'white';
        konten.stroke();
        konten.fill();

        // tombol
        konten.beginPath();
        konten.strokeStyle = 'black';
        konten.lineWidth = 4;
        konten.fillStyle = 'red';
        konten.arc(0.5 * canvas.width + 75, 0.8 * canvas.height - 24, 7, 0, 2 * Math.PI);
        konten.stroke();
        konten.fill();

        //indikator suhu
        kotak(0.5 * canvas.width - 30, 0.8 * canvas.height - 34, 30, 20, 2, 'black', 'white');
        teks("20", 0.5 * canvas.width - 15, 0.8 * canvas.height - 20, "11pt Calibri", "black", "center");
        
        //tombol suhu
        segitiga(0.5 * canvas.width + 10, 0.8 * canvas.height - 31, 15, 15, 2, 90, 'black', 'black');
        segitiga(0.5 * canvas.width -55, 0.8 * canvas.height - 31, 15, 15, 2, 270, 'black', 'black');
    }

    function termometer(data) {
        var x = data.x, y = data.y, l = data.l, t = data.t, min = data.min, max = data.max, val = data.val, off = data.offset;
        var l2 = l / 2;
        var konten = data.context;
    
        // Menggambar bagian atas termometer
        konten.beginPath();
        konten.lineWidth = 2;
        konten.strokeStyle = data.warnaGaris;
        konten.arc(x + l2, y + l2, l2, Math.PI, Math.PI * 2);
        konten.stroke();
    
        // Menggambar bagian bawah termometer
        konten.beginPath();
        konten.arc(x + l2, y + 1.2 * l2 + t + off * 2, 1.5 * l2, 1.7 * Math.PI, Math.PI * 3.3);
        konten.stroke();
    
        // Menggambar garis vertikal
        garis(x, y + l2, x, y + t + off * 2, 2, data.warnaGaris);
        garis(x + l, y + l2, x + l, y + t + off * 2, 2, data.warnaGaris);
    
        // Mengisi bagian bawah termometer
        lingkaran(x + l2, y + 1.2 * l2 + t + off * 2, 1.5 * l2 - 3, 1, data.warnaIsi, data.warnaIsi);
        data.ujungX = x + l2;
        data.ujungY = y + 1.2 * l2 + t + off * 2;
    
        if (val < min) val = min;
        if (val > max) val = max;
        var fillH = ((val - min) / (max - min)) * t;
    
        // Mengisi bagian termometer sesuai nilai suhu
        kotak(x + 3, y + t + off * 2, l - 6, -fillH, 1, data.warnaIsi, data.warnaIsi);
        kotak(x + 3, y + t + off * 2, l - 6, l, 1, data.warnaIsi, data.warnaIsi);
    
        // Menambahkan skala
        var skala = t / 10;
        for (var i = 0; i <= 10; i++) {
            garis(x, y + t + off * 2 - i * skala, x + l / 3, y + t + off * 2 - i * skala, 1, data.warnaGaris);
        }
    
        // Menambahkan label teks untuk skala
        skala = t / (data.label.length - 1);
        for (i = 0; i < data.label.length; i++) {
            teks(data.label[i], x - 5, y + t + off * 2 - i * skala + 5, "10pt Calibri", data.warnaGaris, "right");
        }
    
        // Menampilkan nilai suhu saat ini
        if (data.showVal != null && data.showVal) {
            if (data.val > max) data.val = max;
            teks(data.val.toFixed(data.desimal) + "⁰", x + l / 2, y - 10, "12pt Calibri", data.warnaGaris, "center");
        }
    }
    
    // Fungsi pendukung
    function garis(x1, y1, x2, y2, tebal, warna) {
        konten.beginPath();
        konten.moveTo(x1, y1);
        konten.lineTo(x2, y2);
        konten.lineWidth = tebal;
        konten.strokeStyle = warna;
        konten.stroke();
    }
    
    function lingkaran(x, y, rad, tebal, warnaGaris, warnaIsi) {
        konten.beginPath();
        konten.arc(x, y, rad, 0, 2 * Math.PI);
        konten.lineWidth = tebal;
        konten.strokeStyle = warnaGaris;
        konten.fillStyle = warnaIsi;
        konten.fill();
        konten.stroke();
    }
    
    function kotak(x, y, lebar, tinggi, tebal, warnaGaris, warnaIsi) {
        konten.beginPath();
        konten.rect(x, y, lebar, tinggi);
        konten.lineWidth = tebal;
        konten.strokeStyle = warnaGaris;
        konten.fillStyle = warnaIsi;
        konten.fill();
        konten.stroke();
    }
    
    function teks(teks, x, y, font, warna, align) {
        konten.font = font;
        konten.fillStyle = warna;
        konten.textAlign = align;
        konten.fillText(teks, x, y);
    }

    let termometerCelup = {
        x: 0.5 * canvas.width -5,
        y: 0.8 * canvas.height - 215,
        l: 10,
        t: 75,
        min: 0,
        max: 100,
        val: 20,
        offset: 10,
        warnaGaris: "#ffffff",
        warnaIsi: "red",
        label: ["0", "50", "100"],
        showVal: true,
        desimal: 0,
        context: konten // pastikan ini mengarah ke konteks canvas yang benar
    };
    
    let termometerDetail = {
        x: 50,
        y: 50,
        l: 20,
        t: 150,
        min: 0,
        max: 100,
        val: 20,
        offset: 10,
        warnaGaris: "#ffffff",
        warnaIsi: "red",
        label: ["0", "50", "100"],
        showVal: true,
        desimal: 0,
        context: konten // pastikan ini mengarah ke konteks canvas yang benar
    };
    
    function segitiga(x, y, lebar, tinggi, tebal, rotation, warnaGaris, warnaIsi) {
        let konten = canvas.getContext("2d"); // Asumsikan `canvas` adalah elemen canvas di HTML
    
        // Simpan state canvas
        konten.save();
        
        // Pindahkan titik referensi ke pusat segitiga untuk rotasi yang mudah
        konten.translate(x + lebar / 2, y + tinggi / 2);
        konten.rotate(rotation * Math.PI / 180);
        
        // Pindahkan kembali referensi ke titik awal segitiga setelah rotasi
        konten.translate(-(x + lebar / 2), -(y + tinggi / 2));
        
        // Gambar segitiga tanpa sudut melengkung
        konten.beginPath();
        
        // Titik atas segitiga
        konten.moveTo(x + lebar / 2, y);
    
        // Garis kanan
        konten.lineTo(x + lebar, y + tinggi);
        
        // Garis bawah
        konten.lineTo(x, y + tinggi);
        
        // Garis kiri kembali ke titik awal
        konten.lineTo(x + lebar / 2, y);
        
        // Tutup jalur untuk menyelesaikan segitiga
        konten.closePath();
        
        // Set properti garis dan isi
        konten.lineWidth = tebal;
        konten.strokeStyle = warnaGaris;
        konten.fillStyle = warnaIsi;
        
        // Isi segitiga
        konten.fill();
        
        // Gambar garis segitiga
        konten.stroke();
        
        // Kembalikan state canvas ke kondisi sebelum `save()`
        konten.restore();
    }







    termometer(termometerDetail)
    termometer(termometerCelup);
    tabung(gelasPiala1);
    garis(0, 0.8 * canvas.height, canvas.width, 0.8 * canvas.height, 2, 'black');
    heater(0.5 * canvas.width - 100, 0.8 * canvas.height - 50, 200, 50, 5, 'black', 20);    
}
