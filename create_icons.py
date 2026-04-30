from PIL import Image, ImageDraw, ImageFont
import os

output_dir = r'd:\Desktop\Laws of Software Engineering\vue-app\public'

def create_icon(size, filename):
    img = Image.new('RGBA', (size, size), (92, 107, 192, 255))
    draw = ImageDraw.Draw(img)
    
    corner_radius = size // 6
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size-1, size-1], radius=corner_radius, fill=255)
    
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(img, mask=mask)
    
    draw = ImageDraw.Draw(result)
    
    try:
        font_size = int(size * 0.55)
        font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", font_size)
        except:
            font = ImageFont.load_default()
    
    text = "法"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - int(size * 0.05)
    
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    result.save(os.path.join(output_dir, filename))
    print(f"Created {filename}")

create_icon(192, 'pwa-192x192.png')
create_icon(512, 'pwa-512x512.png')

apple_img = Image.new('RGBA', (180, 180), (92, 107, 192, 255))
draw = ImageDraw.Draw(apple_img)

try:
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 100)
except:
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", 100)
    except:
        font = ImageFont.load_default()

text = "法"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (180 - text_width) // 2
y = (180 - text_height) // 2 - 10
draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
apple_img.save(os.path.join(output_dir, 'apple-touch-icon.png'))
print("Created apple-touch-icon.png")

favicon = Image.new('RGBA', (32, 32), (92, 107, 192, 255))
draw = ImageDraw.Draw(favicon)
try:
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 22)
except:
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", 22)
    except:
        font = ImageFont.load_default()

text = "法"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (32 - text_width) // 2
y = (32 - text_height) // 2 - 2
draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
favicon.save(os.path.join(output_dir, 'favicon.ico'))
print("Created favicon.ico")

print("\nAll icons created successfully!")
