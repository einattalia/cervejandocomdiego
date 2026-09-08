/*
  CERVEJANDO COM DIEGO — CATÁLOGO
  ===============================
  Fallback local do catálogo. O Supabase é a fonte principal no site publicado.

  - Para ocultar uma cerveja: active: false
  - Para reativar: active: true
  - Para mudar a ordem: altere sortOrder
  - Para adicionar uma cerveja: copie um bloco existente e troque os dados
  - Coloque a imagem PNG em /assets e informe o caminho em card.image e detail.image

  Não altere index.html para tarefas comuns de catálogo.
*/
window.CERVEJANDO_BEERS = [
  {
    "id": "beer-0",
    "slug": "beer-0",
    "active": true,
    "sortOrder": 1,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "amargas",
      "intensas"
    ],
    "card": {
      "brand": "BREJÓLA",
      "name": "Double Ipa",
      "image": "assets/brejola-double-ipa.png",
      "alt": "BREJÓLA DOUBLE IPA",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "BREJÓLA — DOUBLE IPA",
      "subtitle": "Double IPA",
      "image": "assets/brejola-double-ipa.png",
      "imageAlt": "BREJÓLA — DOUBLE IPA",
      "style": "Double IPA",
      "brewery": "Brejó",
      "volume": "473 ml",
      "abv": "8% ABV",
      "ibu": "60",
      "hops": "Não divulgado",
      "description": "Uma Double IPA potente e intensamente lupulada, feita para quem busca uma experiência mais marcante. Traz corpo e amargor característicos do estilo, acompanhados pela força dos 8% de álcool.",
      "intensity": "🔴 Intensa",
      "bitterness": "🔴 Alto",
      "profile": "🌿 Lupulado • 🍊 Cítrico • 🌲 Resinoso",
      "goodFor": "já gosta de IPA e procura uma cerveja mais intensa, alcoólica e amarga.",
      "orderName": "BREJÓLA — DOUBLE IPA"
    }
  },
  {
    "id": "beer-1",
    "slug": "beer-1",
    "active": true,
    "sortOrder": 2,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "frutadas",
      "intensas"
    ],
    "card": {
      "brand": "BREJÓLA",
      "name": "New England Ipa",
      "image": "assets/brejola-neipa.png",
      "alt": "BREJÓLA NEW ENGLAND IPA",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "BREJÓLA — NEW ENGLAND IPA",
      "subtitle": "New England IPA",
      "image": "assets/brejola-neipa.png",
      "imageAlt": "BREJÓLA — NEW ENGLAND IPA",
      "style": "New England IPA",
      "brewery": "Brejó",
      "volume": "473 ml",
      "abv": "8% ABV",
      "ibu": "60",
      "hops": "Não divulgado",
      "description": "Uma IPA que aposta no lado aromático e suculento do lúpulo. O estilo New England costuma entregar corpo macio, turbidez característica e destaque para sensações frutadas, equilibrando a potência desta Brejóla.",
      "intensity": "🔴 Intensa",
      "bitterness": "🟡 Médio/alto",
      "profile": "🥭 Tropical • 🍊 Cítrico • 🌿 Lupulado",
      "goodFor": "gosta de IPA, mas prefere muito aroma e sabores frutados em vez de somente amargor.",
      "orderName": "BREJÓLA — NEW ENGLAND IPA"
    }
  },
  {
    "id": "beer-2",
    "slug": "beer-2",
    "active": true,
    "sortOrder": 3,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "especiais"
    ],
    "card": {
      "brand": "ZEV",
      "name": "Brown Porter Amburana",
      "image": "assets/zev-brown-porter.png",
      "alt": "ZEV BROWN PORTER AMBURANA",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "ZEV — BROWN PORTER AMBURANA",
      "subtitle": "Brown Porter com Amburana",
      "image": "assets/zev-brown-porter.png",
      "imageAlt": "ZEV — BROWN PORTER AMBURANA",
      "style": "Brown Porter com Amburana",
      "brewery": "ZEV",
      "volume": "473 ml",
      "abv": "5% ABV",
      "ibu": "16",
      "hops": "Não divulgado",
      "description": "Uma Porter escura e aromática que combina características de maltes torrados com a personalidade brasileira da amburana. Apresenta referências de café, chocolate, caramelo, baunilha e especiarias, criando uma cerveja complexa sem ser excessivamente alcoólica.",
      "intensity": "🟡 Média",
      "bitterness": "🟢 Baixo",
      "profile": "☕ Torrado • 🍫 Chocolate • 🍮 Caramelo • 🪵 Amadeirado",
      "goodFor": "gosta de café, chocolate e cervejas escuras, mas não quer começar por uma Stout extremamente pesada.",
      "orderName": "ZEV — BROWN PORTER AMBURANA"
    }
  },
  {
    "id": "beer-3",
    "slug": "beer-3",
    "active": true,
    "sortOrder": 4,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "frutadas",
      "intensas"
    ],
    "card": {
      "brand": "CROMA",
      "name": "Blade Runner",
      "image": "assets/croma-blade-runner.png",
      "alt": "CROMA BLADE RUNNER",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "CROMA — BLADE RUNNER",
      "subtitle": "Triple Juicy IPA",
      "image": "assets/croma-blade-runner.png",
      "imageAlt": "CROMA — BLADE RUNNER",
      "style": "Triple Juicy IPA",
      "brewery": "Croma",
      "volume": "473 ml",
      "abv": "9,5% ABV",
      "ibu": "Não divulgado",
      "hops": "Não divulgado",
      "description": "Uma IPA de respeito. A Blade Runner aposta em alta carga aromática, corpo e potência alcoólica, dentro da proposta das Juicy IPAs. Apesar dos 9,5%, seu perfil privilegia a sensação suculenta e frutada do lúpulo.",
      "intensity": "🔴 Muito intensa",
      "bitterness": "🟡 Médio/alto",
      "profile": "🥭 Tropical • 🍑 Frutado • 🍊 Cítrico • 🌿 Lupulado",
      "goodFor": "procura uma IPA extremamente aromática, encorpada e potente.",
      "orderName": "CROMA — BLADE RUNNER"
    }
  },
  {
    "id": "beer-4",
    "slug": "beer-4",
    "active": true,
    "sortOrder": 5,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "frutadas"
    ],
    "card": {
      "brand": "DÁDIVA",
      "name": "Ápice",
      "image": "assets/dadiva-apice.png",
      "alt": "DÁDIVA ÁPICE",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "DÁDIVA — ÁPICE",
      "subtitle": "New England IPA",
      "image": "assets/dadiva-apice.png",
      "imageAlt": "DÁDIVA — ÁPICE",
      "style": "New England IPA",
      "brewery": "Dádiva",
      "volume": "473 ml",
      "abv": "6% ABV",
      "ibu": "Não divulgado",
      "hops": "Não divulgado",
      "description": "Uma New England IPA moderna, aromática e suculenta. O protagonismo fica com as características frutadas do lúpulo, acompanhadas por corpo macio e uma percepção de amargor mais amigável que a encontrada em IPAs tradicionais.",
      "intensity": "🟡 Média",
      "bitterness": "🟡 Médio",
      "profile": "🥭 Tropical • 🍊 Cítrico • 🍑 Frutado",
      "goodFor": "quer entrar no mundo das IPAs por uma cerveja aromática e frutada, sem procurar amargor extremo.",
      "orderName": "DÁDIVA — ÁPICE"
    }
  },
  {
    "id": "beer-5",
    "slug": "beer-5",
    "active": true,
    "sortOrder": 6,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "amargas",
      "frutadas",
      "intensas"
    ],
    "card": {
      "brand": "DOGMA",
      "name": "Lover #2",
      "image": "assets/dogma-lover-2.png",
      "alt": "DOGMA LOVER #2",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "DOGMA — LOVER #2",
      "subtitle": "Hazy Double IPA",
      "image": "assets/dogma-lover-2.png",
      "imageAlt": "DOGMA — LOVER #2",
      "style": "Hazy Double IPA",
      "brewery": "Dogma",
      "volume": "473 ml",
      "abv": "8,3% ABV",
      "ibu": "Não divulgado",
      "hops": "Blend de 8 lúpulos — variedades não divulgadas",
      "description": "Uma Hazy Double IPA criada para colocar o lúpulo no centro da experiência. A combinação de oito lúpulos proporciona grande complexidade aromática, enquanto o estilo entrega corpo macio, aparência turva e caráter suculento.",
      "intensity": "🔴 Intensa",
      "bitterness": "🟡 Médio/alto",
      "profile": "🍊 Cítrico • 🥭 Tropical • 🌿 Herbal • 🌲 Resinoso",
      "goodFor": "é apaixonado por lúpulo e quer explorar uma IPA mais complexa, aromática e potente.",
      "orderName": "DOGMA — LOVER #2"
    }
  },
  {
    "id": "beer-6",
    "slug": "beer-6",
    "active": true,
    "sortOrder": 7,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "intensas",
      "especiais"
    ],
    "card": {
      "brand": "SALVADOR",
      "name": "Engesa Oil",
      "image": "assets/salvador-engesa-oil.png",
      "alt": "SALVADOR ENGESA OIL",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "SALVADOR — ENGESA OIL COCONUT STOUT EDITION",
      "subtitle": "Russian Imperial Stout com coco",
      "image": "assets/salvador-engesa-oil.png",
      "imageAlt": "SALVADOR — ENGESA OIL COCONUT STOUT EDITION",
      "style": "Russian Imperial Stout com coco",
      "brewery": "Salvador Brewing Co.",
      "volume": "350 ml",
      "abv": "10,5% ABV",
      "ibu": "Não divulgado",
      "hops": "Não divulgado",
      "description": "Uma Imperial Stout robusta e alcoólica que une o caráter torrado e encorpado do estilo às notas aromáticas e adocicadas do coco. É daquelas cervejas feitas para beber devagar e explorar cada gole.",
      "intensity": "🔴 Muito intensa",
      "bitterness": "🟡 Médio",
      "profile": "🍫 Chocolate • ☕ Café • 🥥 Coco • 🔥 Torrado",
      "goodFor": "gosta de cervejas escuras, encorpadas e complexas — especialmente quem curte chocolate, café e coco.",
      "orderName": "SALVADOR — ENGESA OIL COCONUT STOUT EDITION"
    }
  },
  {
    "id": "beer-8",
    "slug": "beer-8",
    "active": true,
    "sortOrder": 8,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "frutadas",
      "especiais"
    ],
    "card": {
      "brand": "GREENHOUSE",
      "name": "Annona Muricata",
      "image": "assets/greenhouse-annona.png",
      "alt": "GREENHOUSE ANNONA MURICATA",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "GREENHOUSE — ANNONA MURICATA",
      "subtitle": "Sour Ale",
      "image": "assets/greenhouse-annona.png",
      "imageAlt": "GREENHOUSE — ANNONA MURICATA",
      "style": "Sour Ale",
      "brewery": "Greenhouse Brewery",
      "volume": "473 ml",
      "abv": "Não legível na imagem enviada",
      "ibu": "Não divulgado",
      "hops": "Não divulgado",
      "description": "Uma Sour Ale que foge completamente do convencional, elaborada com graviola, cupuaçu e cacau. A combinação explora acidez, frutas brasileiras e diferentes camadas aromáticas, resultando em uma experiência bastante diferente de uma Lager ou IPA.",
      "intensity": "🟡 Média",
      "bitterness": "🟢 Muito baixo",
      "profile": "🍈 Frutado • 🍫 Cacau • 🍋 Ácido • 🌴 Tropical",
      "goodFor": "gosta de sabores ácidos, frutas tropicais ou simplesmente quer provar algo completamente diferente.",
      "orderName": "GREENHOUSE — ANNONA MURICATA"
    }
  },
  {
    "id": "beer-9",
    "slug": "beer-9",
    "active": true,
    "sortOrder": 9,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "amargas",
      "especiais"
    ],
    "card": {
      "brand": "GREENHOUSE",
      "name": "Cannabis Indica",
      "image": "assets/greenhouse-cannabis.png",
      "alt": "GREENHOUSE CANNABIS INDICA",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "GREENHOUSE — CANNABIS INDICA",
      "subtitle": "West Coast IPA",
      "image": "assets/greenhouse-cannabis.png",
      "imageAlt": "GREENHOUSE — CANNABIS INDICA",
      "style": "West Coast IPA",
      "brewery": "Greenhouse Brewery",
      "volume": "473 ml",
      "abv": "Não legível na imagem enviada",
      "ibu": "Não divulgado",
      "hops": "Não divulgado",
      "description": "Uma West Coast IPA de proposta ousada, explorando características herbais e resinosas que dialogam com a identidade visual e sensorial da Cannabis Indica. O estilo tende a apresentar final mais seco e amargor mais evidente que uma New England IPA.",
      "intensity": "🟡 Média/alta",
      "bitterness": "🔴 Alto",
      "profile": "🌿 Herbal • 🌲 Resinoso • 🍊 Cítrico • 🌱 Dank",
      "goodFor": "gosta das IPAs mais clássicas, secas, herbais e com amargor evidente.",
      "orderName": "GREENHOUSE — CANNABIS INDICA"
    }
  },
  {
    "id": "beer-10",
    "slug": "beer-10",
    "active": true,
    "sortOrder": 10,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "frutadas",
      "intensas"
    ],
    "card": {
      "brand": "STORMY",
      "name": "Double Meteor",
      "image": "assets/stormy-double-meteor.png",
      "alt": "STORMY DOUBLE METEOR",
      "signal": 3,
      "ariaLabel": "Ver detalhes da cerveja"
    },
    "detail": {
      "title": "STORMY — DOUBLE METEOR",
      "subtitle": "Double New England IPA",
      "image": "assets/stormy-double-meteor.png",
      "imageAlt": "STORMY — DOUBLE METEOR",
      "style": "Double New England IPA",
      "brewery": "Stormy Brewing Co.",
      "volume": "473 ml",
      "abv": "8,2% ABV",
      "ibu": "Não divulgado",
      "hops": "Não divulgado",
      "description": "Uma Double New England IPA potente, encorpada e focada na expressão aromática dos lúpulos. O estilo combina turbidez, textura macia e perfil suculento com os 8,2% de álcool, resultando em uma cerveja de bastante presença.",
      "intensity": "🔴 Intensa",
      "bitterness": "🟡 Médio/alto",
      "profile": "🥭 Tropical • 🍊 Cítrico • 🍑 Frutado • 🌿 Lupulado",
      "goodFor": "já curte NEIPAs e procura uma versão mais potente, encorpada e intensa.",
      "orderName": "STORMY — DOUBLE METEOR"
    }
  },
  {
    "id": "beer-7",
    "slug": "beer-7",
    "active": true,
    "sortOrder": 11,
    "price": null,
    "stockStatus": "in_stock",
    "tags": [
      "leve"
    ],
    "card": {
      "brand": "DOGMA — PILSEN",
      "name": "Pilsner",
      "image": "assets/dogma-pilsen.png",
      "alt": "DOGMA PILSEN",
      "signal": 1,
      "ariaLabel": "Ver DOGMA Pilsen"
    },
    "detail": {
      "title": "DOGMA — PILSEN",
      "subtitle": "Pilsner",
      "image": "assets/dogma-pilsen.png",
      "imageAlt": "DOGMA — PILSEN",
      "style": "Pilsner",
      "brewery": "Dogma",
      "volume": "473 ml",
      "abv": "4,5% ABV",
      "ibu": "Não divulgado",
      "hops": "Não divulgado",
      "description": "Uma cerveja clara, refrescante e fácil de beber. A proposta é entregar equilíbrio, final limpo e alta drinkability, mostrando que até um estilo conhecido do grande público pode ganhar uma interpretação artesanal de qualidade.",
      "intensity": "🟢 Leve",
      "bitterness": "🟢 Baixo",
      "profile": "🌾 Maltado • 🌿 Herbal • ❄️ Refrescante",
      "goodFor": "bebe Pilsen e Lager no dia a dia e quer experimentar uma cerveja artesanal sem partir diretamente para estilos intensos.",
      "orderName": "DOGMA — PILSEN"
    }
  }
];
