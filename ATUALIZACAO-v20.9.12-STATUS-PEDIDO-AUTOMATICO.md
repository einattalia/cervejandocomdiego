# Atualização v20.9.12 — status do pedido automático no admin

- O webhook já altera o status para “Pago” quando o Stripe confirma o pagamento.
- A lista de pedidos e o pedido aberto no admin agora atualizam automaticamente a cada 15 segundos enquanto a tela de pedidos estiver aberta.
- Ao abrir a tela de pedidos, uma atualização é feita imediatamente.
- Alterações de status digitadas pelo administrador não são sobrescritas durante a atualização automática.
- Não exige mudança no banco/Supabase.
