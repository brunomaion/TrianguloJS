const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//PONTOS FINAIS DA ARESTAS

class Triangulo {
  constructor(v1, v2, v3) {
    this.vetorOrdenado = this.ordenarPontosF(v1, v2, v3)
    this.v1 = this.vetorOrdenado[0];
    this.v2 = this.vetorOrdenado[1];
    this.v3 = this.vetorOrdenado[2];
    this.aresta12 = this.calcVetorAresta(this.v1,this.v2);
    this.aresta13 = this.calcVetorAresta(this.v1,this.v3);
    this.aresta23 = this.calcVetorAresta(this.v2,this.v3);

    this.minX = this.boxEnvolvente()[0];
    this.maxX = this.boxEnvolvente()[1];
    this.minY = this.boxEnvolvente()[2];
    this.maxY = this.boxEnvolvente()[3];

    this.nScans = this.maxY-this.minY; // numero scanLines

    //CORES
    this.corAresta = this.rgb(0, 0, 0); //'black';
    this.corV1 = 'red';
    this.corV2 = 'green';
    this.corV3 = 'blue';
    
  }

  rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  ordenarPontosF(v1, v2, v3){  //COLOCAR O PONTO MAIS ALTO EM 1 e o MAIS BAIXO EM 3- SE FOR IGUAL PREFERENCIA DA ORDEM
    /*
    1 2 3
    1 3 2
    2 1 3
    2 3 1
    3 1 2
    3 2 1
    */

    function maisEsquerda(p1, p2, p3){
      
      if (p1[0] <= p2[0] && p1[0] <= p3[0]){ // mais alto  0==X; 1==Y
          if (p2[0]<=p3[0]) {
            return [p1, p2, p3];

          } else {
            return [p1, p3, p2];

          }

      } else if (p2[0] <= p1[0] && p2[0] <= p3[0]){ // mais alto  0==X; 1==Y
          if (p1[0]<=p3[0]) {
            return [p2, p1, p3];
          } else {
            return [p2, p3, p1];
          }
      } else if (p3[0] <= p1[0] && p3[0] <= p2[0]){ // mais alto  0==X; 1==Y
          if (p1[0]<=p2[0]) {
            return [p3, p1, p2];
          } else {
            return [p3, p2, p1];
          }
      } 
    } 

    function maisAlto(p1, p2, p3){

      
    
      if (p1[1] <= p2[1] && p1[1] <= p3[1]){ // mais alto  0==X; 1==Y

          if (p2[1]<=p3[1]) {
            return [p1, p2, p3];
          } else {
            return [p1, p3, p2];
    
          }
    
      } else if (p2[1] <= p1[1] && p2[1] <= p3[1]){ // mais alto  0==X; 1==Y
          if (p1[1]<=p3[1]) {
            return [p2, p1, p3];
          } else {
            return [p2, p3, p1];
          }
      } else if (p3[1] <= p1[1] && p3[1] <= p2[1]){ // mais alto  0==X; 1==Y
          if (p1[1]<=p2[1]) {
            return [p3, p1, p2];
          } else {
            return [p3, p2, p1];
          }
      } 
    } 
    
    let vetorEsq = maisEsquerda(v1, v2, v3);
    let vetor = maisAlto(vetorEsq[0],vetorEsq[1],vetorEsq[2])
    
    console.log(vetor);


    return vetor;
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
    console.log(taxaX);
    console.log(p1);
    console.log(p2);

    let pontoAresta = []
    let vetorAresta = []
    let x, y;
    x = p1[0]

    for (y = p1[1]; y < p2[1]; y++) {
      pontoAresta = [Math.round(x), y]   //ARRENDONDAR
      x += taxaX;
      vetorAresta.push(pontoAresta)
    }

    //console.log(vetorAresta);
    return vetorAresta;
  }


  calcularTaxaX(p1, p2){
    let taxaX;
    let difX = p2[0] - p1[0];
    let difY = p2[1] - p1[1];
    if (difX=== 0 || difY===0){
      taxaX = 0;
      return 0;
    }
    taxaX = difX/difY;
    return taxaX;
  }

  calcularTaxaY(p1, p2){
    let difX = p2[0] - p1[0];
    let difY = p2[1] - p1[1];
    let taxaY = difY/difX;
    return taxaY;
  }

  //DESENHAR
  pintarTriangulo(triangulo) {
    let scanVetor = this.scanLines(triangulo)
    for (let y = 1; y < triangulo.nScans-1; y++) {
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
    //console.log(aresta);
    //console.log(tamanhoAresta);
    let x, y;
    if(aresta!=0){
      for (let i = 0; i < tamanhoAresta-1; i++) {
        x = aresta[i][0];
        y = aresta[i][1];
        ctx.fillStyle = this.corAresta;
        ctx.fillRect(x, y, 1, 1);
      } 
    } else{
      //console.log('Nao Desenhar Aresta! X IGUAL');
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
  const trianguloExemplo = createTriangulo(500, 450, 80, 450, 80, 10);
  //trianguloExemplo.corAresta ='red'
  //trianguloExemplo.desenharTriangulo(trianguloExemplo)
  trianguloExemplo.pintarTriangulo(trianguloExemplo)
  //console.log(trianguloExemplo.aresta12);
  //console.log(trianguloExemplo.aresta13);
  //console.log(trianguloExemplo.aresta23);
}

testeTriangulo()

