# Secrets Necessários para GitHub Actions

## Secrets para Deploy S3 + CloudFront

Configure os seguintes secrets no repositório GitHub:

### Secrets AWS
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```
- Chaves de acesso da AWS com permissões para:
  - S3 (ler/escrever buckets)
  - CloudFront (invalidar cache)

### Secrets do Projeto
```
S3_BUCKET_NAME
```
- Nome do bucket S3 onde os arquivos estáticos serão hospedados
- Valor: `frontend-mes-195950944161-us-east-1-an`

```
CLOUDFRONT_DISTRIBUTION_ID
```
- ID da distribuição CloudFront
- Exemplo: `E1234567890ABC`

```
FRONTEND_DOMAIN
```
- Domínio completo do frontend
- Exemplo: `mes.suaempresa.com`

## Configuração de Permissões AWS

Crie uma IAM Policy com as permissões mínimas:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::frontend-mes-195950944161-us-east-1-an",
                "arn:aws:s3:::frontend-mes-195950944161-us-east-1-an/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation"
            ],
            "Resource": "*"
        }
    ]
}
```

## Configurar Secrets no GitHub

1. Vá para Settings → Secrets and variables → Actions
2. Clique em "New repository secret"
3. Adicione cada secret listado acima

## Workflow Trigger

O workflow será executado automaticamente:
- Em pushes para branch `main`
- Em pull requests para branch `main` (apenas testes)

Deploy completo apenas em pushes para `main`.
