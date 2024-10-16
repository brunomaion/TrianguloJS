const canvas = document.getElementById('viewport');
const ctx = canvas.getContext('2d');
const addPolygonButton = document.getElementById('addPolygon');

let drawing = false;
let points = [];
let polygons = [];  // Lista de todos os polígonos desenhados
let resolucao = 700
let idTriangulo = 1;

class Poligono {
    constructor(pontos) {
        this.pontos = pontos;
        this.arestas = this.listaArestas(this.pontos); 
        this.box = this.calcBoxEnvolvente(this.pontos);
        this.ScanLines = this.calcScanLines(this.box, this.arestas)
        this.id = idTriangulo++;

        // Define cores padrão
        this.edgeColor = '#ffff00';  // Preto
        this.fillColor = '#ff0000';  // Vermelho
        this.paintEdge = true;
    }

    draw(ctx) {

        let box = this.box
        

        /* PINTA BOX ENVOLVENTE
        for (let i = box[1]; i < box[3]; i++) {
            for (let j = box[0]; j < box[2]; j++) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(j, i, 1, 1);
            }
        }

        */

        let arestas = this.arestas;


        // Desenha as arestas do polígono apenas se `paintEdge` for true
        if (this.paintEdge) {
            for (let i = 0; i < arestas.length; i++) {
                let aresta = arestas[i];
                
                for (let j = 0; j < aresta.length; j++) {
                    let pontoX = aresta[j][0];
                    let pontoY = aresta[j][1];
                    ctx.fillStyle = this.edgeColor;  // Cor da aresta
                    ctx.fillRect(pontoX, pontoY, 1, 1);
                }
            }
        }


        let vetorScanLines = this.ScanLines;
        
        for (let i = 0; i < vetorScanLines.length; i++) 
        {
            let listaPontosX = vetorScanLines[i][1];
            
            if (listaPontosX != 0) {
                let listaOrdenada = listaPontosX.sort((a, b) => a - b); //FORMA CRESCENTE
                
                // Remove os números repetidos
                //listaOrdenada = listaOrdenada.filter((value, index, self) => {return self.indexOf(value) === index;});

                //console.log(listaOrdenada);

                let tamanhoPontos = listaOrdenada.length;
                
                
                
                if (tamanhoPontos%2==0) 
                {
                    let repeticao = tamanhoPontos/2;
                    let index = 0
                    
                    for (let k = 0; k < repeticao; k++) {
                        let pX0 = listaOrdenada[index];
                        let pX1 = listaOrdenada[index+1];
                        index = index + 2;

                        //DESENHAR UMA LINHA ENTRE P0 P1


                        for (let l = pX0+1; l < pX1; l++) {
                            ctx.fillStyle = this.fillColor;  // Começa um novo caminho
                            ctx.fillRect(l, i, 1, 1);
    
                        }                        
                    } 
                }
            }
            
        }

    }

    calcScanLines(box, ListaArestas){ 
        //[Xmin, Ymin, Xmax, Ymax];
        let yMin = box[1];
        let yMax = box[3];
        let vetorScanLines = new Array(resolucao);
        // Inicializa cada posição de vetorScanLines como um array vazio
        
        for (let i = 0; i < resolucao; i++) {
            vetorScanLines[i] = [i, []];  // Cada posição se torna um array vazio
        }

        for (let i = 0; i < ListaArestas.length; i++) // perccorre arestas
        { 
            let aresta = ListaArestas[i];
            for (let j=0; j<aresta.length-1; j++) // percorre os elementos da arestas // -1 pq comeca proxima aresta
            {
                let pontoX = aresta[j][0];     
                let pontoY = aresta[j][1];   
                vetorScanLines[pontoY][1].push(pontoX)
            }
            
        }

        //console.log("VETOR SCAN LINES ", vetorScanLines);
        return vetorScanLines;
    }

    listaArestas(pontos) { // ARRUMA OS PONTOS POR ARESTA
        //console.log(pontos);
        let listaAresta = [];
        let p0 = [];
        let p1 = [];
        let aresta = [];
        for (let i = 0; i < (pontos.length-1); i++)  //LISTA LIGADA DOS PONTOS
        {
            p0 = pontos[i];
            p1 = pontos[i + 1];            
            aresta = [p0 , p1];
            listaAresta.push(aresta);
        }

        p0 = pontos[pontos.length-1]
        p1 = pontos[0]
        aresta = [p0 , p1];
        listaAresta.push(aresta);
        //console.log(listaAresta.length)

        let listaNovasArestas = [];


        for (let i = 0; i < listaAresta.length; i++) {
            p0  = listaAresta[i][0];
            let p0x = p0[0];
            let p0y = p0[1];
            p1  = listaAresta[i][1];
            let p1x = p1[0];
            let p1y = p1[1];

            
            let novaAresta = [];

            //VERIFICAR QUAL Y É MAIOR  y = v   // p0 pode estar em baixo
            if (p0y<=p1y){
                //console.log("MENOR")
                //console.log(p0y)
                //console.log(p1y)

                
                novaAresta.push([Math.round(p0[0]), Math.round(p0[1])])

                let difY = (p1y - p0y);
                let difX = (p1x - p0x);
                let taxaXIncremento = difX / difY;

                let npx = p0x;
                let npy = p0y;

                for (let j = 1; j < difY; j++) {
                    npx += taxaXIncremento;
                    npy += 1; 

                    novaAresta.push([Math.round(npx), Math.round(npy)])  
                }
                novaAresta.push([Math.round(p1[0]), Math.round(p1[1])])

            } else {

                novaAresta.push([Math.round(p1[0]), Math.round(p1[1])])

                let difY = (p0y - p1y);
                let difX = (p0x - p1x);
                let taxaXIncremento = difX / difY;

                let npx = p1x;
                let npy = p1y;

                for (let j = 1; j < difY; j++) {
                    npx += taxaXIncremento;
                    npy += 1; 

                    novaAresta.push([Math.round(npx), Math.round(npy)])   
                }
                novaAresta.push([Math.round(p0[0]), Math.round(p0[1])])

            };

            listaNovasArestas.push(novaAresta);
        }

        //console.log(listaNovasArestas)
        return listaNovasArestas;  
    }

    calcBoxEnvolvente(pontos) {
        let Xmin = Infinity;
        let Ymin = Infinity;
        let Xmax = -Infinity; 
        let Ymax = -Infinity;
    
        for (let i = 0; i < pontos.length; i++) {
            if(Xmin >= pontos[i][0]) {
                Xmin = pontos[i][0];
            }

            if(Ymin >= pontos[i][1]) {
                Ymin = pontos[i][1];
            }
            if(Xmax <= pontos[i][0]) {
                Xmax = pontos[i][0];
            }
            if(Ymax <= pontos[i][1]) {
                Ymax = pontos[i][1];
            }
        }

        let lista = [Xmin, Ymin, Xmax, Ymax];
        

        return lista;
    }
}



// Função para iniciar o desenho
function startDrawing() {
    drawing = true;
    points = [];  // Limpa os pontos anteriores
}

// Função para adicionar um vértice à lista de pontos
function addVertex(e) {
    if (drawing) {
        const [x, y] = getMousePosition(e);
        points.push([x, y]);  // Adiciona o vértice na lista no formato [[x0, y0], [x1, y1], ...]
        drawPoint(x, y);  // Desenha o ponto no local clicado
    }
}

// Função para obter a posição do mouse em relação ao canvas
function getMousePosition(e) {
    ctx.fillStyle = 'black'; 
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
}

// Função para desenhar um ponto
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);  // Desenha um ponto pequeno no local do clique
    ctx.fill();
    ctx.closePath();
}

// Função para finalizar e renderizar o polígono
function finalizePolygon(e) {
    e.preventDefault();  // Previne o menu de contexto padrão
    if (drawing && points.length > 2) {  // Pelo menos 3 pontos são necessários para formar um polígono
        drawing = false;  // Finaliza o desenho do polígono

        // Cria um novo objeto Poligono com os pontos atuais
        const polygon = new Poligono(points);
        polygons.push(polygon);  // Adiciona o novo polígono à lista

        redrawPolygons();  // Redesenha todos os polígonos
        updatePolygonsList();  // Atualiza a lista de polígonos na sidebar
    }
}

// Função para redesenhar todos os polígonos
function redrawPolygons() {
    clearCanvas();  // Limpa o canvas
    polygons.forEach(polygon => polygon.draw(ctx));  // Desenha todos os polígonos armazenados
}

// Função para limpar o canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Event Listeners
addPolygonButton.addEventListener('click', startDrawing);
canvas.addEventListener('click', addVertex);
canvas.addEventListener('contextmenu', finalizePolygon);



// Atualiza a lista de polígonos na sidebar
function updatePolygonsList() {
    const polygonsList = document.getElementById('polygonsList');
    polygonsList.innerHTML = '';  // Limpa a lista existente

    polygons.forEach(polygon => {
        const listItem = document.createElement('li');
        listItem.textContent = `Polígono ${polygon.id}`;
        listItem.classList.add('polygon-button');  // Adiciona a classe de botão
        listItem.addEventListener('click', () => showPolygonProperties(polygon));
        polygonsList.appendChild(listItem);
    });
}

function showPolygonProperties(polygon) {
    const polygonProperties = document.getElementById('polygonProperties');

    // Exibe as propriedades do polígono com campos para alterar as cores e checkbox para pintar a aresta
    polygonProperties.innerHTML = `
        <h3>Propriedades - Polígono ${polygon.id}</h3>
        <label for="paintEdge">Pintar Aresta:</label>
        <input type="checkbox" id="paintEdge" ${polygon.paintEdge ? 'checked' : ''}><br>
        <label for="edgeColor">Cor da aresta:</label>
        <input type="color" id="edgeColor" value="${polygon.edgeColor || '#000000'}">
        <br>
        <label for="fillColor">Cor de preenchimento:</label>
        <input type="color" id="fillColor" value="${polygon.fillColor || '#ff0000'}">
        <br>
        <button id="deletePolygonButton">Excluir Polígono</button>
    `;

    // Configura os valores de cores e o checkbox com os valores atuais
    document.getElementById('paintEdge').checked = polygon.paintEdge ?? true;
    document.getElementById('edgeColor').value = polygon.edgeColor || '#000000';
    document.getElementById('fillColor').value = polygon.fillColor || '#ff0000';

    // Adiciona event listener para alterar as propriedades
    document.getElementById('paintEdge').addEventListener('change', (e) => {
        polygon.paintEdge = e.target.checked;
        redrawPolygons();  // Redesenha os polígonos com a nova configuração
    });

    document.getElementById('edgeColor').addEventListener('input', (e) => {
        polygon.edgeColor = e.target.value;
        redrawPolygons();  // Redesenha os polígonos com a nova cor
    });

    document.getElementById('fillColor').addEventListener('input', (e) => {
        polygon.fillColor = e.target.value;
        redrawPolygons();  // Redesenha os polígonos com a nova cor
    });

    // Adiciona o event listener para o botão de excluir
    document.getElementById('deletePolygonButton').addEventListener('click', () => {
        deletePolygon(polygon);
    });
}


function deletePolygon(polygon) {
    // Remove o polígono da lista de polígonos
    polygons = polygons.filter(p => p.id !== polygon.id);

    // Limpa as propriedades exibidas
    document.getElementById('polygonProperties').innerHTML = '';

    // Redesenha todos os polígonos no canvas
    redrawPolygons();

    // Atualiza a lista de polígonos na sidebar
    updatePolygonsList();
}