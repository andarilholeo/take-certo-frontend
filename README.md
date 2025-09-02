# TakeCerto Frontend

Um projeto Next.js com TypeScript e TailwindCSS otimizado para dispositivos móveis (Mobile-First).

## 🚀 Características

- **Mobile-First Design**: Interface projetada primeiro para dispositivos móveis
- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior confiabilidade
- **TailwindCSS v4**: Framework CSS utilitário moderno
- **Componentes Reutilizáveis**: Biblioteca de componentes UI otimizada para touch
- **Navegação Responsiva**: Menu mobile com hamburger e navegação desktop
- **Acessibilidade**: Componentes com foco em acessibilidade

## 📱 Otimizações Mobile

### Touch Targets
- Botões com altura mínima de 44px (padrão Apple)
- Inputs otimizados para dispositivos touch
- Espaçamento adequado entre elementos clicáveis

### Performance
- CSS otimizado para dispositivos móveis
- Prevenção de zoom indesejado em iOS
- Smooth scrolling nativo
- Font rendering otimizado

### Responsividade
- Breakpoints mobile-first do TailwindCSS
- Grid system adaptável
- Tipografia responsiva
- Safe area para dispositivos com notch

## 🛠️ Tecnologias

- **Next.js 15.5.2** - Framework React
- **TypeScript** - Tipagem estática
- **TailwindCSS v4** - Framework CSS
- **React 19** - Biblioteca de interface
- **clsx + tailwind-merge** - Utilitários para classes CSS

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm, yarn, pnpm ou bun

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd TakeCertoFrontend

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── globals.css        # Estilos globais otimizados para mobile
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/
│   ├── layout/
│   │   └── MobileNav.tsx  # Navegação responsiva
│   └── ui/                # Componentes de interface
│       ├── Button.tsx     # Botão otimizado para touch
│       ├── Card.tsx       # Componente de card
│       └── Input.tsx      # Input otimizado para mobile
└── lib/
    └── utils.ts           # Utilitários e helpers
```

## 🎨 Componentes Disponíveis

### Button
Botão otimizado para touch com múltiplas variantes:
- `primary`, `secondary`, `outline`, `ghost`
- Tamanhos: `sm`, `md`, `lg`
- Suporte a `fullWidth`

### Input
Input otimizado para dispositivos móveis:
- Labels integrados
- Validação visual
- Altura mínima para touch
- Prevenção de zoom no iOS

### Card
Sistema de cards flexível:
- Variantes: `default`, `outlined`, `elevated`
- Componentes: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

### MobileNav
Navegação responsiva:
- Menu hamburger para mobile
- Navegação horizontal para desktop
- Transições suaves

## 🎯 Páginas

- **/** - Página inicial com apresentação do projeto
- **/login** - Página de autenticação
- **/register** - Página de registro
- **/dashboard** - Dashboard principal com salas do usuário

## 📱 Testando em Dispositivos Móveis

### Chrome DevTools
1. Abra as DevTools (F12)
2. Clique no ícone de dispositivo móvel
3. Selecione diferentes dispositivos para testar

### Teste em Dispositivo Real
1. Certifique-se de estar na mesma rede
2. Acesse `http://[seu-ip]:3000` no dispositivo móvel

## 🔧 Scripts Disponíveis

```bash
npm run dev           # Servidor de desenvolvimento
npm run build         # Build de produção
npm run start         # Servidor de produção
npm run lint          # Verificação de código
npm run check-backend # Verificar conectividade com backend
```

## 🚨 Troubleshooting

### Erro: "Failed to fetch" ou "Resposta inválida do servidor"

#### 1. **Verificar Backend**
```bash
# Verificar se o backend está rodando
npm run check-backend
```

#### 2. **Verificar Configuração**
No arquivo `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5134/api
```

#### 3. **Debug Tools**
Na página de login (`/login`), há ferramentas de debug que mostram:
- Status da conexão com o backend
- Logs detalhados das requisições
- Testes de conectividade

#### 4. **Estrutura Esperada da Resposta**
O frontend espera que o backend retorne no login:
```json
{
  "token": "jwt-token-aqui",
  "user": {
    "id": "user-id",
    "username": "nome-usuario",
    "email": "email@exemplo.com"
  }
}
```

#### 5. **Verificação Manual**
```bash
# Testar endpoint diretamente
curl -X POST http://localhost:5134/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"suasenha"}'
```

## 📚 Próximos Passos

- [ ] Implementar PWA (Progressive Web App)
- [ ] Adicionar testes unitários
- [ ] Configurar CI/CD
- [ ] Implementar dark mode
- [ ] Adicionar mais componentes UI
- [ ] Integração com backend

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
