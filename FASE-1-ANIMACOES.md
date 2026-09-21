# Fase 1 — Motion System

Implementado sem alterar Supabase, Stripe, admin ou estrutura de dados.

- Entrada cinematográfica do hero com GSAP.
- Parallax sutil da geladeira no desktop com ScrollTrigger.
- Header com transição ao rolar.
- Reveals progressivos nas seções.
- Cards com entrada escalonada e tilt sutil no desktop.
- Microinteração nos botões (ripple).
- Feedback do carrinho: contador com pop + toast.
- Cursor contextual no desktop: VER RÓTULO / CONHECER / DIEGÃO / PARTIU?.
- Navegação ativa acompanha a seção visível.
- `prefers-reduced-motion` respeitado.
- Interações pesadas desativadas em touch/mobile.

Arquivos novos:
- `assets/animations/phase1.css`
- `assets/animations/phase1.js`

Biblioteca externa:
- GSAP 3.13.0 + ScrollTrigger via jsDelivr.
