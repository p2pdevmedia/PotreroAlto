#!/bin/bash

mkdir -p subsector_images
cd subsector_images || exit

download () {
  name="$1"
  url="$2"

  # normalizar nombre
  file=$(echo "$name" \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/[áàä]/a/g;s/[éèë]/e/g;s/[íìï]/i/g;s/[óòö]/o/g;s/[úùü]/u/g;s/ñ/n/g' \
    | sed 's/[ \/]/-/g')

  echo "⬇️  $file.webp"
  curl -L "$url" -o "$file.webp"
}

download "la chanchería" "https://videos.openai.com/az/vg-assets/task_01kjr7njtfe2qbcdm2tfqbcjte%2F1772487378_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=qErrSv27kQKSsZR0RyGibAyWuAItM9acUvdMZIn72TE%3D&ac=oaivgprodscus2"

download "cheto / pared este" "https://videos.openai.com/az/vg-assets/task_01kjr7pvhbej1vs1tbe5vb6368%2F1772487421_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=MO0gcLygn4jljZzHYBn5hZWQz5wPXu0kp/xACbr6R70%3D&ac=oaivgprodscus2"

download "croto" "https://videos.openai.com/az/vg-assets/task_01kjr7q6vre89bper3vp0b1s2h%2F1772487432_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=ayAihqZghPfDdQfHZGsHbxGYrQ4XntJ/%2BqjDYvH2RZE%3D&ac=oaivgprodscus2"

download "el arco" "https://videos.openai.com/az/vg-assets/task_01kjr7s21ge2drfqwcyt9sqdqv%2F1772487491_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=mjg%2B7AUiRzU1Y0Zzq/GSBY4nK/EVfSpZS597CTIf%2BUs%3D&ac=oaivgprodscus2"

download "el tablero" "https://videos.openai.com/az/vg-assets/task_01kjr80p7ee78amdxkshsc6dyh%2F1772487754_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=jT6mENgiCODGEBMo2QNR1fTleiZ9MwtHXmCoyuSxbfc%3D&ac=oaivgprodscus2"

download "cañadón" "https://videos.openai.com/az/vg-assets/task_01kjr819adet4rnc6hte1p3ent%2F1772487784_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=ALb7mHPqAMB/zHgGaEPaK4fTVaOOxZUuhFq/wSsyjOM%3D&ac=oaivgprodscus2"

download "el derrumbe" "https://videos.openai.com/az/vg-assets/task_01kjr8tt0reqg8gnc14tkmtdgx%2F1772488627_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=g35vAsdXdOupQW7/Mgi%2BdyAzrBKNWtYiZuFmGsZ%2BqY4%3D&ac=oaivgprodscus2"

echo "✅ Descarga completa"
