const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//PONTOS FINAIS DA ARESTAS

class Triangulo {
  constructor(v1, v2, v3, nome) {

    this.nome = nome

    this.vetorOrdenado = this.ordenarPontosF(v1, v2, v3)
    this.v1 = this.vetorOrdenado[0];
    this.v2 = this.vetorOrdenado[1];
    this.v3 = this.vetorOrdenado[2];

    //CORES
    this.corV1 = [255,0,0]
    this.corV2 = [0,255,0]
    this.corV3 = [0,0,255]
    this.corArestas = [0,0,0]


    this.aresta12 = this.calcVetorAresta(this.v1,this.v2, this.corV1, this.corV2);
    this.aresta13 = this.calcVetorAresta(this.v1,this.v3, this.corV1, this.corV3);
    this.aresta23 = this.calcVetorAresta(this.v2,this.v3, this.corV2, this.corV3);

    this.minX = this.boxEnvolvente()[0];
    this.maxX = this.boxEnvolvente()[1];
    this.minY = this.boxEnvolvente()[2];
    this.maxY = this.boxEnvolvente()[3];

    this.nScans = this.maxY-this.minY; // numero scanLines
    
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
      
      if(p1[0]==p2[0]){
        return [p1, p2, p3];
      }

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
  

    return vetor;
  }
  
  boxEnvolvente(){
    
    let minimoX = Math.min(this.v1[0], this.v2[0], this.v3[0]);
    let maximoX = Math.max(this.v1[0], this.v2[0], this.v3[0]);
    let minimoY = Math.min(this.v1[1], this.v2[1], this.v3[1]);
    let maximoY = Math.max(this.v1[1], this.v2[1], this.v3[1]);

    return [minimoX, maximoX, minimoY, maximoY]
  }

  calcVetorAresta(p1,p2, corP1, corP2){
    
    let taxaX = this.calcularTaxaX(p1,p2);

    let pontoAresta = []
    let vetorAresta = []
    let x, y;
    x = p1[0]

    let taxaR = this.calcularTaxaCor(p1, p2, corP1[0], corP2[0])
    let taxaG = this.calcularTaxaCor(p1, p2, corP1[1], corP2[1])
    let taxaB = this.calcularTaxaCor(p1, p2, corP1[2], corP2[2])


    let corInicial = [corP1[0], corP1[1], corP1[2]]

    
    for (y = p1[1]; y < p2[1]; y++) {

      let corPixel = [corInicial[0]+=taxaR, corInicial[1]+=taxaG, corInicial[2]+=taxaB];
      pontoAresta = [Math.round(x), y, corPixel]   //ARRENDONDAR
      x += taxaX;
      vetorAresta.push(pontoAresta)
    }


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

  
  calcularTaxaCor(p1, p2, cor1, cor2){
    let difY = p2[1] - p1[1];
    let difCor = cor2-cor1;
    let taxaY = difCor/difY;
    return taxaY;
  }

  //DESENHAR
  pintarTriangulo(triangulo) {
    let scanVetor = this.scanLines(triangulo)
    let corPixel;


    function taxaCalculoCor(x1, x2, cor1, cor2){
      let difCor = cor2-cor1;
      let difX = x2-x1;
      let taxaCor = difCor/difX;
      return taxaCor;
    }
    

    for (let y = 0; y < triangulo.nScans-1; y++) {
      let corR = scanVetor[y][2][0];
      let corG = scanVetor[y][2][1];
      let corB = scanVetor[y][2][2];
      let taxaR = taxaCalculoCor(scanVetor[y][0], scanVetor[y][1], scanVetor[y][2][0], scanVetor[y][3][0])
      let taxaG = taxaCalculoCor(scanVetor[y][0], scanVetor[y][1], scanVetor[y][2][1], scanVetor[y][3][1])
      let taxaB = taxaCalculoCor(scanVetor[y][0], scanVetor[y][1], scanVetor[y][2][2], scanVetor[y][3][2])
      
      for (let x = scanVetor[y][0]; x < scanVetor[y][1]; x++) { //scanVector [minX, maX]
        corPixel = this.rgb(corR+=taxaR, corG+=taxaG, corB+=taxaB)
        ctx.fillStyle = corPixel;
        ctx.fillRect(x, y+triangulo.minY, 1, 1);
      }
      
    }
  }

  desenharAresta(aresta, cor){
    let tamanhoAresta = aresta.length;
    let x, y;

    
    if(aresta!=0){
      for (let i = 0; i < tamanhoAresta-1; i++) {
        x = aresta[i][0];
        y = aresta[i][1];
        //ctx.fillStyle = this.rgb(aresta[i][2][0],aresta[i][2][1],aresta[i][2][2]);
        ctx.fillStyle = this.rgb(cor[0], cor[1], cor[2]);
        ctx.fillRect(x, y, 1, 1);
      } 
    } else{
    }

    

  }

  desenharTodasArestas(triangulo){
    this.desenharAresta(triangulo.aresta12, triangulo.corArestas)
    this.desenharAresta(triangulo.aresta13, triangulo.corArestas)
    this.desenharAresta(triangulo.aresta23, triangulo.corArestas)
  }

  desenharTriangulo(triangulo) {
    this.pintarTriangulo(triangulo)
    this.desenharTodasArestas(triangulo)
  }

  //SCANLINES
  complementarAresta(aresta){ //FUNÇÃO PARA TORNAR ARESTAS TAMANHO IGUAL == nScan
    let tamAresta = aresta.length;
    let novoVetor = [];

    if (aresta!=0){
      if (aresta.length===this.nScans){ // SE FIR TAMANHO DA SCAN LINE
        for (let i = 0; i < tamAresta; i++) {
          let aux = [aresta[i][0], aresta[i][2]]
          novoVetor.push(aux)
        }
      } else if (aresta[0][1]===this.minY){ //PONTO INICIAL NO MIN
        let complemento = this.nScans-tamAresta;

        //PRIMEIRO VETOR
        for (let i = 0; i < tamAresta; i++) {
          let aux = [aresta[i][0], aresta[i][2]]
          novoVetor.push(aux)
        }
        //DPS COMPLEMENTO
        for (let i = 0; i < complemento; i++) {
          novoVetor.push(NaN)
        }

      } else if (aresta[tamAresta-1][1]===(this.maxY-1)){ // PONTO FINAL NO MAX
        let complemento = this.nScans-tamAresta;
        //PRIMEIRO COMPLEMENTO 
        for (let i = 0; i < complemento; i++) {
          novoVetor.push(NaN)
        }
        //DPS VETOR
        for (let i = 0; i < tamAresta; i++) {
          let aux = [aresta[i][0], aresta[i][2]]
          novoVetor.push(aux)
        }
  
      } 
    } else { //VETOR VAZIO
      for (let i = 0; i < this.nScans; i++) {
        novoVetor.push(NaN)
      }
    }

    return novoVetor;
  }

  scanLines(triangulo) { //VETOR Posição == y,  elemento == X

    let conjuntoVazio = []

    let aresta1 = triangulo.aresta12;
    let aresta2 = triangulo.aresta13;
    let aresta3 = triangulo.aresta23;


    ///*
    
    let novaAresta1 = this.complementarAresta(aresta1);
    let novaAresta2 = this.complementarAresta(aresta2);
    let novaAresta3 = this.complementarAresta(aresta3);


    let scanLinesVetor = []
    let pontoMax, pontoMin;

    let corMinX;
    let corMaxX;
  
    for (let y = 0; y < triangulo.nScans; y++) {
  
      if (isNaN(novaAresta1[y][0])) {
        pontoMax = Math.max(novaAresta2[y][0], novaAresta3[y][0]);
        pontoMin = Math.min(novaAresta2[y][0], novaAresta3[y][0]);
        
        if (pontoMin==novaAresta2[y][0]) {
          corMinX = novaAresta2[y][1];
          corMaxX = novaAresta3[y][1];
        } else {
          corMinX = novaAresta3[y][1];
          corMaxX = novaAresta2[y][1];
        }
        scanLinesVetor.push([pontoMin, pontoMax, corMinX, corMaxX]);
      } 


      if (isNaN(novaAresta2[y][0])) {
        pontoMax = Math.max(novaAresta1[y][0], novaAresta3[y][0]);
        pontoMin = Math.min(novaAresta1[y][0], novaAresta3[y][0]);
        if (pontoMin==novaAresta1[y][0]) {
          corMinX = novaAresta1[y][1];
          corMaxX = novaAresta3[y][1];
        } else {
          corMinX = novaAresta3[y][1];
          corMaxX = novaAresta1[y][1];
        }

        scanLinesVetor.push([pontoMin, pontoMax, corMinX, corMaxX]);
      } 

      if (isNaN(novaAresta3[y][0])) {
        pontoMax = Math.max(novaAresta1[y][0], novaAresta2[y][0]);
        pontoMin = Math.min(novaAresta1[y][0], novaAresta2[y][0]);

        if (pontoMin==novaAresta1[y][0]) {
          corMinX = novaAresta1[y][1];
          corMaxX = novaAresta2[y][1];
        } else {
          corMinX = novaAresta2[y][1];
          corMaxX = novaAresta1[y][1];
        }

        scanLinesVetor.push([pontoMin, pontoMax, corMinX, corMaxX]);
      }
  
      
    } 
  
    return scanLinesVetor;
  }

}

//CONSTRUIR TRIANGULO
function createTriangulo(x1, y1, x2, y2, x3, y3, nome){
  let triangulo = new Triangulo([x1, y1], [x2, y2], [x3, y3], nome)
  return triangulo;
}

//INTERFACE
var listaTriangulos = []
function adicionarTrianguloNovo(pontosCapturados, nome){
  const triangulo = createTriangulo( 
    pontosCapturados[0][0], 
    pontosCapturados[0][1], 
    pontosCapturados[1][0],  
    pontosCapturados[1][1], 
    pontosCapturados[2][0], 
    pontosCapturados[2][1], 
    nome
  );
  listaTriangulos.push(triangulo);
}
// Adicione esta função para criar botões na barra lateral
function criarBotaoTriangulo(triangulo, index) {
  const lista = document.getElementById("trianglesList");
  const botao = document.createElement("button");
  botao.textContent = String(triangulo.nome);
  botao.addEventListener("click", function() {
    exibirPropriedadesTriangulo(triangulo, index);
  });
  lista.appendChild(botao);

  const botaoExcluir = document.createElement("button");
  botaoExcluir.textContent = `Excluir`;
  botaoExcluir.addEventListener("click", function() {
    excluirTriangulo(triangulo.nome);
  });
  lista.appendChild(botaoExcluir);
}

function renderizarTriangulo(listaTriangulos) {
  const lista = document.getElementById("trianglesList");
  const propriedadesDiv = document.getElementById("triangleProperties");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lista.innerHTML = "";
  propriedadesDiv.innerHTML = "";
  for (let i = 0; i < listaTriangulos.length; i++) {
    listaTriangulos[i].pintarTriangulo(listaTriangulos[i]);
    listaTriangulos[i].desenharTodasArestas(listaTriangulos[i]);
    criarBotaoTriangulo(listaTriangulos[i], i); // Cria um botão para cada triângulo
  }
}
var contTri = 0;
var botaoAddTriangulo = document.getElementById("addTriangleBtn");
botaoAddTriangulo.addEventListener("click", function() {
  var pontosCapturados = [];
  var pontosCapturadosCount = 0;

  canvas.addEventListener("click", capturarPonto);

  contTri++;
  var nome = 'Triângulo' + String(contTri)
  function capturarPonto(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    pontosCapturados.push([x, y]);
    pontosCapturadosCount++;
    if (pontosCapturadosCount === 3) {
      canvas.removeEventListener("click", capturarPonto);
      adicionarTrianguloNovo(pontosCapturados, nome);
    }
    renderizarTriangulo(listaTriangulos);
  }
});

function excluirTriangulo(nomeExcluir) {
  const index = listaTriangulos.findIndex(triangulo => triangulo.nome === nomeExcluir);
  if (index !== -1) {
      listaTriangulos.splice(index, 1);
      renderizarTriangulo(listaTriangulos);
      console.log(`Triângulo ${nomeExcluir} excluído`);
  } else {
      console.log(`Triângulo ${nomeExcluir} não encontrado`);
  }
  const lista = document.getElementById("trianglesList");
  lista.innerHTML = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  listaTriangulos.forEach((triangulo, index) => {
    criarBotaoTriangulo(triangulo, index);
    triangulo.desenharTriangulo(triangulo);
  });
  console.log("Triângulo excluído");
}

function exibirPropriedadesTriangulo(triangulo, index) {
  const propriedadesDiv = document.getElementById("triangleProperties");
  propriedadesDiv.innerHTML = ""; // Limpa a div antes de adicionar os novos elementos

  const form = document.createElement("form");
  
  const v1Label = document.createElement("label");
  v1Label.textContent = "V1: ";
  const v1InputX = document.createElement("input");
  v1InputX.type = "number";
  v1InputX.value = triangulo.v1[0];
  const v1InputY = document.createElement("input");
  v1InputY.type = "number";
  v1InputY.value = triangulo.v1[1];
  const v1InputColor = document.createElement("input");
  v1InputColor.type = "color";
  v1InputColor.value = "#" + triangulo.corV1.map(componente => componente.toString(16).padStart(2, '0')).join('');
  
  const v2Label = document.createElement("label");
  v2Label.textContent = "V2: ";
  const v2InputX = document.createElement("input");
  v2InputX.type = "number";
  v2InputX.value = triangulo.v2[0];
  const v2InputY = document.createElement("input");
  v2InputY.type = "number";
  v2InputY.value = triangulo.v2[1];
  const v2InputColor = document.createElement("input");
  v2InputColor.type = "color";
  v2InputColor.value = "#" + triangulo.corV2.map(componente => componente.toString(16).padStart(2, '0')).join('');

  
  const v3Label = document.createElement("label");
  v3Label.textContent = "V3: ";
  const v3InputX = document.createElement("input");
  v3InputX.type = "number";
  v3InputX.value = triangulo.v3[0];
  const v3InputY = document.createElement("input");
  v3InputY.type = "number";
  v3InputY.value = triangulo.v3[1];
  const v3InputColor = document.createElement("input");
  v3InputColor.type = "color";
  v3InputColor.value = "#" + triangulo.corV3.map(componente => componente.toString(16).padStart(2, '0')).join('');

  const corArestaLabel = document.createElement("label");
  corArestaLabel.textContent = "Cor da aresta: ";
  const corArestaInputColor = document.createElement("input");
  corArestaInputColor.type = "color";
  corArestaInputColor.value = "#" + triangulo.corArestas.map(componente => componente.toString(16).padStart(2, '0')).join('');

  const salvarButton = document.createElement("button");
  salvarButton.textContent = "Salvar";
  salvarButton.type = "button";
  salvarButton.addEventListener("click", function() {
    triangulo.v1 = [parseInt(v1InputX.value), parseInt(v1InputY.value)];
    triangulo.corV1 = [parseInt(v1InputColor.value.slice(1, 3), 16), parseInt(v1InputColor.value.slice(3, 5), 16), parseInt(v1InputColor.value.slice(5, 7), 16)];
    triangulo.v2 = [parseInt(v2InputX.value), parseInt(v2InputY.value)];
    triangulo.corV2 = [parseInt(v2InputColor.value.slice(1, 3), 16), parseInt(v2InputColor.value.slice(3, 5), 16), parseInt(v2InputColor.value.slice(5, 7), 16)];
    triangulo.v3 = [parseInt(v3InputX.value), parseInt(v3InputY.value)];
    triangulo.corV3 = [parseInt(v3InputColor.value.slice(1, 3), 16), parseInt(v3InputColor.value.slice(3, 5), 16), parseInt(v3InputColor.value.slice(5, 7), 16)];
    triangulo.corArestas = [parseInt(corArestaInputColor.value.slice(1, 3), 16), parseInt(corArestaInputColor.value.slice(3, 5), 16), parseInt(corArestaInputColor.value.slice(5, 7), 16)];
    triangulo.vetorOrdenado = triangulo.ordenarPontosF(triangulo.v1, triangulo.v2, triangulo.v3);
    triangulo.v1 = triangulo.vetorOrdenado[0];
    triangulo.v2 = triangulo.vetorOrdenado[1];
    triangulo.v3 = triangulo.vetorOrdenado[2];
    triangulo.aresta12 = triangulo.calcVetorAresta(triangulo.v1, triangulo.v2, triangulo.corV1, triangulo.corV2);
    triangulo.aresta13 = triangulo.calcVetorAresta(triangulo.v1, triangulo.v3, triangulo.corV1, triangulo.corV3);
    triangulo.aresta23 = triangulo.calcVetorAresta(triangulo.v2, triangulo.v3, triangulo.corV2, triangulo.corV3);
    triangulo.minX = triangulo.boxEnvolvente()[0];
    triangulo.maxX = triangulo.boxEnvolvente()[1];
    triangulo.minY = triangulo.boxEnvolvente()[2];
    triangulo.maxY = triangulo.boxEnvolvente()[3];
    triangulo.nScans = triangulo.maxY - triangulo.minY;
    
    renderizarTriangulo(listaTriangulos);
  });

  form.appendChild(v1Label);
  form.appendChild(v1InputX);
  form.appendChild(v1InputY);
  form.appendChild(v1InputColor);
  form.appendChild(document.createElement("br"));

  form.appendChild(v2Label);
  form.appendChild(v2InputX);
  form.appendChild(v2InputY);
  form.appendChild(v2InputColor);
  form.appendChild(document.createElement("br"));
  
  form.appendChild(v3Label);
  form.appendChild(v3InputX);
  form.appendChild(v3InputY);
  form.appendChild(v3InputColor);
  form.appendChild(document.createElement("br"));
  
  form.appendChild(corArestaLabel);
  form.appendChild(corArestaInputColor);
  form.appendChild(document.createElement("br"));
  
  form.appendChild(salvarButton);

  propriedadesDiv.appendChild(form);
}