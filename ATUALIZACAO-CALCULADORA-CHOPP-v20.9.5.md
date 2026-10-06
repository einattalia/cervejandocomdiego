# Calculadora automática de chopp — versão 20.9.5

## Experiência do cliente
- A estimativa é atualizada ao preencher o total de convidados, a duração, o perfil de consumo e a presença de outras bebidas alcoólicas.
- A quantidade de pessoas que beberão chopp é opcional; se ficar em branco, o cálculo considera todos os convidados.
- A página apresenta uma faixa estimada de litros e a conversão aproximada em copos. O número calculado é acrescentado à mensagem enviada pelo WhatsApp.

## Parâmetros editáveis no admin
- Consumo moderado, médio e alto em litros por pessoa por hora.
- Redução percentual quando também houver outras bebidas alcoólicas.
- Margem de variação mostrada ao cliente.
- Volume do copo usado na conversão.

Valores iniciais: 0,25 / 0,375 / 0,5 litro por pessoa por hora, redução de 20%, variação de 10% e copo de 300 ml. São referências ajustáveis, não uma garantia de consumo.

## Atualização do Supabase
Execute `supabase-monte-seu-evento.sql` no SQL Editor do projeto Supabase. O script adiciona a coluna JSONB `calculator_settings` com valores padrão, preservando os itens e as fotos já salvos. Depois, publique os arquivos deste pacote. O acesso público continua somente de leitura; gravações seguem restritas a administradores.
