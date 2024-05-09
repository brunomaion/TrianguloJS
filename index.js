//onst canvas = document.getElementById("canvas");
//const ctx = canvas.getContext("2d");

//V X=0   Y=1 

class Triangulo {
  constructor(v1, v2, v3) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  }
}


//PONTOS FINAIS DA ARESTAS
function desenharAresta(x1, y1, x2, y2){
  let taxadoX = calcularTaxaX(x1, y1, x2, y2);
  //console.log(taxadoX);
  for (let i = y1; i < y2; i++) {
    //ctx.fillRect(x1, i, 1, 1);
    x1 += taxadoX;
  }
  //TENHO QUE ARMAZENAR PRA FAZER O CALCULO DPS

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


function calcularTaxaX(x1, y1, x2, y2){
  let difY = y2 - y1;
  //console.log(difY);
  let difX = x2 - x1;
  //console.log(difX);
  let taxaX = difX/difY;
  //console.log(taxaX);
  return taxaX;
}

function desenharTrainguloExemplo(triangulo) {
  desenharAresta(
    triangulo.v1[0], 
    triangulo.v1[1], 
    triangulo.v2[0], 
    triangulo.v2[1]);
  
  desenharAresta(
    triangulo.v1[0], 
    triangulo.v1[1], 
    triangulo.v3[0], 
    triangulo.v3[1]);
  
  desenharAresta(
    triangulo.v2[0], 
    triangulo.v2[1], 
    triangulo.v3[0], 
    triangulo.v3[1]);
}


//PINTAR AS SCAN LINES


function createTriangulo(x1, y1, x2, y2, x3, y3){

  let [pontoAlto, pontoMedio, pontoBaixo] = ordenarPontos([x1, y1], [x2, y2], [x3, y3]);
  triangulo = new Triangulo(pontoAlto, pontoMedio, pontoBaixo)
  return triangulo;
}





// TESTES
function testeOrdenaTriangulo(){
  const trianguloExemplo = createTriangulo(10, 10, 5, 40, 5, 5);
  console.log(trianguloExemplo)
}
//testeOrdenaTriangulo()



