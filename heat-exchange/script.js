let canvas = document.getElementById("myCanvas");
let konten = canvas.getContext("2d");

var gelasPiala1 = {
    tipe: "beaker",
    x: 360,
    y: 250,
    l: 80,
    t: 100,
    rad: 8,
    vol: 60,
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

// Gambar gelas beaker
tabung(gelasPiala1);
garis(0, 0.8*canvas.height, canvas.width, 0.8*canvas.height, 2, 'black');