# 🚀 Deploy do TakeCerto Frontend

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Vercel (gratuita)
- API backend rodando em servidor público

## 🔧 Configuração para Deploy

### 1. Preparar o Repositório

```bash
# Adicionar arquivos ao git
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 2. Deploy no Vercel

#### Opção A: Via Dashboard
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique "New Project"
4. Selecione seu repositório
5. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_API_BASE_URL`: URL da sua API

#### Opção B: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_API_BASE_URL
```

### 3. Configurar Variáveis de Ambiente

No dashboard do Vercel:
- Settings → Environment Variables
- Adicionar: `NEXT_PUBLIC_API_BASE_URL`
- Valor: URL da sua API (ex: `https://sua-api.herokuapp.com/api`)

### 4. Deploy Automático

Após configuração inicial:
- Todo push para `main` → deploy automático
- Pull requests → preview deployments
- Rollback fácil via dashboard

## 🌐 Alternativas de Deploy

### Netlify
1. Conecte repositório GitHub
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Configure variáveis de ambiente

### GitHub Pages (Limitado)
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar script no package.json
"scripts": {
  "deploy": "gh-pages -d .next"
}

# Deploy
npm run build
npm run deploy
```

## 🔒 Configurações de Segurança

### CORS na API
Sua API precisa permitir requests do domínio do frontend:

```csharp
// No backend C#
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("https://seu-app.vercel.app")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});
```

### Variáveis de Ambiente
- Nunca commitar `.env.local`
- Usar apenas `NEXT_PUBLIC_` para variáveis do cliente
- Configurar no dashboard do provedor

## 📱 Domínio Personalizado

### Vercel
1. Settings → Domains
2. Adicionar domínio
3. Configurar DNS

### Netlify
1. Domain settings
2. Add custom domain
3. Configure DNS records

## 🔍 Monitoramento

### Analytics (Vercel)
- Analytics automático
- Core Web Vitals
- Performance insights

### Logs
- Function logs no dashboard
- Error tracking
- Performance monitoring

## 🚀 Otimizações para Produção

### Next.js
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  images: {
    domains: ['takecerto-images-s3.s3.amazonaws.com'],
  },
  experimental: {
    optimizeCss: true,
  }
}
```

### Performance
- Imagens otimizadas automaticamente
- Code splitting automático
- CDN global
- Caching inteligente

## 🔧 Troubleshooting

### Erro de Build
```bash
# Limpar cache
rm -rf .next
npm run build
```

### Erro de API
- Verificar CORS
- Verificar URL da API
- Verificar variáveis de ambiente

### Erro de Roteamento
- Verificar `vercel.json`
- Configurar rewrites se necessário

## 📊 Status do Deploy

✅ Frontend pronto para deploy
✅ Configurações de produção
✅ Otimizações implementadas
✅ Segurança configurada

## 🎯 Próximos Passos

1. **Fazer push** do código para GitHub
2. **Conectar** repositório no Vercel
3. **Configurar** variáveis de ambiente
4. **Testar** deploy
5. **Configurar** domínio personalizado (opcional)

## 💡 Dicas

- Use preview deployments para testar
- Configure branch protection rules
- Monitore performance regularmente
- Mantenha dependências atualizadas
