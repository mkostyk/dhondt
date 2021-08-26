const chartist = window.chartist;

const okregi = [12,8,14,12,13,15,12,12,10,9,12,8,14,10,9,10,9,12,20,12,12,11,15,14,12,14,9,7,9,9,12,9,16,8,10,12,9,9,10,8,12];
const partie = 7; // 5 + MN
var krajoweWyniki = [0,0,0,0,0,0,0];
var sejm = [[0,0,"Prawo i Sprawiedliwość","PiS"],[0,0,"Koalicja Obywatelska","KO"],[0,0,"Lewica","Lew"],[0,0,"Koalicja Polska", "KP"],[0,0,"Konfederacja", "Konf"],[0,0,"Polska 2050", "P2050"],[0,0,"Inne", "Inne"]] //mandaty,wynik,nazwa
var suma = 0;
var chart;

//MODELE

var pisModel = [0.97, 0.93, 0.80, 0.84, 0.93, 1.27, 1.36, 0.79, 0.75, 1.29, 1.14, 1.23, 0.91, 1.51, 1.37, 1.20, 1.33, 1.37, 0.63, 0.94, 0.86, 1.45, 1.43, 1.19, 0.74, 0.84, 1.07, 1.02, 0.87, 1.11, 0.90, 0.85, 1.27, 0.94, 0.89, 0.97, 1.08, 0.82, 0.58, 0.84, 0.81]
var koModel = [0.91, 1.17, 1.20, 1.13, 0.96, 0.70, 0.54, 1.14, 1.31, 0.57, 0.75, 0.84, 1.11, 0.50, 0.51, 0.61, 0.63, 0.51, 1.53, 1.04, 0.97, 0.58, 0.53, 0.77, 1.51, 1.31, 0.99, 0.83, 1.19, 1.01, 1.36, 1.08, 0.61, 1.04, 0.97, 0.90, 0.75, 1.12, 1.66, 1.18, 1.30]
var lewicaModel = [1.31, 0.98, 1.23, 1.21, 1.18, 0.62, 0.54, 1.24, 1.60, 0.87, 0.95, 0.68, 1.04, 0.48, 0.47, 0.70, 0.59, 0.51, 1.45, 1.04, 0.93, 0.48, 0.52, 0.72, 1.07, 0.99, 0.91, 1.24, 1.07, 0.77, 0.95, 1.74, 0.79, 0.93, 1.10, 1.07, 1.20, 1.06, 1.31, 1.23, 1.21]
var pslModel = [0.84, 0.85, 0.76, 1.05, 1.27, 1.06, 1.39, 1.36, 0.53, 1.22, 1.20, 0.92, 0.85, 0.86, 1.56, 1.77, 1.19, 1.40, 0.56, 1.01, 1.21, 0.92, 0.91, 1.09, 0.69, 0.93, 0.83, 1.02, 0.70, 0.66, 0.51, 0.57, 1.16, 1.27, 1.54, 1.50, 1.15, 1.62, 0.73, 1.10, 0.87]
var konfaModel = [0.86, 0.80, 1.09, 1.04, 0.93, 1.04, 0.86, 1.06, 0.98, 0.99, 0.86, 1.04, 1.17, 1.02, 1.04, 0.77, 0.86, 0.95, 1.10, 0.97, 0.84, 1.00, 1.21, 1.02, 1.06, 1.07, 1.09, 0.89, 1.13, 1.05, 1.08, 0.95, 0.87, 0.83, 1.02, 0.96, 0.99, 0.97, 0.97, 0.88, 0.96]
var holowniaModel = [1.02, 0.99, 1.02, 1.20, 1.02, 0.76, 0.73, 1.28, 1.03, 0.84, 0.90, 0.86, 1.02, 0.60, 0.71, 0.79, 0.70, 0.76, 0.97, 1.04, 1.20, 0.64, 0.70, 1.19, 1.15, 1.16, 1.12, 1.05, 1.20, 1.10, 1.13, 1.04, 0.73, 1.05, 1.06, 1.09, 1.06, 1.33, 1.33, 1.13, 1.13]

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