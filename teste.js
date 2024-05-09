console.log(calcVetorAresta([10,11],[20,40]))

function calcVetorAresta(p1,p2){
  
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

function calcularTaxaX(p1, p2){

  /*/console.log(difY);
  let difX = x2 - x1;
  let difY = y2 - y1;
  /*/ 
  let difX = p2[0] - p1[0];
  let difY = p2[1] - p1[1];

  //
  //console.log(difX);
  let taxaX = difX/difY;
  //console.log(taxaX);
  return taxaX;
}