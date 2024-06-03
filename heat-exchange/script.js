aturCanvas();
setJudul("Virtual Lab");
hapusLayar("#b3cfe5");

//listener untuk membaca event mouse
canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;

var gelasPiala1 = {tipe:"beaker", x:200, y:120, l:80, t:100, rad:8, vol:0, warnaGaris:"#ffffff", warnaIsi:"#2495ff"}
var api1 = {x:200, y:300, v:1, rad:20, max:40, warna:"red", blok:gelasPiala1, dist:100};
var burner1 = {x:270, y:400, l:60, t:40, warnaGaris:"#fff", warnaIsi:"#ff2429"}
var termo1 = {x:100, y:100, l:15, t:80, min:0, max:100, val:20, offset: 10, warnaGaris: "#f8f8f8", warnaIsi: "red",label:["0", "50", "100"], showVal:true, desimal:0}
var dataKakiTiga = {x: 500, y: 0.6 * canvas.height, l: 100, t: 80, rad: 20, warna: 'black'}

var sliderVolume = {nama: "volumeSlider", x: 0.5 * canvas.width - 130, y: 500, p: 200, minS: 0, maxS: 500, valS: gelasPiala1.vol, tipe: "H", label: "mL"};

var apiAktif = 0;
var simAktif = 1;
var suhuAir = 20;
var menguap = false;

var dragTermo = {nama:"termo", x:termo1.x-25, y:termo1.y, w:termo1.l+50, h:termo1.t+40, limit:"xy"};
var dragBurner = {nama:"burner", x:burner1.x, y:burner1.y, w:burner1.l, h:burner1.t, limit:"x"};
var dragGelasPiala1 = {nama: "gelasPiala1", x: gelasPiala1.x, y: gelasPiala1.y, w: gelasPiala1.l, h: gelasPiala1.t, limit: "xy"};

function setSimulasi() {
	hapusLayar();
	
	//menampilkan teks
	teks("Perpindahan Kalor", 0.5*(canvas.width), 40, 'bold 20pt Calibri', 'black', 'center');
	teks("Drag Burner dan termometer untuk mengetahui perubahan suhu", 0.5*(canvas.width), 60, "12pt Calibri", "#000", "center");
	teks("Volume Cairan", 0.5*(canvas.width), 0.8 * canvas.height, "12pt Calibri", "#000", "center");
	
	//tombol control
	if (apiAktif == 1){
		tombol("Matikan/id=api", 0.5*(canvas.width) - 40,560, 80, 30, "bold 11pt Calibri", "white", "black", "gray", "r");
	}else{
		tombol("Nyalakan/id=api", 0.5*(canvas.width) - 40,560, 80, 30, "bold 11pt Calibri", "white", "black", "gray", "r");
	}

	// tampilkan slider volume
    slider(sliderVolume);

	//lantai
	garis(0,burner1.y+burner1.t + 2, canvas.width, burner1.y+burner1.t);
	
	//simulasi	
	kakiTiga(dataKakiTiga);
	burner(burner1);
	tabung(gelasPiala1);
	if (apiAktif == 1) setApi(burner1, api1);		
	termometer(termo1);

	//perhitungan api berdasarkan jarak
	var jarakTermoApi = jarak(termo1.x, termo1.y+termo1.t, api1.x, api1.y);
	var jarakBeakerApi = jarak(gelasPiala1.x+gelasPiala1.l/2, gelasPiala1.y+gelasPiala1.t, api1.x, api1.y);
	if (apiAktif == 1){		
		//suhu termometer naik 
		if (jarakTermoApi < api1.dist){
			termo1.val+= (api1.dist - jarakTermoApi)/100; 
		}
		//suhu air naik
		if (jarakBeakerApi < api1.dist && suhuAir < 100){
			suhuAir+= (api1.dist - jarakBeakerApi)/1000; 
		}	
	}
	//termometer masuk ke air
	if (cekHit(termo1.ujungX, termo1.ujungY, gelasPiala1, "vol")){
		termo1.val += (suhuAir - termo1.val)/100;
	}
	//suhu termometer turun ke suhu normal (misal 20C)
	if (jarakTermoApi > api1.dist || apiAktif == 0){
		if (termo1.val > 20) termo1.val -= 0.025;
	}
	//suhu air turun
	if (jarakBeakerApi > api1.dist || apiAktif == 0) {
		if (suhuAir > 20) suhuAir -= 0.005;
		if (suhuAir < 50) menguap = false;
	}
	//titik didih air
	if (suhuAir >= 100)	{
		gelembung(gelasPiala1);
		menguap = true;
	}
	//air menguap
	if (suhuAir >= 100 || menguap ) uap(gelasPiala1);
	
}

function jalankanSimulasi() {
	setSimulasi();
	if (simAktif == 1) {
		timer = window.setTimeout(jalankanSimulasi, 10);
	}
}

function mouseDown(event){
	canvas.onmousemove = mouseDrag;
	startDrag(mouseDrag);
}

function mouseDrag(event){
    // prosedur mengecek objek drag
    var drag = cekDrag(event);
    if (drag != null){
        if (drag.nama == "termo"){
			if(dragTermo.y + dragTermo.h < 440){
				termo1.x = dragTermo.x+dragTermo.w/2;
				termo1.y = dragTermo.y;
			} else {
				dragTermo.x = termo1.x - dragTermo.w/2;
				dragTermo.y = termo1.y;
			}
        }
        if (drag.nama == "burner"){
            burner1.x = dragBurner.x;
            // burner1.y = dragBurner.y;
        }
        if (drag.nama == "gelasPiala1") {
            // Pembatasan gerakan gelasPiala1 agar tidak melewati bagian atas dari kakiTiga1
            if ((dragGelasPiala1.y + dragGelasPiala1.h < dataKakiTiga.y - 2.5
				|| (dragGelasPiala1.x + dragGelasPiala1.w < dataKakiTiga.x - 50 || dragGelasPiala1.x > dataKakiTiga.x + 50)) 
				&& dragGelasPiala1.y + dragGelasPiala1.h < 440
			) {
                gelasPiala1.x = dragGelasPiala1.x;
                gelasPiala1.y = dragGelasPiala1.y;
            } else {
                // Kembalikan ke posisi semula jika melewati batas
                dragGelasPiala1.x = gelasPiala1.x;
                dragGelasPiala1.y = gelasPiala1.y;
            }
        }
    }

	// cek slider
	var activeSlider = cekSlider(event);
    if (activeSlider != null && activeSlider.nama == "volumeSlider") {
        sliderVolume.valS = activeSlider.valS;
		(sliderVolume.volS < 5) ? gelasPiala1.vol = 0 : gelasPiala1.vol = Number(sliderVolume.valS) / 5;
	}
}


function mouseUp(event){
	canvas.onmousemove = null;
	var tombolAktif = cekTombol(event);
	if (tombolAktif != ""){
		if (tombolAktif == "api"){
			if (apiAktif == 1) {
				apiAktif = 0;
			}else{
				apiAktif = 1;
			}
		}
	}
}

setDrag(dragTermo);
setDrag(dragBurner);
setDrag(dragGelasPiala1);
setDrag(sliderVolume);
jalankanSimulasi();