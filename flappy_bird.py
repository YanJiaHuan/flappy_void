import random
import sys

import pygame


WIDTH = 480
HEIGHT = 640
FPS = 60

BG_COLOR = (245, 245, 245)
BALL_COLOR = (220, 40, 40)
PIPE_COLOR = (20, 20, 20)
TEXT_COLOR = (20, 20, 20)

BG_IMG_PATH = "map.jpg"
BALL_IMG_PATH = "zm.jpg"
PIPE_TILE_PATH = "sld.jpg"

BALL_DIAMETER = 32
BALL_RADIUS = BALL_DIAMETER // 2
BALL_X = 120

GRAVITY = 900.0  # px/s^2
JUMP_VELOCITY = -300.0  # px/s
MAX_FALL_SPEED = 500.0

PIPE_TILE_SIZE = (48, 48)
PIPE_WIDTH = PIPE_TILE_SIZE[0]
PIPE_GAP = 170
PIPE_SPEED = 190.0  # px/s
PIPE_INTERVAL = 1.5  # seconds between pipes


class PipePair:
    def __init__(self, x, gap_y):
        self.x = x
        self.gap_y = gap_y
        self.passed = False

    def update(self, dt):
        self.x -= PIPE_SPEED * dt

    def offscreen(self):
        return self.x + PIPE_WIDTH < 0

    def rects(self):
        top_height = self.gap_y - PIPE_GAP // 2
        bottom_y = self.gap_y + PIPE_GAP // 2
        top_rect = pygame.Rect(self.x, 0, PIPE_WIDTH, top_height)
        bottom_rect = pygame.Rect(self.x, bottom_y, PIPE_WIDTH, HEIGHT - bottom_y)
        return top_rect, bottom_rect


def circle_rect_collision(cx, cy, radius, rect):
    closest_x = max(rect.left, min(cx, rect.right))
    closest_y = max(rect.top, min(cy, rect.bottom))
    dx = cx - closest_x
    dy = cy - closest_y
    return dx * dx + dy * dy <= radius * radius


def blit_tiled(surface, tile, rect):
    tile_w, tile_h = tile.get_size()
    left = int(rect.left)
    top = int(rect.top)
    right = int(rect.right)
    bottom = int(rect.bottom)
    for y in range(top, bottom, tile_h):
        h = min(tile_h, bottom - y)
        for x in range(left, right, tile_w):
            w = min(tile_w, right - x)
            if w == tile_w and h == tile_h:
                surface.blit(tile, (x, y))
            else:
                surface.blit(tile, (x, y), area=pygame.Rect(0, 0, w, h))


def build_cover_background(img, target_w, target_h):
    img_w, img_h = img.get_size()
    if img_w == 0 or img_h == 0:
        return None, (0, 0)
    scale = max(target_w / img_w, target_h / img_h)
    scaled_w = int(img_w * scale)
    scaled_h = int(img_h * scale)
    scaled = pygame.transform.smoothscale(img, (scaled_w, scaled_h))
    x = (target_w - scaled_w) // 2
    y = (target_h - scaled_h) // 2
    return scaled, (x, y)


def reset_state():
    ball_y = HEIGHT // 2
    ball_vy = 0.0
    pipes = []
    spawn_timer = 0.0
    score = 0
    alive = True
    return ball_y, ball_vy, pipes, spawn_timer, score, alive


def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("flappy_void")
    clock = pygame.time.Clock()
    font = pygame.font.SysFont("Arial", 32, bold=True)
    small_font = pygame.font.SysFont("Arial", 18)

    bg_surface = None
    bg_pos = (0, 0)
    try:
        bg_img = pygame.image.load(BG_IMG_PATH).convert()
        bg_surface, bg_pos = build_cover_background(bg_img, WIDTH, HEIGHT)
    except pygame.error:
        bg_surface = None

    try:
        ball_img = pygame.image.load(BALL_IMG_PATH).convert_alpha()
        ball_img = pygame.transform.smoothscale(ball_img, (BALL_DIAMETER, BALL_DIAMETER))
    except pygame.error as exc:
        raise SystemExit(f"Failed to load {BALL_IMG_PATH}: {exc}") from exc

    try:
        pipe_tile = pygame.image.load(PIPE_TILE_PATH).convert()
        pipe_tile = pygame.transform.smoothscale(pipe_tile, PIPE_TILE_SIZE)
    except pygame.error as exc:
        raise SystemExit(f"Failed to load {PIPE_TILE_PATH}: {exc}") from exc

    ball_y, ball_vy, pipes, spawn_timer, score, alive = reset_state()

    running = True
    while running:
        dt = clock.tick(FPS) / 1000.0

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    if alive:
                        ball_vy = JUMP_VELOCITY
                    else:
                        ball_y, ball_vy, pipes, spawn_timer, score, alive = reset_state()
                elif event.key == pygame.K_ESCAPE:
                    running = False

        if alive:
            ball_vy = min(ball_vy + GRAVITY * dt, MAX_FALL_SPEED)
            ball_y += ball_vy * dt

            spawn_timer += dt
            if spawn_timer >= PIPE_INTERVAL:
                spawn_timer = 0.0
                gap_center = random.randint(120, HEIGHT - 120)
                pipes.append(PipePair(WIDTH + 30, gap_center))

            for pipe in pipes:
                pipe.update(dt)

            pipes = [p for p in pipes if not p.offscreen()]

            for pipe in pipes:
                top_rect, bottom_rect = pipe.rects()
                if circle_rect_collision(BALL_X, int(ball_y), BALL_RADIUS, top_rect) or \
                        circle_rect_collision(BALL_X, int(ball_y), BALL_RADIUS, bottom_rect):
                    alive = False
                    break

                if not pipe.passed and pipe.x + PIPE_WIDTH < BALL_X:
                    pipe.passed = True
                    score += 1

            if ball_y - BALL_RADIUS <= 0 or ball_y + BALL_RADIUS >= HEIGHT:
                alive = False

        if bg_surface:
            screen.blit(bg_surface, bg_pos)
        else:
            screen.fill(BG_COLOR)

        for pipe in pipes:
            top_rect, bottom_rect = pipe.rects()
            blit_tiled(screen, pipe_tile, top_rect)
            blit_tiled(screen, pipe_tile, bottom_rect)

        screen.blit(
            ball_img,
            (BALL_X - BALL_RADIUS, int(ball_y) - BALL_RADIUS),
        )

        score_surf = font.render(str(score), True, TEXT_COLOR)
        score_rect = score_surf.get_rect(center=(WIDTH // 2, 40))
        screen.blit(score_surf, score_rect)

        if not alive:
            msg = small_font.render("Press SPACE to restart", True, TEXT_COLOR)
            msg_rect = msg.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 40))
            screen.blit(msg, msg_rect)

        pygame.display.flip()

    pygame.quit()
    sys.exit(0)


if __name__ == "__main__":
    main()
