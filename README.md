# Microsserviço de Geração de Imagens

Microsserviço serverless de processamento de imagens na Vercel usando Next.js 14, Sharp 0.32.6 e @napi-rs/canvas 0.1.58.

## 🚀 Deploy Rápido na Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Angel0Cavallar0/image-processing-microservice)

**IMPORTANTE**: Após o deploy, você precisa baixar as fontes Roboto:
```bash
curl -L -o fonts/Roboto-Regular.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf"
curl -L -o fonts/Roboto-Bold.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Bold.ttf"
```

## Características

- ✅ 6 endpoints REST para processamento de imagens
- ✅ Redimensionar, adicionar texto, combinar imagens
- ✅ Templates de marketing prontos
- ✅ Pipeline de operações em sequência
- ✅ Validação de inputs e tratamento de erros
- ✅ Otimizado para Vercel (3008MB memory, 30s timeout)
- ✅ Região gru1 (São Paulo) - baixa latência para Brasil

## Tecnologias

- **Next.js 14.2.18** - Framework React para serverless
- **Sharp 0.32.6** - Processamento de imagens de alta performance
- **@napi-rs/canvas 0.1.58** - Renderização de texto e desenhos
- **Vercel** - Deploy serverless

## Instalação Local

```bash
# Clone o repositório
git clone https://github.com/Angel0Cavallar0/image-processing-microservice.git
cd image-processing-microservice

# Baixar fontes Roboto
mkdir -p fonts
curl -L -o fonts/Roboto-Regular.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf"
curl -L -o fonts/Roboto-Bold.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Bold.ttf"

# Instalar dependências
npm install

# Rodar localmente
npm run dev
```

Acesse http://localhost:3000

## Endpoints Disponíveis

Acesse a URL do seu deploy + `/api/health` para verificar se está funcionando.

Exemplo: `https://seu-projeto.vercel.app/api/health`

### Documentação Completa dos Endpoints

Consulte o [ENDPOINTS.md](./ENDPOINTS.md) para documentação detalhada de todos os 6 endpoints com exemplos de uso.

**Resumo:**
- `GET /api/health` - Health check
- `POST /api/process/resize` - Redimensionar imagem
- `POST /api/process/add-text` - Adicionar texto
- `POST /api/process/composite` - Combinar imagens
- `POST /api/templates/marketing` - Gerar template de marketing
- `POST /api/pipeline` - Executar múltiplas operações

## Exemplo de Uso

```bash
# Health check
curl https://seu-projeto.vercel.app/api/health

# Gerar template de marketing
curl -X POST https://seu-projeto.vercel.app/api/templates/marketing \
  -H "Content-Type: application/json" \
  -d '{
    "title": "SUPER PROMOÇÃO",
    "subtitle": "50% OFF",
    "width": 1200,
    "height": 630
  }'
```

## Limites e Validações

- Tamanho máximo: 5MB por imagem
- Dimensões: 10px a 4096px
- Máximo 10 camadas em composite
- Máximo 20 operações em pipeline
- Formatos: JPEG, PNG, WebP

## Troubleshooting

### Fontes não encontradas
Se você vir erros sobre fontes, certifique-se de ter baixado os arquivos `.ttf` na pasta `fonts/`.

### Sharp falha no deploy
O projeto usa Sharp 0.32.6 (última versão compatível com Vercel). Se houver problemas:
```bash
npm install sharp@0.32.6 --save-exact
vercel --prod --force
```

### Timeout (504)
- Plano Hobby: 10s timeout
- Plano Pro: 60s timeout (recomendado para imagens grandes)

## Estrutura do Projeto

```
├── package.json              # Dependências
├── vercel.json               # Config Vercel (3008MB, 30s, gru1)
├── pages/
│   ├── index.js              # Página inicial
│   └── api/                  # Endpoints
│       ├── health.js
│       ├── pipeline.js
│       ├── process/
│       │   ├── resize.js
│       │   ├── add-text.js
│       │   └── composite.js
│       └── templates/
│           └── marketing.js
├── lib/                      # Utilitários
│   ├── constants.js
│   ├── validators.js
│   ├── error-handler.js
│   ├── sharp-utils.js
│   └── canvas-utils.js
└── fonts/                    # Fontes TTF
    ├── Roboto-Regular.ttf
    └── Roboto-Bold.ttf
```

## Licença

MIT

## Links Úteis

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do Sharp](https://sharp.pixelplumbing.com/)
- [Fontes Google](https://fonts.google.com/specimen/Roboto)

---

# 📖 Documentação da API de Processamento de Imagens

API serverless para processamento e manipulação de imagens hospedada na Vercel.

**URL Base**: `https://image-processing-microservice.vercel.app`

---

## 📋 Índice

1. [Como Enviar Imagens](#como-enviar-imagens)
2. [Endpoints Disponíveis](#endpoints-disponíveis)
3. [Exemplos de Uso](#exemplos-de-uso)
4. [Códigos de Erro](#códigos-de-erro)
5. [Limites e Restrições](#limites-e-restrições)
6. [Integração com n8n](#integração-com-n8n)

---

## 🖼️ Como Enviar Imagens

Todas as imagens devem ser enviadas no formato **Base64** com o prefixo Data URI.

### Formato Aceito

```
data:image/[tipo];base64,[dados-base64]
```

**Exemplos:**
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBg...
```

### Como Converter uma Imagem para Base64

#### 1. Usando Bash (Linux/Mac)

```bash
# Converter imagem para base64 com prefixo
echo "data:image/jpeg;base64,$(base64 -w 0 imagem.jpg)"

# Salvar em variável
IMAGE_BASE64="data:image/jpeg;base64,$(base64 -w 0 imagem.jpg)"
```

#### 2. Usando Node.js

```javascript
const fs = require('fs');

// Ler arquivo e converter para base64
const imageBuffer = fs.readFileSync('imagem.jpg');
const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

console.log(imageBase64);
```

#### 3. Usando Python

```python
import base64

# Ler arquivo e converter para base64
with open('imagem.jpg', 'rb') as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    image_base64 = f'data:image/jpeg;base64,{encoded_string}'

print(image_base64)
```

#### 4. Online (Para Testes)

- https://base64.guru/converter/encode/image
- https://www.base64-image.de/

---

## 🔌 Endpoints Disponíveis

### 1. Health Check

**Endpoint**: `GET /api/health`

Verifica o status da API e dependências.

**Resposta:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-26T13:41:55.752Z",
  "dependencies": {
    "sharp": "8.14.5",
    "canvas": "installed"
  },
  "endpoints": [...]
}
```

---

### 2. Redimensionar Imagem

**Endpoint**: `POST /api/process/resize`

Redimensiona uma imagem para novas dimensões.

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `image` | string | ✅ | Imagem em base64 |
| `width` | number | ✅ | Largura desejada (10-4096px) |
| `height` | number | ✅ | Altura desejada (10-4096px) |
| `fit` | string | ❌ | Modo de ajuste: `cover`, `contain`, `fill`, `inside`, `outside` (padrão: `cover`) |
| `format` | string | ❌ | Formato de saída: `jpeg`, `png`, `webp` (padrão: `jpeg`) |
| `quality` | number | ❌ | Qualidade 1-100 (padrão: 85) |

**Exemplo de Request:**

```bash
curl -X POST https://image-processing-microservice.vercel.app/api/process/resize \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "width": 800,
    "height": 600,
    "fit": "cover",
    "format": "jpeg",
    "quality": 90
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "width": 800,
    "height": 600,
    "format": "jpeg"
  }
}
```

---

### 3. Adicionar Texto

**Endpoint**: `POST /api/process/add-text`

Adiciona texto sobre uma imagem.

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `image` | string | ✅ | Imagem em base64 |
| `text` | object | ✅ | Configuração do texto (ver abaixo) |
| `format` | string | ❌ | Formato de saída (padrão: `jpeg`) |
| `quality` | number | ❌ | Qualidade 1-100 (padrão: 85) |

**Objeto `text`:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `text` | string | ✅ | Texto a ser adicionado |
| `x` | number | ✅ | Posição horizontal (pixels) |
| `y` | number | ✅ | Posição vertical (pixels) |
| `fontSize` | number | ❌ | Tamanho da fonte (padrão: 48) |
| `fontFamily` | string | ❌ | Fonte: `Roboto-Regular`, `Roboto-Bold` (padrão: `Roboto-Regular`) |
| `color` | string | ❌ | Cor em hexadecimal (padrão: `#FFFFFF`) |

**Exemplo de Request:**

```bash
curl -X POST https://image-processing-microservice.vercel.app/api/process/add-text \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "text": {
      "text": "PROMOÇÃO 50% OFF",
      "x": 100,
      "y": 200,
      "fontSize": 72,
      "fontFamily": "Roboto-Bold",
      "color": "#FF0000"
    },
    "format": "jpeg",
    "quality": 90
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "format": "jpeg"
  }
}
```

---

### 4. Combinar Imagens (Composite)

**Endpoint**: `POST /api/process/composite`

Combina múltiplas imagens em camadas (até 10 camadas).

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `baseImage` | string | ✅ | Imagem de base em base64 |
| `layers` | array | ✅ | Array de camadas (ver abaixo) |
| `format` | string | ❌ | Formato de saída (padrão: `jpeg`) |
| `quality` | number | ❌ | Qualidade 1-100 (padrão: 85) |

**Objeto `layer`:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `image` | string | ✅ | Imagem da camada em base64 |
| `x` | number | ✅ | Posição horizontal |
| `y` | number | ✅ | Posição vertical |

**Exemplo de Request:**

```bash
curl -X POST https://image-processing-microservice.vercel.app/api/process/composite \
  -H "Content-Type: application/json" \
  -d '{
    "baseImage": "data:image/jpeg;base64,/9j/4AAQ...",
    "layers": [
      {
        "image": "data:image/png;base64,iVBORw0KG...",
        "x": 50,
        "y": 50
      },
      {
        "image": "data:image/png;base64,iVBORw0KG...",
        "x": 200,
        "y": 100
      }
    ],
    "format": "jpeg",
    "quality": 90
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "format": "jpeg",
    "layersCount": 2
  }
}
```

---

### 5. Template de Marketing

**Endpoint**: `POST /api/templates/marketing`

Gera um template pronto de marketing com gradiente, título, subtítulo e logo opcional.

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | ❌ | Título principal |
| `subtitle` | string | ❌ | Subtítulo |
| `logo` | string | ❌ | Logo em base64 (será redimensionado para 200x200) |
| `gradientColors` | array | ❌ | Array com 2 cores hex (padrão: `["#4A90E2", "#8E2DE2"]`) |
| `width` | number | ❌ | Largura (padrão: 1200) |
| `height` | number | ❌ | Altura (padrão: 630) |
| `format` | string | ❌ | Formato de saída (padrão: `jpeg`) |
| `quality` | number | ❌ | Qualidade 1-100 (padrão: 90) |

**Exemplo de Request:**

```bash
curl -X POST https://image-processing-microservice.vercel.app/api/templates/marketing \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MEGA PROMOÇÃO",
    "subtitle": "50% de Desconto em Todos os Produtos",
    "logo": "data:image/png;base64,iVBORw0KG...",
    "gradientColors": ["#FF6B6B", "#4ECDC4"],
    "width": 1200,
    "height": 630,
    "format": "jpeg",
    "quality": 95
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "width": 1200,
    "height": 630,
    "format": "jpeg"
  }
}
```

---

### 6. Pipeline de Operações

**Endpoint**: `POST /api/pipeline`

Executa múltiplas operações em sequência (até 20 operações).

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `baseImage` | string | ✅ | Imagem inicial em base64 |
| `steps` | array | ✅ | Array de operações (ver abaixo) |
| `format` | string | ❌ | Formato final (padrão: `jpeg`) |
| `quality` | number | ❌ | Qualidade final 1-100 (padrão: 85) |

**Operações disponíveis em `steps`:**

1. **Resize:**
```json
{
  "op": "resize",
  "width": 800,
  "height": 600,
  "fit": "cover"
}
```

2. **Add Text:**
```json
{
  "op": "add-text",
  "text": {
    "text": "NOVIDADE",
    "x": 50,
    "y": 50,
    "fontSize": 64,
    "color": "#FFFFFF"
  }
}
```

3. **Composite:**
```json
{
  "op": "composite",
  "layers": [
    {
      "image": "data:image/png;base64,...",
      "x": 100,
      "y": 100
    }
  ]
}
```

**Exemplo de Request:**

```bash
curl -X POST https://image-processing-microservice.vercel.app/api/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "baseImage": "data:image/jpeg;base64,/9j/4AAQ...",
    "steps": [
      {
        "op": "resize",
        "width": 1000,
        "height": 1000,
        "fit": "cover"
      },
      {
        "op": "add-text",
        "text": {
          "text": "LANÇAMENTO",
          "x": 100,
          "y": 50,
          "fontSize": 80,
          "fontFamily": "Roboto-Bold",
          "color": "#FFD700"
        }
      },
      {
        "op": "composite",
        "layers": [
          {
            "image": "data:image/png;base64,iVBORw0KG...",
            "x": 800,
            "y": 800
          }
        ]
      }
    ],
    "format": "jpeg",
    "quality": 95
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "format": "jpeg",
    "stepsExecuted": 3
  }
}
```

---

## 📋 Exemplos Práticos

### Exemplo 1: Redimensionar Imagem Local

```bash
#!/bin/bash

# Converter imagem para base64
IMAGE_BASE64="data:image/jpeg;base64,$(base64 -w 0 minha-foto.jpg)"

# Fazer request
curl -X POST https://image-processing-microservice.vercel.app/api/process/resize \
  -H "Content-Type: application/json" \
  -d "{
    \"image\": \"$IMAGE_BASE64\",
    \"width\": 500,
    \"height\": 500,
    \"fit\": \"cover\",
    \"format\": \"jpeg\",
    \"quality\": 85
  }" | jq -r '.data.image' | sed 's/data:image\/jpeg;base64,//' | base64 -d > imagem-redimensionada.jpg

echo "Imagem salva em: imagem-redimensionada.jpg"
```

### Exemplo 2: Adicionar Texto em Node.js

```javascript
const fs = require('fs');
const axios = require('axios');

async function addTextToImage() {
  // Ler imagem e converter para base64
  const imageBuffer = fs.readFileSync('produto.jpg');
  const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  // Fazer request
  const response = await axios.post(
    'https://image-processing-microservice.vercel.app/api/process/add-text',
    {
      image: imageBase64,
      text: {
        text: 'OFERTA ESPECIAL',
        x: 50,
        y: 100,
        fontSize: 72,
        fontFamily: 'Roboto-Bold',
        color: '#FF0000'
      },
      format: 'jpeg',
      quality: 90
    }
  );

  // Salvar imagem resultante
  const resultBase64 = response.data.data.image.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync('produto-com-texto.jpg', Buffer.from(resultBase64, 'base64'));

  console.log('Imagem salva com sucesso!');
}

addTextToImage();
```

### Exemplo 3: Template de Marketing em Python

```python
import base64
import requests
import json

def create_marketing_template():
    # Ler logo
    with open('logo.png', 'rb') as f:
        logo_base64 = f'data:image/png;base64,{base64.b64encode(f.read()).decode()}'

    # Fazer request
    response = requests.post(
        'https://image-processing-microservice.vercel.app/api/templates/marketing',
        json={
            'title': 'BLACK FRIDAY',
            'subtitle': 'Até 70% de Desconto',
            'logo': logo_base64,
            'gradientColors': ['#000000', '#434343'],
            'width': 1200,
            'height': 630,
            'format': 'jpeg',
            'quality': 95
        }
    )

    # Salvar resultado
    result = response.json()
    image_base64 = result['data']['image'].replace('data:image/jpeg;base64,', '')

    with open('banner-black-friday.jpg', 'wb') as f:
        f.write(base64.b64decode(image_base64))

    print('Banner criado com sucesso!')

create_marketing_template()
```

---

## ⚠️ Códigos de Erro

### Estrutura de Erro

```json
{
  "success": false,
  "error": {
    "code": "CODIGO_ERRO",
    "message": "Descrição do erro"
  }
}
```

### Códigos Possíveis

| Código | Status HTTP | Descrição |
|--------|-------------|-----------|
| `INVALID_INPUT` | 400 | Entrada inválida (base64 inválido, parâmetros faltando) |
| `IMAGE_TOO_LARGE` | 413 | Imagem excede 5MB |
| `INVALID_DIMENSION` | 400 | Dimensões fora do limite (10-4096px) |
| `INVALID_FORMAT` | 400 | Formato não suportado |
| `TOO_MANY_LAYERS` | 400 | Mais de 10 camadas no composite |
| `TOO_MANY_STEPS` | 400 | Mais de 20 operações no pipeline |
| `INVALID_OPERATION` | 400 | Operação inválida no pipeline |
| `PROCESSING_ERROR` | 500 | Erro ao processar imagem |
| `TIMEOUT` | 504 | Operação excedeu 25 segundos |
| `MISSING_PARAMETER` | 400 | Parâmetro obrigatório ausente |

---

## 📏 Limites e Restrições

### Limites Globais

| Recurso | Limite |
|---------|--------|
| Tamanho máximo da imagem | 5 MB |
| Dimensões mínimas | 10px × 10px |
| Dimensões máximas | 4096px × 4096px |
| Camadas no composite | 10 camadas |
| Operações no pipeline | 20 operações |
| Timeout da função | 30 segundos |
| Memória alocada | 2000 MB |
| Região do servidor | gru1 (São Paulo) |

### Formatos Suportados

**Entrada:**
- JPEG/JPG
- PNG
- WebP

**Saída:**
- JPEG (padrão, qualidade 85)
- PNG (compressão nível 6)
- WebP (qualidade 85)

### Fontes Disponíveis

- `Roboto-Regular` (padrão)
- `Roboto-Bold`

---

## 🔗 Integração com n8n

### Exemplo: Workflow de Redimensionamento

1. **HTTP Request Node**

Configure:
- **Method**: POST
- **URL**: `https://image-processing-microservice.vercel.app/api/process/resize`
- **Authentication**: None
- **Body Content Type**: JSON

**Body:**
```json
{
  "image": "{{ $json.image_base64 }}",
  "width": 800,
  "height": 600,
  "fit": "cover",
  "format": "jpeg",
  "quality": 90
}
```

2. **Receber Resultado**

A resposta estará em `$json.data.image` contendo a imagem processada em base64.

### Exemplo: Template de Marketing Automático

**Cenário**: Criar banner de promoção toda segunda-feira.

1. **Schedule Trigger** - Toda segunda-feira às 9h
2. **Set Node** - Define título e subtítulo da promoção
3. **Read Binary File** - Lê logo da empresa
4. **Function Node** - Converte logo para base64
5. **HTTP Request** - Chama `/api/templates/marketing`
6. **Function Node** - Decodifica base64 para binário
7. **Write Binary File** - Salva banner gerado

---

## 💡 Dicas e Boas Práticas

### Performance

1. **Otimize o tamanho antes de enviar**
   - Reduza a qualidade da imagem original se possível
   - Use WebP para melhor compressão

2. **Use o formato adequado**
   - JPEG para fotos (menor tamanho)
   - PNG para imagens com transparência
   - WebP para melhor qualidade/tamanho

3. **Pipeline vs Múltiplas Requests**
   - Use pipeline quando precisar de várias operações
   - Economiza tempo de transferência de dados

### Qualidade

1. **Qualidade JPEG**
   - 85-90: Boa qualidade para web
   - 90-95: Alta qualidade para impressão
   - 95-100: Qualidade máxima (arquivos grandes)

2. **Fit Modes**
   - `cover`: Preenche toda a área (pode cortar)
   - `contain`: Mantém proporção (pode ter bordas)
   - `fill`: Estica a imagem (pode distorcer)

### Segurança

1. **Valide antes de enviar**
   - Verifique tamanho < 5MB
   - Valide formato da imagem
   - Sanitize inputs de texto

2. **Tratamento de Erros**
   - Sempre verifique `success: true` na resposta
   - Implemente retry para erros 5xx
   - Exiba mensagens amigáveis ao usuário

---

## 📞 Suporte

**GitHub**: https://github.com/Angel0Cavallar0/image-processing-microservice

**Issues**: https://github.com/Angel0Cavallar0/image-processing-microservice/issues

---

## 📄 Licença

Este projeto está disponível sob licença MIT.

---

**Versão da API**: 1.0.0
**Última Atualização**: 2026-01-26

