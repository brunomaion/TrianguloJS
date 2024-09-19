const canvas = document.getElementById('viewport');
const ctx = canvas.getContext('2d');
const addPolygonButton = document.getElementById('addPolygon');

let drawing = false;
let points = [];
let polygons = [];  // Lista de todos os polígonos desenhados

class Poligono {
    constructor(points) {
        this.points = points;
        box = [points[0]]
    }

    draw(ctx) {
        if (this.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(this.points[0][0], this.points[0][1]);

            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i][0], this.points[i][1]);
            }

            // Fechar o polígono ligando o último ponto ao primeiro
            ctx.lineTo(this.points[0][0], this.points[0][1]);
            ctx.stroke();
            ctx.closePath();
        }
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
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
}

// Função para desenhar um ponto
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);  // Desenha um ponto pequeno no local do clique
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
