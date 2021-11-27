const chartist = window.chartist;

const okregi = [12,8,14,12,13,15,12,12,10,9,12,8,14,10,9,10,9,12,20,12,12,11,15,14,12,14,9,7,9,9,12,9,16,8,10,12,9,9,10,8,12];
const partie = 7; // 6 + MN
var krajoweWyniki = [0,0,0,0,0,0,0];
var sejm = [[0,0,"Prawo i Sprawiedliwość","PiS"],[0,0,"Koalicja Obywatelska","KO"],[0,0,"Lewica","Lew"],[0,0,"Koalicja Polska", "KP"],[0,0,"Konfederacja", "Konf"],[0,0,"Polska 2050", "P2050"],[0,0,"Inne", "Inne"]] //mandaty,wynik,nazwa
var suma = 0;
var chart;

//MODELE

var pisModel = [0.973, 0.930, 0.795, 0.836, 0.926, 1.271, 1.365, 0.787, 0.755, 1.290, 1.143, 1.227, 0.908, 1.510, 1.367, 1.203, 1.326, 1.371, 0.631, 0.938, 0.864, 1.454, 1.431, 1.194, 0.736, 0.836, 1.073, 1.016, 0.866, 1.108, 0.899, 0.852, 1.266, 0.937, 0.891, 0.975, 1.085, 0.818, 0.581, 0.845, 0.805]
var koModel = [0.913, 1.171, 1.197, 1.133, 0.964, 0.704, 0.540, 1.141, 1.307, 0.571, 0.747, 0.841, 1.112, 0.505, 0.511, 0.615, 0.626, 0.509, 1.535, 1.044, 0.975, 0.582, 0.525, 0.768, 1.508, 1.308, 0.993, 0.826, 1.190, 1.011, 1.358, 1.082, 0.608, 1.038, 0.966, 0.902, 0.747, 1.117, 1.656, 1.179, 1.303]
var lewicaModel = [1.308, 0.983, 1.227, 1.208, 1.181, 0.622, 0.544, 1.243, 1.600, 0.872, 0.954, 0.678, 1.036, 0.483, 0.473, 0.697, 0.592, 0.514, 1.448, 1.042, 0.935, 0.481, 0.525, 0.724, 1.072, 0.993, 0.914, 1.241, 1.065, 0.771, 0.949, 1.744, 0.792, 0.927, 1.102, 1.069, 1.197, 1.057, 1.313, 1.229, 1.214]
var pslModel = [0.839, 0.848, 0.756, 1.055, 1.273, 1.064, 1.387, 1.360, 0.530, 1.221, 1.204, 0.924, 0.850, 0.860, 1.561, 1.774, 1.193, 1.396, 0.556, 1.006, 1.206, 0.918, 0.911, 1.091, 0.690, 0.929, 0.834, 1.015, 0.701, 0.660, 0.511, 0.567, 1.156, 1.274, 1.543, 1.497, 1.147, 1.621, 0.725, 1.103, 0.865]
var konfaModel = [0.859, 0.796, 1.094, 1.035, 0.930, 1.038, 0.858, 1.056, 0.977, 0.993, 0.863, 1.037, 1.173, 1.021, 1.044, 0.769, 0.865, 0.953, 1.103, 0.974, 0.837, 1.000, 1.211, 1.022, 1.059, 1.072, 1.090, 0.891, 1.126, 1.053, 1.076, 0.947, 0.874, 0.831, 1.023, 0.965, 0.990, 0.972, 0.971, 0.878, 0.959]
var holowniaModel = [1.020, 0.995, 1.023, 1.205, 1.027, 0.764, 0.739, 1.288, 1.039, 0.844, 0.909, 0.862, 1.023, 0.601, 0.714, 0.794, 0.706, 0.764, 0.975, 1.042, 1.200, 0.643, 0.709, 1.199, 1.159, 1.167, 1.123, 1.059, 1.200, 1.109, 1.139, 1.047, 0.733, 1.055, 1.067, 1.094, 1.066, 1.333, 1.332, 1.131, 1.134]

function dHondt (wyniki, mandaty) {
    let punkty = [];
    for(let i=0; i<partie; i++){
      for(let j=0; j<mandaty; j++){
        punkty.push([wyniki[i]/(j+1),i])
      }
    }

    punkty.sort(function(a, b){return b[0]-a[0]});
    for(let i=0; i<mandaty; i++){
      sejm[punkty[i][1]][0]++;
    }
}

function sainteLague (wyniki, mandaty) {
    let punkty = [];
    for(let i=0; i<partie; i++){
      for(let j=0; j<mandaty; j++){
        punkty.push([wyniki[i]/(2*j+1),i])
      }
    }

    punkty.sort(function(a, b){return b[0]-a[0]});
    for(let i=0; i<mandaty; i++){
      sejm[punkty[i][1]][0]++;
    }
}

function createCell(row, content){
  let text = document.createTextNode(content);
  let cell = row.insertCell(row.cells.length);
  cell.appendChild(text);
}

function clear(){
  let table = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  let length = table.rows.length;
  for(let i=length; i>0; i--)
    table.deleteRow(i-1);

  if(chart != undefined)
    chart.detach()
}

function showChart(){
  let sorted = sejm
    .map((party) => ({
      value: party[0],
      className: party[3].toLowerCase()
    }))
    .filter((el) => (el.value > 0))
    .sort((a,b) => (b.value - a.value))

  chart = new Chartist.Pie('.ct-chart', {
    series: sorted
  }, {
    donut: true,
    donutWidth: 60,
    donutSolid: true,
    startAngle: 270,
    total: 460*2,
    labelInterpolationFnc: (value) => {
      if(value < 10) {
        return '';
      } else {
        return value;
      }
    }
  });
}

function showResults(){
  let table = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  clear();

  sejm.sort(function(a, b){return b[0]-a[0]});
  for(let i=0; i<partie; i++){
    let newRow = table.insertRow(i);
    createCell(newRow, `${sejm[i][2]}`);
    createCell(newRow, `${sejm[i][1]}`);
    createCell(newRow, `${sejm[i][0]}`);``
    createCell(newRow, `${(Math.round(sejm[i][0]*10000/460))/100}`);
  }

  showChart();
}

function model(metoda){
  for(let i=0; i<41; i++){
    let mnWynik = 0;
    if(i==20)
      mnWynik = 0.08*suma //#okręg 21 - poseł mniejszości niemieckiej(8%)
    okregoweWyniki=[krajoweWyniki[0]*pisModel[i], krajoweWyniki[1]*koModel[i], krajoweWyniki[2]*lewicaModel[i], krajoweWyniki[3]*pslModel[i], krajoweWyniki[4]*konfaModel[i], krajoweWyniki[5]*holowniaModel[i], mnWynik];
    if(metoda=="dhondt") dHondt(okregoweWyniki, okregi[i]);
    if(metoda=="saintelague") sainteLague(okregoweWyniki, okregi[i]);
  }
  showResults();
}

function getResults(metoda){
  let form = document.getElementById("data");

  suma = 0;
  sejm = [[0,0,"Prawo i Sprawiedliwość","PiS"],[0,0,"Koalicja Obywatelska","KO"],[0,0,"Lewica","Lew"],[0,0,"Koalicja Polska", "KP"],[0,0,"Konfederacja", "Konf"],[0,0,"Polska 2050", "P2050"],[0,0,"Inne", "Inne"]];

  for(let i=0; i<partie; i++){
    krajoweWyniki[i]=Number(form.elements[i].value);
    suma+=krajoweWyniki[i];
  }

  for(let i=0; i<partie; i++)
    sejm[i][1]=(Math.round(krajoweWyniki[i]*10000/suma))/100;

  for(let i=0; i<partie; i++){
    if(krajoweWyniki[i]<0.05*suma) krajoweWyniki[i]=0; //próg wyborczy
    if(i==1 && krajoweWyniki[i]<0.08*suma) krajoweWyniki[i]=0; //próg wyborczy dla KKW Koalicja Obywatelska
  }

  model(metoda);
}
