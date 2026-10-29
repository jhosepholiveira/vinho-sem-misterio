import type { Pairing } from "./types";

export const pairingCategories: Pairing["category"][] = [
  "Brasileiros",
  "Carnes",
  "Peixes e frutos do mar",
  "Massas e grãos",
  "Queijos e petiscos",
  "Doces",
];

export const pairings: Pairing[] = [
  { dish: "Carne de sol", category: "Brasileiros", wines: ["Syrah", "Malbec", "Tempranillo"], avoid: "Brancos muito leves, que somem diante do sal e da gordura.", why: "A intensidade da carne tende a funcionar com tintos de médio a alto corpo; fruta e taninos ajudam a equilibrar gordura e sal. Com manteiga de garrafa e macaxeira, vale preferir tintos menos amadeirados." },
  { dish: "Sururu", category: "Brasileiros", wines: ["Sauvignon Blanc", "Alvarinho", "Espumante Brut"], avoid: "Tintos tânicos, que podem deixar gosto metálico com o marisco.", why: "Acidez e frescor acompanham a salinidade e o leite de coco sem esconder a delicadeza do marisco." },
  { dish: "Escondidinho de carne de sol", category: "Brasileiros", wines: ["Merlot", "Tempranillo", "Chardonnay com barrica"], why: "O purê cremoso pede vinho com textura; um tinto macio acompanha a carne, e um Chardonnay amadeirado conversa com o queijo gratinado." },
  { dish: "Moqueca", category: "Brasileiros", wines: ["Gewürztraminer", "Chardonnay", "Rosé seco"], avoid: "Tintos muito tânicos com o dendê e o coentro.", why: "O dendê e o leite de coco pedem brancos com corpo e aroma; rosés secos também lidam bem com tomate e pimentão." },
  { dish: "Feijoada", category: "Brasileiros", wines: ["Carménère", "Tannat", "Espumante Brut"], why: "Tintos com boa estrutura enfrentam a gordura das carnes; um espumante bem seco limpa o paladar e é uma escolha surpreendente." },
  { dish: "Queijo coalho com melaço", category: "Brasileiros", wines: ["Moscatel espumante", "Riesling meio seco", "Porto Tawny"], why: "O toque doce do melaço pede vinho com alguma doçura; o sal do queijo cria contraste agradável." },
  { dish: "Churrasco", category: "Carnes", wines: ["Malbec", "Cabernet Sauvignon", "Tannat"], why: "Proteína e gordura suavizam taninos firmes, e o defumado da brasa combina com tintos encorpados." },
  { dish: "Carnes vermelhas grelhadas", category: "Carnes", wines: ["Cabernet Sauvignon", "Syrah", "Nebbiolo"], why: "Cortes suculentos aceitam vinhos estruturados; quanto mais gordura, mais tanino o prato suporta." },
  { dish: "Frango assado", category: "Carnes", wines: ["Chardonnay", "Pinot Noir", "Merlot"], why: "Carnes brancas de sabor médio pedem vinhos de corpo médio, brancos ou tintos leves." },
  { dish: "Salmão", category: "Peixes e frutos do mar", wines: ["Pinot Noir", "Chardonnay", "Rosé seco"], why: "Peixe gorduroso aceita tinto leve e de pouco tanino; a acidez corta a gordura." },
  { dish: "Peixe grelhado", category: "Peixes e frutos do mar", wines: ["Sauvignon Blanc", "Alvarinho", "Vinho Verde"], why: "Brancos leves e cítricos funcionam como o limão espremido sobre o peixe." },
  { dish: "Camarão", category: "Peixes e frutos do mar", wines: ["Chardonnay", "Espumante Brut", "Albariño"], why: "Camarão com manteiga combina com Chardonnay; preparos simples pedem brancos frescos ou espumante." },
  { dish: "Comida japonesa", category: "Peixes e frutos do mar", wines: ["Riesling", "Espumante Brut", "Pinot Noir"], why: "Perfis frescos e aromáticos respeitam o peixe cru e lidam bem com shoyu, gengibre e wasabi." },
  { dish: "Massas ao sugo", category: "Massas e grãos", wines: ["Sangiovese", "Barbera", "Merlot"], why: "A acidez do tomate pede vinhos com acidez semelhante; caso contrário, o vinho parece apagado." },
  { dish: "Pizza", category: "Massas e grãos", wines: ["Sangiovese", "Merlot", "Barbera"], why: "Boa acidez conversa com o tomate, enquanto corpo moderado acompanha queijo e recheios." },
  { dish: "Risoto de cogumelos", category: "Massas e grãos", wines: ["Pinot Noir", "Nebbiolo", "Chardonnay"], why: "Os aromas terrosos dos cogumelos encontram eco em vinhos com notas de sous-bois e boa acidez." },
  { dish: "Queijos curados", category: "Queijos e petiscos", wines: ["Cabernet Sauvignon", "Tempranillo", "Porto Tawny"], why: "Queijos intensos e salgados aceitam tintos estruturados ou fortificados." },
  { dish: "Queijo de cabra", category: "Queijos e petiscos", wines: ["Sauvignon Blanc", "Chenin Blanc"], why: "A acidez do vinho acompanha a acidez do queijo — combinação clássica do Loire." },
  { dish: "Bolo de rolo", category: "Doces", wines: ["Moscatel espumante", "Late harvest", "Porto Tawny"], avoid: "Espumantes Brut, que parecem amargos ao lado do açúcar.", why: "O vinho precisa ser ao menos tão doce quanto a sobremesa; notas de goiaba combinam com moscatéis." },
  { dish: "Chocolate amargo", category: "Doces", wines: ["Porto Ruby", "Banyuls", "Late harvest tinto"], why: "A doçura do vinho deve acompanhar ou superar a da sobremesa; vale experimentar diferentes intensidades de cacau." },
];

export const pairingByDish = (dish: string) => pairings.find((p) => p.dish === dish);
