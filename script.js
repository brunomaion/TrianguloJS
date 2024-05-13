const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//PONTOS FINAIS DA ARESTAS

class Triangulo {
  constructor(v1, v2, v3) {
    this.v1 = this.ordenarPontosF(v1, v2, v3)[0];
    this.v2 = this.ordenarPontosF(v1, v2, v3)[1];
    this.v3 = this.ordenarPontosF(v1, v2, v3)[2];
    this.aresta12 = this.calcVetorAresta(v1,v2);
    this.aresta13 = this.calcVetorAresta(v1,v3);
    this.aresta23 = this.calcVetorAresta(v2,v3);

    this.minX = this.boxEnvolvente()[0];
    this.maxX = this.boxEnvolvente()[1];
    this.minY = this.boxEnvolvente()[2];
    this.maxY = this.boxEnvolvente()[3];

    this.nScans = this.maxY-this.minY; // numero scanLines

  }

  ordenarPontosF(v1, v2, v3){  //COLOCAR O PONTO MAIS ALTO EM 1 e o MAIS BAIXO EM 3- SE FOR IGUAL PREFERENCIA DA ORDEM

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
  
  boxEnvolvente(){
    
    let minimoX = Math.min(this.v1[0], this.v2[0], this.v3[0]);
    let maximoX = Math.max(this.v1[0], this.v2[0], this.v3[0]);
    let minimoY = Math.min(this.v1[1], this.v2[1], this.v3[1]);
    let maximoY = Math.max(this.v1[1], this.v2[1], this.v3[1]);

    return [minimoX, maximoX, minimoY, maximoY]
  }

  calcVetorAresta(p1,p2){
    let taxaX = this.calcularTaxaX(p1,p2);
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


  calcularTaxaX(p1, p2){
    let difX = p2[0] - p1[0];
    let difY = p2[1] - p1[1];
    let taxaX = difX/difY;
    return taxaX;
  }

  //DESENHAR
  pintarTriangulo(triangulo) {
    let scanVetor = this.scanLines(triangulo)
    for (let y = 1; y < triangulo.nScans; y++) {
      if(scanVetor[y][0] != scanVetor[y][1]){
        for (let x = scanVetor[y][0]; x < scanVetor[y][1]; x++) {
          ctx.fillStyle = 'pink';
          ctx.fillRect(x, y+triangulo.minY, 1, 1);
        }
      }
    }
  }

  desenharAresta(aresta){
    let tamanhoAresta = aresta.length;
    let x, y;
    for (let i = 0; i < tamanhoAresta; i++) {
      x = aresta[i][0];
      y = aresta[i][1];
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, 1, 1);
    } 
  }

  desenharTodasArestas(triangulo){
    this.desenharAresta(triangulo.aresta12)
    this.desenharAresta(triangulo.aresta13)
    this.desenharAresta(triangulo.aresta23)
  }

  desenharTriangulo(triangulo) {
    this.pintarTriangulo(triangulo)
    this.desenharTodasArestas(triangulo)
  }

  //SCANLINES
  complementarAresta(aresta){ //FUNÇÃO PARA TORNAR ARESTAS TAMANHO IGUAL == nScan
    let tamAresta = aresta.length;
    let novoVetor = [];

    if (aresta.length===this.nScans){ // SE FIR TAMANHO DA SCAN LINE
      //console.log('nao complementar');
      for (let i = 0; i < tamAresta; i++) {
        novoVetor.push(aresta[i][0])
      }
    }
    else if (aresta[0][1]===this.minY){ //PONTO INICIAL NO MIN
      //console.log('complementar no final');
      let complemento = this.nScans-tamAresta;

      //PRIMEIRO VETOR
      for (let i = 0; i < tamAresta; i++) {
        novoVetor.push(aresta[i][0])
      }
      //DPS COMPLEMENTO
      for (let i = 0; i < complemento; i++) {
        novoVetor.push(NaN)
      }

    }
    else if (aresta[tamAresta-1][1]===(this.maxY-1)){ // PONTO FINAL NO MAX
      let complemento = this.nScans-tamAresta;
      //PRIMEIRO COMPLEMENTO 
      for (let i = 0; i < complemento; i++) {
        novoVetor.push(NaN)
      }
      //DPS VETOR
      for (let i = 0; i < tamAresta; i++) {
        novoVetor.push(aresta[i][0])
      }

    } 


    return novoVetor;
  }

  scanLines(triangulo) { //VETOR Posição == y,  elemento == X


    let aresta1 = triangulo.aresta12;
    let aresta2 = triangulo.aresta13;
    let aresta3 = triangulo.aresta23;
  
    ///*
    
    let novaAresta1 = this.complementarAresta(aresta1);
    let novaAresta2 = this.complementarAresta(aresta2);
    let novaAresta3 = this.complementarAresta(aresta3);
  
    let scanLinesVetor = []
    let pontoMax, pontoMin;
  
    for (let y = 0; y < triangulo.nScans; y++) {
  
      if (isNaN(novaAresta1[y])) {
        pontoMax = Math.max(novaAresta2[y], novaAresta3[y]);
        pontoMin = Math.min(novaAresta2[y], novaAresta3[y]);
        scanLinesVetor.push([pontoMin, pontoMax]);
      } 
      if (isNaN(novaAresta2[y])) {
        pontoMax = Math.max(novaAresta1[y], novaAresta3[y]);
        pontoMin = Math.min(novaAresta1[y], novaAresta3[y]);
        scanLinesVetor.push([pontoMin, pontoMax]);
      } 
      if (isNaN(novaAresta3[y])) {
        pontoMax = Math.max(novaAresta1[y], novaAresta2[y]);
        pontoMin = Math.min(novaAresta1[y], novaAresta2[y]);
        scanLinesVetor.push([pontoMin, pontoMax]);
      }
  
      
    } 
  
    return scanLinesVetor;
  }

}


//CONSTROI TRIANGULO
function createTriangulo(x1, y1, x2, y2, x3, y3){
  let triangulo = new Triangulo([x1, y1], [x2, y2], [x3, y3])
  return triangulo;
}


// TESTES
function testeTriangulo(){
  const trianguloExemplo = createTriangulo(5, 10, 5, 450, 500, 500);
  trianguloExemplo.desenharTriangulo(trianguloExemplo)
}

testeTriangulo()

