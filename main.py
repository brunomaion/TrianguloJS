import pygame
import sys

# Inicializar o Pygame
pygame.init()

# Definir as dimensões da tela
width, height = 400, 400
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Triângulo")

# Classe Triangulo
class Triangulo:
    def __init__(self, x1, y1, x2, y2, x3, y3):
        self.v1 = (int(x1), int(y1))
        self.v2 = (int(x2), int(y2))
        self.v3 = (int(x3), int(y3))


def calcularTaxaX(x1, y1, x2, y2):
  difY = y2 - y1
  difX = x2 - x1
  taxaX = difX/difY
  return taxaX



# Função para desenhar uma linha
def draw_line(x1, y1, x2, y2):
    taxaX = calcularTaxaX(x1, y1, x2, y2)
    for i in range(x2):
        screen.set_at((round(x1), round(x2)), (255, 255, 255))
        x1 += taxaX

# Função para desenhar o triângulo
def draw_triangle(triangle):
    draw_line(triangle.v1[0], triangle.v1[1], triangle.v2[0], triangle.v2[1])
    draw_line(triangle.v1[0], triangle.v1[1], triangle.v3[0], triangle.v3[1])
    draw_line(triangle.v2[0], triangle.v2[1], triangle.v3[0], triangle.v3[1])

# Exemplo de uso da classe Triangulo
triangulo_exemplo = Triangulo(10, 10, 200, 40, 30, 200)




# Loop principal
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # Limpar a tela
    screen.fill((0, 0, 0))

    # Desenhar o triângulo
    draw_triangle(triangulo_exemplo)

    # Atualizar a tela
    pygame.display.update()
