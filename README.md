# 🚀 Deploy na Vercel - Guia de Correção

Este projeto foi configurado para resolver problemas comuns de deploy na Vercel, especialmente relacionados ao erro `E503` do npm registry.

## ✅ Correções Implementadas

### 1. Configuração NPM (.npmrc)
- Registry configurado com retry automático
- Timeout otimizado para conexões lentas
- Cache desabilitado para evitar conflitos

### 2. Package.json Otimizado
- Overrides para `unbox-primitive` versão estável
- Engines especificados para Node.js e npm
- Scripts de postinstall para diagnóstico

### 3. Vercel.json
- Comando de build customizado com `--legacy-peer-deps`
- Variáveis de ambiente otimizadas
- Timeout configurado para funções

### 4. Next.js Otimizado
- Webpack configurado para resolver dependências
- Transpile de pacotes Supabase
- Headers de segurança implementados

## 🔧 Como Fazer Deploy

### Opção 1: Deploy Automático (Recomendado)
1. Faça push do código para seu repositório Git
2. Conecte o repositório na Vercel
3. O deploy será feito automaticamente com as configurações otimizadas

### Opção 2: Deploy Manual via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel --prod
```

## 🛠️ Solução de Problemas

### Se o erro E503 persistir:
1. Aguarde alguns minutos (problema temporário do npm registry)
2. Tente fazer redeploy na Vercel
3. Use o script de build alternativo: `bash build.sh`

### Comandos de Diagnóstico:
```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Testar build local
npm run build
```

## 📋 Checklist de Deploy

- ✅ Arquivo .npmrc configurado
- ✅ Package.json com overrides
- ✅ Vercel.json otimizado
- ✅ Next.config.js configurado
- ✅ PostCSS configurado corretamente
- ✅ Dependências instaladas com sucesso

## 🔗 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Troubleshooting Next.js](https://nextjs.org/docs/messages)
- [NPM Registry Status](https://status.npmjs.org/)

---

**Nota**: Este projeto usa Next.js 15 com React 19 e Tailwind CSS v4. Todas as configurações foram otimizadas para máxima compatibilidade com a Vercel.