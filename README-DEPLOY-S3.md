# Deploy no S3 + CloudFront

## Arquivos Gerados para Deploy

O build estático gerou os seguintes arquivos na pasta `/out`:

### Estrutura de Arquivos
```
out/
├── _next/
│   ├── static/
│   │   ├── chunks/     # JavaScript bundle
│   │   └── css/        # Estilos CSS
│   └── ieHkjTj-vX1Zk_e7_rpwa/  # Build hash
├── 404.html            # Página de erro 404
├── index.html          # Página inicial
├── index.txt           # Sitemap
├── icon.ico            # Favicon
├── apontamentos/       # Páginas de apontamentos
├── dashboard/          # Página do dashboard
├── login/              # Páginas de login
├── manutencoes/        # Páginas de manutenções
├── maquinas/           # Páginas de máquinas
├── ordens-producao/    # Páginas de ordens de produção
├── setores/            # Páginas de setores
└── usuarios/           # Páginas de usuários
```

## Configuração S3 + CloudFront

### 1. Configurar Bucket S3
```bash
aws s3 mb s3://seu-bucket-name
aws s3 sync out/ s3://seu-bucket-name --delete
```

### 2. Configurar Política do Bucket
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::seu-bucket-name/*"
        }
    ]
}
```

### 3. Configurar CloudFront
- Origin: Bucket S3
- Viewer Protocol Policy: Redirect HTTP to HTTPS
- Custom Error Responses:
  - 403: 200, /404.html
  - 404: 200, /404.html

### 4. Deploy Automatizado
```bash
# Script de deploy
#!/bin/bash
npm run build
aws s3 sync out/ s3://seu-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Considerações Importantes

✅ **Pronto para S3 + CloudFront**
- Build estático funcionou
- Todas as páginas geradas como HTML estático
- Assets otimizados e minificados

⚠️ **Limitações**
- API calls serão feitas diretamente do cliente
- Autenticação via localStorage
- Sem server-side rendering

🔧 **Variáveis de Ambiente**
Configure `NEXT_PUBLIC_API_URL` no ambiente de produção para apontar para sua API.
