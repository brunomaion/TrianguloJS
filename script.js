const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


//PONTOS FINAIS DA ARESTAS

class Triangulo {
  constructor(v1, v2, v3) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.aresta12 = this.calcVetorAresta(v1,v2);
    this.aresta13 = this.calcVetorAresta(v1,v3);
    this.aresta23 = this.calcVetorAresta(v2,v3);
  }

   calcVetorAresta(p1,p2){
    let taxaX = calcularTaxaX(p1,p2);
    let pontoAresta = []
    let vetorAresta = []
    let x, y;
    x = p1[0]
    for (y = p1[1]; y < p2[1]; y++) {
      pontoAresta = [Math.round(x), y]   //ARRENDONDAR
      x += taxaX;
      vetorAresta.push(pontoAresta)
    }
    return vetorAresta;
  }
}



function desenharAresta(aresta){
  let tamanhoAresta = aresta.length;
  for (let i = 0; i < tamanhoAresta; i++) {
    x = aresta[i][0];
    y = aresta[i][1];
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, 1, 1);
  } 
}

function ordenarPontos(v1, v2, v3){  //COLOCAR O PONTO MAIS ALTO EM 1 e o MAIS BAIXO EM 3- SE FOR IGUAL PREFERENCIA DA ORDEM

  let pontoAlto = maisAltoEsq(v1, maisAltoEsq(v2, v3))
  let pontoMedio;
  let pontoBaixo;

  function maisAltoEsq(p1, p2){
    if (p1[1]<=p2[1]){ // mais alto
      if (p1[1]==p2[1] && p1[0]>p2[0]){ //mesmo Y com X dif
        return p2;
      }
      return p1;
    } 
    else{
      return p2;
    }
  } 

  if (pontoAlto == v1){
    pontoMedio = maisAltoEsq(v2, v3);
  } else if(pontoAlto == v2){
    pontoMedio = maisAltoEsq(v1, v3);
  } else { //pontoAlto == v3
    pontoMedio = maisAltoEsq(v1, v2);
  }

  if (pontoAlto !== v1 && pontoMedio !== v1) {
      pontoBaixo = v1;
  } else if (pontoAlto !== v2 && pontoMedio !== v2) {
      pontoBaixo = v2;
  } else {
      pontoBaixo = v3;
  }

  return [pontoAlto, pontoMedio, pontoBaixo];
}

function calcularTaxaX(p1, p2){
  let difX = p2[0] - p1[0];
  let difY = p2[1] - p1[1];
  let taxaX = difX/difY;
  return taxaX;
}

function desenharTrianguloExemplo(triangulo) {
  desenharAresta(triangulo.aresta12)
  desenharAresta(triangulo.aresta13)
  desenharAresta(triangulo.aresta23)
}

function totalScanLines(p1, p3){
  let total = p3[1] - p1[1]; 
  return total;
}

function scanLines(triangulo) {

  let v1 = triangulo.v1;
  let v2 = triangulo.v2;
  let v3 = triangulo.v3;

  let aresta1 = triangulo.aresta12;
  let aresta2 = triangulo.aresta13;
  let aresta3 = triangulo.aresta23;

  let minX = Math.min(v1[0], v2[0], v3[0]);
  let maxX = Math.max(v1[0], v2[0], v3[0]);
  let minY = Math.min(v1[1], v2[1], v3[1]);
  let maxY = Math.max(v1[1], v2[1], v3[1]);
  ///*
  
  let novaAresta1 = complementarAresta(aresta1);
  //let novaAresta2 = complementarAresta(aresta2);
  //let novaAresta3 = complementarAresta(aresta3);

  function complementarAresta(aresta){ //FUNÇÃO PARA TORNAR 
    let tamAresta = aresta.length;
    let nScans = maxY-minY;
    let novoVetor = [];

    if (aresta.length===nScans){ // SE FIR TAMANHO DA SCAN LINE
      //console.log('nao complementar');
      for (let i = 0; i < tamAresta; i++) {
        novoVetor.push(aresta[i][0])
      }
    }
    else if (aresta[0][1]===minY){ //PONTO INICIAL NO MIN
      //console.log('complementar no final');
      let complemento = nScans-tamAresta;

      //PRIMEIRO VETOR
      for (let i = 0; i < tamAresta; i++) {
        novoVetor.push(aresta[i][0])
      }
      //DPS COMPLEMENTO
      for (let i = 0; i < complemento; i++) {
        novoVetor.push(NaN)
      }

    }
    else if (aresta[tamAresta-1][1]===(maxY-1)){ // PONTO FINAL NO MAX
      //console.log('complementar no inicio');
      let complemento = nScans-tamAresta;
      //PRIMEIRO COMPLEMENTO 
      for (let i = 0; i < complemento; i++) {
        novoVetor.push(NaN)
      }
      //DPS VETOR
      for (let i = 0; i < tamAresta; i++) {
        novoVetor.push(aresta[i][0])
      }

      //TEST COMPLEMENTO



    } 

    /*
    for (let i = 0; i < novoVetor.length; i++) {
      if (novoVetor[i] != NaN) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(novoVetor[i], i, 1, 1);
      }
    }*/

    return novoVetor;
  }
  //*/


  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      ctx.fillStyle = 'pink';
      ctx.fillRect(x, y, 1, 1);
    }
  }

  let scanLinesVetor = []
  let pontoMax, pontoMin;

  for (let i = minY; i < maxY; i++) {

    
   
    
    pontoMax = Math.min(v1[1], v2[1], v3[1]);
    pontoMin = Math.max(v1[1], v2[1], v3[1]);
    scanLinesVetor.push([pontoMin, pontoMax]);

  }

}





//PINTAR AS SCAN LINES


function createTriangulo(x1, y1, x2, y2, x3, y3){

  let [pontoAlto, pontoMedio, pontoBaixo] = ordenarPontos([x1, y1], [x2, y2], [x3, y3]);
  let triangulo = new Triangulo(pontoAlto, pontoMedio, pontoBaixo)
  return triangulo;
}





// TESTES
function testeOrdenaTriangulo(){
  const trianguloExemplo = createTriangulo(200, 20, 5, 450, 500, 500);
  scanLines(trianguloExemplo)
  desenharTrianguloExemplo(trianguloExemplo)
}
testeOrdenaTriangulo()


