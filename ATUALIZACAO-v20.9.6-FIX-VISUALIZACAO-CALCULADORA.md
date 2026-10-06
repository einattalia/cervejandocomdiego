# Ajuste da calculadora no admin — versão 20.9.6

- A seção da calculadora agora aparece no início de “Monte seu evento”, antes da lista de informativos e da galeria.
- Os campos abrem preenchidos com os valores padrão, mesmo quando a coluna de configuração ainda não existe no Supabase.
- A área carrega separadamente o conteúdo e os parâmetros da calculadora para evitar que a falta da migração esconda ou bloqueie os informativos.
- Execute `supabase-monte-seu-evento.sql` para salvar os parâmetros editados. Se a migração faltar, o admin informa isso ao tentar salvar.
