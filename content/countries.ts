import { q, tf } from "./helpers";
import type { Country } from "./types";

export const countries: Country[] = [
  {
    slug: "franca",
    name: "França",
    world: "Velho Mundo",
    summary: "O grande laboratório do vinho: muitas das uvas e estilos clássicos nasceram ali.",
    story: [
      "A França ajudou a definir a linguagem do vinho. Bordeaux, Borgonha, Champagne, Rhône, Loire e Alsácia funcionam quase como escolas diferentes, cada uma com uvas, clima e tradições próprias.",
      "O sistema de denominações (AOC/AOP) liga o nome do vinho ao lugar e define regras de uvas, rendimento e elaboração. Por isso, rótulos franceses costumam destacar a região antes da uva: quem lê “Sancerre” deve saber que ali o branco é de Sauvignon Blanc.",
    ],
    keyGrapes: ["Cabernet Sauvignon", "Merlot", "Pinot Noir", "Chardonnay", "Syrah", "Sauvignon Blanc"],
    regions: [
      { slug: "bordeaux", name: "Bordeaux", climate: "Oceânico, influenciado pelo Atlântico e pelos rios Garonne, Dordogne e Gironde.", soil: "Cascalho na margem esquerda; argila e calcário na margem direita.", grapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Sauvignon Blanc", "Sémillon"], styles: "Tintos de corte, brancos secos e os doces de Sauternes.", note: "A margem esquerda privilegia a Cabernet Sauvignon; a direita, a Merlot." },
      { slug: "borgonha", name: "Borgonha", climate: "Continental, com invernos frios e risco de geadas.", soil: "Calcário e marga, com enorme variação de um vinhedo para outro.", grapes: ["Pinot Noir", "Chardonnay"], styles: "Tintos delicados, brancos de Chablis à Côte de Beaune.", note: "Os vinhedos são divididos em “climats”, parcelas com identidade própria." },
      { slug: "champagne", name: "Champagne", climate: "Frio, no limite norte do cultivo da videira.", soil: "Giz, que drena bem e guarda umidade.", grapes: ["Chardonnay", "Pinot Noir", "Pinot Meunier"], styles: "Espumantes pelo método tradicional.", note: "Só pode se chamar Champagne o espumante produzido nessa região." },
      { slug: "rhone", name: "Vale do Rhône", climate: "Continental no norte; mediterrâneo no sul.", soil: "Granito nas encostas do norte; pedras roladas e areia no sul.", grapes: ["Syrah", "Grenache", "Mourvèdre", "Viognier"], styles: "Syrah varietal no norte; cortes generosos como Châteauneuf-du-Pape no sul.", note: "Hermitage e Côte-Rôtie são referências mundiais de Syrah." },
      { slug: "loire", name: "Vale do Loire", climate: "Fresco, do Atlântico ao centro da França.", soil: "Calcário, sílex, xisto e tufo.", grapes: ["Sauvignon Blanc", "Chenin Blanc", "Cabernet Franc", "Melon de Bourgogne"], styles: "Brancos vibrantes, tintos leves, doces e espumantes.", note: "Sancerre, Vouvray e Muscadet são nomes do Loire." },
      { slug: "alsacia", name: "Alsácia", climate: "Seco e ensolarado, protegido pelos montes Vosges.", soil: "Mosaico de granito, calcário, arenito e marga.", grapes: ["Riesling", "Gewürztraminer", "Pinot Gris", "Muscat"], styles: "Brancos aromáticos, do seco ao doce.", note: "Uma das poucas regiões francesas que costumam indicar a uva no rótulo." },
    ],
    quiz: [
      q("Por que muitos rótulos franceses destacam a região e não a uva?", ["Porque as uvas são secretas", "Porque a denominação já define as uvas permitidas", "Porque é proibido citar uvas", "Porque todas as regiões usam a mesma uva"], 1, "No sistema de denominações, o lugar carrega regras sobre uvas e estilo."),
      q("Quais são as principais uvas da Borgonha?", ["Cabernet e Merlot", "Pinot Noir e Chardonnay", "Syrah e Grenache", "Riesling e Gewürztraminer"], 1, "A Borgonha é a casa da Pinot Noir e da Chardonnay."),
      tf("Um espumante produzido fora da região de Champagne pode ser chamado de Champagne.", false, "O nome é protegido; fora dali usam-se termos como Crémant, Cava ou espumante."),
    ],
  },
  {
    slug: "italia",
    name: "Itália",
    world: "Velho Mundo",
    summary: "Centenas de uvas nativas e uma tradição em que vinho e comida andam juntos.",
    story: [
      "A Itália produz vinho em praticamente todas as regiões e cultiva centenas de variedades nativas. Isso torna o país fascinante e, às vezes, desafiador: muitos vinhos levam o nome do lugar, como Chianti, Barolo ou Soave.",
      "Os vinhos italianos costumam ter acidez marcante, pensada para acompanhar a comida. As classificações DOC e DOCG indicam denominações controladas, enquanto a sigla IGT permitiu experimentos como os chamados supertoscanos, que usam uvas francesas.",
    ],
    keyGrapes: ["Sangiovese", "Nebbiolo", "Barbera", "Corvina", "Glera", "Moscato"],
    regions: [
      { slug: "toscana", name: "Toscana", climate: "Mediterrâneo, com colinas que moderam o calor.", soil: "Galestro e alberese (xistos e calcários) no Chianti; argila e areia no litoral.", grapes: ["Sangiovese", "Cabernet Sauvignon", "Merlot"], styles: "Chianti Classico, Brunello di Montalcino e supertoscanos de Bolgheri.", note: "O galo negro identifica o Chianti Classico." },
      { slug: "piemonte", name: "Piemonte", climate: "Continental, com outonos de neblina.", soil: "Marga calcária nas colinas das Langhe.", grapes: ["Nebbiolo", "Barbera", "Dolcetto", "Moscato"], styles: "Barolo, Barbaresco, Barbera d'Asti e Moscato d'Asti.", note: "O nome Piemonte significa “ao pé da montanha”." },
      { slug: "veneto", name: "Vêneto", climate: "Continental, com influência do lago de Garda e do Adriático.", soil: "Aluvial nas planícies; calcário e vulcânico nas colinas.", grapes: ["Glera", "Corvina", "Garganega"], styles: "Prosecco, Amarone, Valpolicella e Soave.", note: "O Amarone é feito com uvas desidratadas por meses antes da fermentação." },
    ],
    quiz: [
      q("Qual uva é a base do Prosecco?", ["Glera", "Nebbiolo", "Sangiovese", "Chardonnay"], 0, "O Prosecco é elaborado principalmente com Glera."),
      q("O que são os supertoscanos?", ["Vinhos doces da Sicília", "Vinhos toscanos que usam também uvas francesas", "Espumantes do Piemonte", "Vinhos sem álcool"], 1, "Surgiram fora das regras tradicionais e ganharam fama internacional."),
      tf("O Amarone é feito com uvas desidratadas antes da fermentação.", true, "O método appassimento concentra açúcar e sabor."),
    ],
  },
  {
    slug: "portugal",
    name: "Portugal",
    world: "Velho Mundo",
    summary: "Uvas nativas, ótima relação qualidade-preço e o berço do Vinho do Porto.",
    story: [
      "Portugal preservou um enorme patrimônio de uvas nativas, como Touriga Nacional, Baga, Alvarinho e Encruzado. Em um território pequeno, convivem o frescor atlântico do Vinho Verde e o calor do Alentejo.",
      "O Douro, com seus socalcos de xisto, foi demarcado em 1756 e é uma das regiões vinícolas regulamentadas mais antigas do mundo. Além do Porto, fortificado e doce, produz tintos secos de grande personalidade.",
    ],
    keyGrapes: ["Touriga Nacional", "Tinta Roriz", "Alvarinho", "Baga", "Alicante Bouschet"],
    regions: [
      { slug: "douro", name: "Douro", climate: "Continental, quente e seco no verão.", soil: "Xisto, em socalcos construídos à mão.", grapes: ["Touriga Nacional", "Touriga Franca", "Tinta Roriz"], styles: "Vinho do Porto e tintos secos estruturados.", note: "O Alto Douro Vinhateiro é Patrimônio Mundial da UNESCO." },
      { slug: "vinho-verde", name: "Vinho Verde", climate: "Atlântico, chuvoso e fresco.", soil: "Granito.", grapes: ["Alvarinho", "Loureiro", "Arinto"], styles: "Brancos leves, frescos e às vezes levemente frisantes.", note: "“Verde” se refere à juventude do vinho, não à cor." },
      { slug: "alentejo", name: "Alentejo", climate: "Quente e seco, com grandes planícies.", soil: "Xisto, granito e argila.", grapes: ["Aragonez", "Trincadeira", "Alicante Bouschet", "Antão Vaz"], styles: "Tintos maduros e macios; vinhos de talha.", note: "A produção em ânforas de barro, os vinhos de talha, tem tradição milenar ali." },
    ],
    quiz: [
      q("O que significa o “verde” de Vinho Verde?", ["Que o vinho é verde", "Que é um vinho jovem e fresco", "Que é orgânico", "Que tem sabor de ervas"], 1, "O termo remete à juventude e ao frescor do vinho."),
      q("Qual é o solo característico do Douro?", ["Giz", "Xisto", "Areia vulcânica", "Turfa"], 1, "Os socalcos de xisto são a paisagem símbolo da região."),
      tf("O Vinho do Porto é um vinho fortificado.", true, "Recebe aguardente vínica durante a fermentação, preservando açúcar natural."),
    ],
  },
  {
    slug: "espanha",
    name: "Espanha",
    world: "Velho Mundo",
    summary: "A maior área de vinhedos da Europa, com tradição de longo envelhecimento.",
    story: [
      "A Espanha tem uma das maiores áreas de vinhedo do mundo. A Tempranillo domina regiões tintas como Rioja e Ribera del Duero, enquanto a Galícia, no noroeste úmido, produz brancos frescos de Albariño.",
      "Uma marca espanhola é a tradição de envelhecer vinhos antes de lançá-los. Categorias como Crianza, Reserva e Gran Reserva informam tempos mínimos de envelhecimento. O país também é berço do Cava, espumante de método tradicional, e do Jerez, um fortificado único.",
    ],
    keyGrapes: ["Tempranillo", "Garnacha", "Albariño", "Monastrell", "Palomino"],
    regions: [
      { slug: "rioja", name: "Rioja", climate: "Continental, com influências atlântica e mediterrânea.", soil: "Argila calcária, argila ferrosa e aluvial.", grapes: ["Tempranillo", "Garnacha", "Graciano", "Viura"], styles: "Tintos de Crianza a Gran Reserva, frequentemente com carvalho americano.", note: "Dividida em Rioja Alta, Rioja Alavesa e Rioja Oriental." },
      { slug: "ribera-del-duero", name: "Ribera del Duero", climate: "Continental extremo, em planalto alto.", soil: "Calcário e argila.", grapes: ["Tinto Fino (Tempranillo)"], styles: "Tintos intensos e estruturados.", note: "Noites frias em altitude ajudam a preservar o frescor." },
      { slug: "rias-baixas", name: "Rías Baixas", climate: "Atlântico, úmido e fresco.", soil: "Granito.", grapes: ["Albariño"], styles: "Brancos aromáticos, cítricos e salinos.", note: "Combinação clássica com frutos do mar galegos." },
    ],
    quiz: [
      q("Qual uva domina Rioja e Ribera del Duero?", ["Garnacha", "Tempranillo", "Albariño", "Monastrell"], 1, "Em Ribera ela é chamada de Tinto Fino."),
      q("O que é o Cava?", ["Um tinto de Rioja", "Um espumante de método tradicional", "Um vinho de sobremesa", "Uma uva branca"], 1, "O Cava é o espumante tradicional espanhol, muito associado à Catalunha."),
      tf("Na Espanha, “Gran Reserva” indica um vinho de longo envelhecimento.", true, "É a categoria com os maiores tempos mínimos de envelhecimento."),
    ],
  },
  {
    slug: "argentina",
    name: "Argentina",
    world: "Novo Mundo",
    summary: "Vinhedos de altitude, sol intenso e a Malbec como bandeira.",
    story: [
      "A maior parte dos vinhedos argentinos fica aos pés dos Andes, em áreas secas irrigadas pela água do degelo. A altitude traz sol forte e noites frias, combinação que dá cor intensa e preserva frescor.",
      "A Malbec é a uva símbolo, mas o país também tem a Torrontés, branca aromática de Salta, e ótimos exemplares de Cabernet Sauvignon, Cabernet Franc e Pinot Noir na Patagônia.",
    ],
    keyGrapes: ["Malbec", "Cabernet Sauvignon", "Bonarda", "Torrontés", "Cabernet Franc"],
    regions: [
      { slug: "mendoza", name: "Mendoza", climate: "Desértico de altitude, com grande amplitude térmica.", soil: "Aluvial, pedregoso e arenoso.", grapes: ["Malbec", "Cabernet Sauvignon", "Cabernet Franc"], styles: "Tintos encorpados e frutados.", note: "Luján de Cuyo e Valle de Uco são as zonas mais célebres." },
      { slug: "salta", name: "Salta (Cafayate)", climate: "Seco, de altitude muito elevada.", soil: "Arenoso.", grapes: ["Torrontés", "Malbec"], styles: "Brancos aromáticos e tintos intensos.", note: "Abriga alguns dos vinhedos mais altos do mundo." },
      { slug: "patagonia", name: "Patagônia", climate: "Fresco e ventoso.", soil: "Aluvial e arenoso.", grapes: ["Pinot Noir", "Malbec", "Merlot"], styles: "Tintos mais leves e elegantes.", note: "Neuquén e Río Negro são as províncias de destaque." },
    ],
    quiz: [
      q("De onde vem a água que irriga muitos vinhedos argentinos?", ["Do mar", "Do degelo dos Andes", "De chuvas tropicais", "De poços salgados"], 1, "O clima é seco; a água da neve derretida é essencial."),
      q("Qual uva branca aromática é típica de Salta?", ["Torrontés", "Chardonnay", "Riesling", "Viognier"], 0, "A Torrontés dá brancos florais e perfumados."),
      tf("A grande amplitude térmica de Mendoza ajuda a preservar a acidez.", true, "Noites frias desaceleram a perda de acidez das uvas."),
    ],
  },
  {
    slug: "chile",
    name: "Chile",
    world: "Novo Mundo",
    summary: "Entre os Andes e o Pacífico: vales frescos e ensolarados de grande regularidade.",
    story: [
      "O Chile é um corredor estreito entre a cordilheira e o oceano. A corrente fria de Humboldt e a brisa do Pacífico refrescam vales costeiros, enquanto os Andes trazem noites frias. É uma das poucas grandes regiões vinícolas que nunca foram atingidas pela filoxera.",
      "O Maipo é famoso pela Cabernet Sauvignon; Colchagua, pelos tintos maduros e pela Carménère; Casablanca e Leyda, pelos brancos frescos de Sauvignon Blanc e Chardonnay.",
    ],
    keyGrapes: ["Cabernet Sauvignon", "Carménère", "Sauvignon Blanc", "País", "Syrah"],
    regions: [
      { slug: "maipo", name: "Vale do Maipo", climate: "Mediterrâneo, perto de Santiago.", soil: "Aluvial e pedregoso.", grapes: ["Cabernet Sauvignon", "Carménère"], styles: "Tintos estruturados, com notas de menta e eucalipto.", note: "Alto Maipo, aos pés dos Andes, é referência em Cabernet." },
      { slug: "colchagua", name: "Vale de Colchagua", climate: "Mediterrâneo quente.", soil: "Argila, granito e aluvial.", grapes: ["Carménère", "Cabernet Sauvignon", "Syrah"], styles: "Tintos maduros e encorpados.", note: "Um dos polos do enoturismo chileno." },
      { slug: "casablanca", name: "Vale de Casablanca", climate: "Fresco, com influência direta do Pacífico.", soil: "Granito e argila.", grapes: ["Sauvignon Blanc", "Chardonnay", "Pinot Noir"], styles: "Brancos frescos e tintos leves.", note: "As névoas matinais do oceano moderam a temperatura." },
    ],
    quiz: [
      q("O que refresca os vales costeiros chilenos?", ["A corrente fria de Humboldt", "Os ventos do Saara", "A altitude de 3.000 m", "O degelo do Ártico"], 0, "A corrente oceânica fria e a brisa do Pacífico baixam as temperaturas."),
      q("Qual vale chileno é célebre pela Cabernet Sauvignon?", ["Casablanca", "Maipo", "Leyda", "Bío-Bío"], 1, "O Maipo é o grande nome da Cabernet no Chile."),
      tf("O Chile nunca foi atingido pela praga da filoxera.", true, "Por isso muitas videiras são plantadas em pé franco, sem enxerto."),
    ],
  },
  {
    slug: "estados-unidos",
    name: "Estados Unidos",
    world: "Novo Mundo",
    summary: "Califórnia ensolarada, Oregon fresco e uma história de ousadia.",
    story: [
      "A Califórnia responde pela maior parte da produção americana. O Napa Valley ficou famoso pela Cabernet Sauvignon; Sonoma, mais diversa e com áreas frescas, brilha com Pinot Noir e Chardonnay. Em Oregon, o Willamette Valley é referência em Pinot Noir.",
      "Em 1976, uma degustação às cegas em Paris colocou vinhos californianos à frente de grandes franceses e mudou a percepção mundial sobre o Novo Mundo. A Zinfandel, uva de origem croata, tornou-se uma especialidade californiana.",
    ],
    keyGrapes: ["Cabernet Sauvignon", "Chardonnay", "Pinot Noir", "Zinfandel"],
    regions: [
      { slug: "napa-valley", name: "Napa Valley", climate: "Mediterrâneo, quente de dia e fresco à noite.", soil: "Vulcânico, aluvial e de encosta.", grapes: ["Cabernet Sauvignon", "Merlot", "Chardonnay"], styles: "Tintos potentes e maduros.", note: "A neblina da baía de San Pablo refresca o sul do vale." },
      { slug: "sonoma", name: "Sonoma", climate: "Variado, com zonas frescas próximas ao oceano.", soil: "Muito variado.", grapes: ["Pinot Noir", "Chardonnay", "Zinfandel"], styles: "De Pinot elegante a Zinfandel encorpada.", note: "Russian River Valley é referência em Pinot Noir." },
      { slug: "oregon", name: "Willamette Valley", climate: "Fresco e úmido, semelhante ao da Borgonha.", soil: "Vulcânico e sedimentar.", grapes: ["Pinot Noir", "Pinot Gris", "Chardonnay"], styles: "Pinot Noir delicado e aromático.", note: "Produtores da Borgonha investiram na região." },
    ],
    quiz: [
      q("Qual evento de 1976 mudou a imagem do vinho americano?", ["A criação do Napa Valley", "Uma degustação às cegas em Paris", "O fim da Lei Seca", "A primeira safra de Oregon"], 1, "Vinhos californianos venceram rótulos franceses na prova às cegas."),
      q("Qual uva tornou o Willamette Valley famoso?", ["Zinfandel", "Pinot Noir", "Malbec", "Riesling"], 1, "O clima fresco de Oregon favorece a Pinot Noir."),
      tf("A Zinfandel tem origem croata.", true, "Estudos de DNA a ligaram a uvas da Croácia, também parentes da Primitivo italiana."),
    ],
  },
  {
    slug: "africa-do-sul",
    name: "África do Sul",
    world: "Novo Mundo",
    summary: "Tradição de mais de três séculos, Chenin Blanc e a original Pinotage.",
    story: [
      "Os primeiros vinhos sul-africanos datam do século XVII, na região do Cabo. As correntes oceânicas e os ventos frescos moderam o calor e permitem estilos variados.",
      "A Chenin Blanc é a branca mais plantada do país. A Pinotage, criada em 1925 a partir de Pinot Noir e Cinsault, é uma tinta nascida ali. Stellenbosch é o polo dos tintos de corte; Swartland ficou conhecida por vinhos de vinhas velhas e produtores inovadores.",
    ],
    keyGrapes: ["Chenin Blanc", "Pinotage", "Cabernet Sauvignon", "Syrah"],
    regions: [
      { slug: "stellenbosch", name: "Stellenbosch", climate: "Mediterrâneo, refrescado pela baía False Bay.", soil: "Granito e arenito.", grapes: ["Cabernet Sauvignon", "Pinotage", "Chenin Blanc"], styles: "Tintos de corte e brancos estruturados.", note: "Centro histórico e acadêmico do vinho sul-africano." },
      { slug: "swartland", name: "Swartland", climate: "Quente e seco.", soil: "Xisto, granito e argila.", grapes: ["Chenin Blanc", "Syrah", "Grenache"], styles: "Vinhos de vinhas velhas, muitas vezes com mínima intervenção.", note: "Tornou-se símbolo da nova geração de produtores." },
    ],
    quiz: [
      q("De quais uvas nasceu a Pinotage?", ["Pinot Noir e Cinsault", "Pinot Noir e Syrah", "Merlot e Cinsault", "Chenin e Pinot Gris"], 0, "Foi criada em 1925 na Universidade de Stellenbosch."),
      q("Qual é a branca mais plantada na África do Sul?", ["Chardonnay", "Chenin Blanc", "Riesling", "Moscato"], 1, "A Chenin Blanc é a grande branca sul-africana."),
      tf("A produção de vinho na África do Sul começou no século XX.", false, "Os primeiros registros são do século XVII."),
    ],
  },
  {
    slug: "australia",
    name: "Austrália",
    world: "Novo Mundo",
    summary: "Shiraz generosa, inovação técnica e algumas das vinhas mais antigas do mundo.",
    story: [
      "A Austrália popularizou o rótulo varietal e a ideia de vinhos de fruta madura e fáceis de entender. A Shiraz é a uva emblemática, sobretudo no Barossa Valley, onde sobrevivem vinhas centenárias.",
      "O país é muito diverso: Coonawarra tem a famosa terra rossa, ideal para Cabernet; Margaret River, influenciada pelo oceano Índico, faz Cabernet e Chardonnay elegantes; Clare e Eden Valley produzem Rieslings secos.",
    ],
    keyGrapes: ["Shiraz", "Cabernet Sauvignon", "Chardonnay", "Riesling", "Grenache"],
    regions: [
      { slug: "barossa", name: "Barossa Valley", climate: "Quente e seco.", soil: "Areia, argila e marga.", grapes: ["Shiraz", "Grenache", "Mourvèdre"], styles: "Tintos encorpados e intensos.", note: "Algumas vinhas de Shiraz têm mais de 150 anos." },
      { slug: "coonawarra", name: "Coonawarra", climate: "Fresco, com influência marítima.", soil: "Terra rossa sobre calcário.", grapes: ["Cabernet Sauvignon"], styles: "Cabernet com notas de menta e cassis.", note: "A faixa de terra vermelha tem poucos quilômetros." },
      { slug: "margaret-river", name: "Margaret River", climate: "Marítimo, influenciado pelo oceano Índico.", soil: "Granito e cascalho.", grapes: ["Cabernet Sauvignon", "Chardonnay", "Sémillon"], styles: "Tintos e brancos elegantes.", note: "Uma das regiões mais isoladas e premiadas do país." },
    ],
    quiz: [
      q("Qual uva é emblemática do Barossa Valley?", ["Pinot Noir", "Shiraz", "Riesling", "Tempranillo"], 1, "A Shiraz de Barossa é referência mundial de estilo encorpado."),
      q("O que é a terra rossa de Coonawarra?", ["Um tipo de uva", "Um solo vermelho sobre calcário", "Uma técnica de vinificação", "Um vinho doce"], 1, "É um solo famoso por favorecer a Cabernet."),
      tf("A Austrália tem algumas das vinhas mais antigas do mundo ainda em produção.", true, "Parte delas escapou da filoxera e segue produzindo."),
    ],
  },
  {
    slug: "nova-zelandia",
    name: "Nova Zelândia",
    world: "Novo Mundo",
    summary: "Clima fresco, pureza aromática e uma Sauvignon Blanc que conquistou o mundo.",
    story: [
      "Nenhum ponto da Nova Zelândia fica muito longe do mar. O clima fresco e a luz intensa produzem vinhos de aromas nítidos e acidez viva.",
      "Marlborough tornou a Sauvignon Blanc neozelandesa famosa, com maracujá e notas herbáceas. Central Otago, de clima continental e montanhoso, é um dos lugares mais austrais do mundo a produzir vinho e brilha com Pinot Noir.",
    ],
    keyGrapes: ["Sauvignon Blanc", "Pinot Noir", "Chardonnay", "Syrah"],
    regions: [
      { slug: "marlborough", name: "Marlborough", climate: "Fresco e ensolarado, com noites frias.", soil: "Aluvial pedregoso.", grapes: ["Sauvignon Blanc", "Pinot Noir"], styles: "Sauvignon Blanc intenso e tropical.", note: "Responde pela maior parte da produção do país." },
      { slug: "central-otago", name: "Central Otago", climate: "Continental, seco e montanhoso.", soil: "Xisto e loess.", grapes: ["Pinot Noir"], styles: "Pinot Noir frutado e vibrante.", note: "Paisagens de montanha e grande amplitude térmica." },
    ],
    quiz: [
      q("Qual uva tornou Marlborough famosa?", ["Sauvignon Blanc", "Malbec", "Nebbiolo", "Tempranillo"], 0, "O estilo de Marlborough virou referência mundial."),
      q("Qual uva é a especialidade de Central Otago?", ["Cabernet Sauvignon", "Pinot Noir", "Riesling", "Carménère"], 1, "O clima continental e fresco favorece a Pinot Noir."),
      tf("Os vinhos neozelandeses costumam ter acidez viva.", true, "O clima fresco e a influência marítima preservam o frescor."),
    ],
  },
  {
    slug: "brasil",
    name: "Brasil",
    world: "Novo Mundo",
    summary: "Espumantes de destaque, Merlot da Serra Gaúcha e novas fronteiras do vinho tropical e de inverno.",
    story: [
      "A vitivinicultura brasileira ganhou força com a imigração italiana na Serra Gaúcha, a partir de 1875. O Rio Grande do Sul segue como principal produtor, e os espumantes brasileiros — do Brut fresco ao Moscatel perfumado — são reconhecidos dentro e fora do país.",
      "O Vale dos Vinhedos foi a primeira Indicação de Procedência do Brasil, em 2002, e se tornou Denominação de Origem em 2012. Novas fronteiras ampliaram o mapa: vinhos de altitude em Santa Catarina, a Campanha Gaúcha perto do Uruguai, vinhos de inverno no Sudeste com dupla poda e o Vale do São Francisco, no semiárido, onde é possível colher mais de uma vez por ano.",
    ],
    keyGrapes: ["Merlot", "Chardonnay", "Moscato", "Cabernet Sauvignon", "Tannat", "Syrah"],
    regions: [
      { slug: "serra-gaucha", name: "Serra Gaúcha", climate: "Temperado úmido, com chuvas ao longo do ano.", soil: "Basalto e argila.", grapes: ["Merlot", "Chardonnay", "Pinot Noir", "Moscato"], styles: "Espumantes, tintos frutados e brancos frescos.", note: "Bento Gonçalves e Garibaldi são polos do espumante." },
      { slug: "vale-dos-vinhedos", name: "Vale dos Vinhedos", climate: "Temperado úmido de serra.", soil: "Basalto e argila.", grapes: ["Merlot", "Chardonnay"], styles: "Tintos de Merlot, brancos de Chardonnay e espumantes.", note: "Primeira IP (2002) e primeira DO (2012) de vinhos do Brasil." },
      { slug: "campanha-gaucha", name: "Campanha Gaúcha", climate: "Mais seco e ensolarado que a Serra.", soil: "Arenoso e bem drenado.", grapes: ["Tannat", "Cabernet Sauvignon", "Chardonnay"], styles: "Tintos encorpados e brancos maduros.", note: "Faz fronteira com o Uruguai, terra da Tannat." },
      { slug: "serra-catarinense", name: "Serra Catarinense", climate: "Frio de altitude, acima de 900 m.", soil: "Basalto.", grapes: ["Sauvignon Blanc", "Cabernet Sauvignon", "Pinot Noir"], styles: "Vinhos de altitude, com acidez marcante.", note: "São Joaquim é uma das cidades mais frias do país." },
      { slug: "vale-do-sao-francisco", name: "Vale do São Francisco", climate: "Tropical semiárido, quente e seco, com irrigação.", soil: "Arenoso.", grapes: ["Syrah", "Moscato", "Chenin Blanc"], styles: "Espumantes moscatéis e tintos jovens.", note: "Entre Pernambuco e Bahia, permite mais de uma colheita por ano." },
    ],
    quiz: [
      q("Qual foi a primeira Denominação de Origem de vinhos do Brasil?", ["Campanha Gaúcha", "Vale dos Vinhedos", "Vale do São Francisco", "Serra Catarinense"], 1, "O Vale dos Vinhedos tornou-se DO em 2012."),
      q("O que torna o Vale do São Francisco singular?", ["Neve todos os anos", "Mais de uma colheita por ano", "Vinhedos acima de 3.000 m", "Proibição de espumantes"], 1, "O clima tropical com irrigação permite controlar o ciclo da videira."),
      tf("Os espumantes estão entre os grandes destaques do vinho brasileiro.", true, "Do Brut ao Moscatel, são reconhecidos dentro e fora do país."),
    ],
  },
];

export const countryBySlug = (slug: string) => countries.find((c) => c.slug === slug);
export const allRegions = countries.flatMap((c) => c.regions.map((r) => ({ ...r, country: c.name, countrySlug: c.slug })));
