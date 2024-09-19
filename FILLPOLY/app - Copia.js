const canvas = document.getElementById('polygonCanvas');
const ctx = canvas.getContext('2d');
const addPolygonButton = document.getElementById('addPolygon');

let drawing = false;
let points = [];

// Função para iniciar o desenho
function startDrawing() {
    drawing = true;
    points = [];  // Limpa os pontos anteriores
    clearCanvas();  // Limpa o canvas
}

// Função para limpar o canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        drawPolygon();  // Desenha o polígono conectando os pontos
    }
}

// Função para desenhar o polígono conectando os vértices
function drawPolygon() {
    if (points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }

        // Fechar o polígono ligando o último ponto ao primeiro
        ctx.lineTo(points[0][0], points[0][1]);
        ctx.stroke();
        ctx.closePath();
    }
}

// Event Listeners
addPolygonButton.addEventListener('click', startDrawing);
canvas.addEventListener('click', addVertex);
canvas.addEventListener('contextmenu', finalizePolygon);
