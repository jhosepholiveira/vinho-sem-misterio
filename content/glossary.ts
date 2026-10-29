import { slugify } from "./helpers";
import type { GlossaryTerm } from "./types";

const t = (term: string, short: string, example?: string, related?: string[]): GlossaryTerm => ({ slug: slugify(term), term, short, example, related });

export const glossary: GlossaryTerm[] = [
  t("Acidez", "Sensação de frescor que faz a boca salivar.", "Um Sauvignon Blanc vibrante tem acidez alta, como uma limonada.", ["Equilíbrio", "Corpo"]),
  t("Adstringência", "Sensação de boca seca e áspera, provocada principalmente pelos taninos.", "Lembra a sensação de um chá preto forte ou de uma banana verde.", ["Tanino"]),
  t("Aerador", "Acessório que mistura ar ao vinho no momento de servir.", undefined, ["Decantação"]),
  t("Álcool", "Resultado da fermentação do açúcar da uva; dá calor, corpo e carrega aromas.", "Um tinto com 14,5% tende a parecer mais denso e quente que outro com 12%.", ["Corpo", "Equilíbrio"]),
  t("Appellation", "Termo francês para denominação de origem: área delimitada com regras de produção.", "Sancerre e Margaux são appellations.", ["Denominação de origem", "Terroir"]),
  t("Assemblage", "Mistura de vinhos de uvas, parcelas ou safras diferentes; o mesmo que corte ou blend.", "Um Bordeaux tinto costuma ser uma assemblage de Cabernet e Merlot.", ["Blend", "Varietal"]),
  t("Bâtonnage", "Agitação das borras finas dentro do tanque ou barrica para dar textura ao vinho.", "Comum em Chardonnays da Borgonha.", ["Sur lie"]),
  t("Blend", "Vinho feito com mais de uma uva; também chamado de corte.", undefined, ["Assemblage", "Varietal"]),
  t("Botrytis", "Fungo que, em condições específicas, desidrata as uvas e concentra açúcar — a “podridão nobre”.", "É a base dos doces de Sauternes e Tokaji.", ["Doçura"]),
  t("Buquê", "Conjunto de aromas que surgem com a elaboração e o envelhecimento.", "Notas de couro e cogumelo em um tinto maduro fazem parte do buquê.", ["Aromas terciários"]),
  t("Aromas primários", "Aromas que vêm da própria uva: frutas, flores, ervas.", "Maracujá na Sauvignon Blanc.", ["Aromas secundários", "Aromas terciários"]),
  t("Aromas secundários", "Aromas criados na fermentação e na vinificação, como pão, manteiga e iogurte.", undefined, ["Aromas primários", "Fermentação malolática"]),
  t("Aromas terciários", "Aromas de evolução e envelhecimento, como couro, tabaco, cogumelos e mel.", undefined, ["Buquê", "Potencial de guarda"]),
  t("Brut", "Espumante seco, com pouco açúcar residual.", "Extra Brut e Brut Nature são ainda mais secos.", ["Doçura", "Método tradicional"]),
  t("Corpo", "Percepção de peso e volume do vinho na boca.", "Leite desnatado é leve; leite integral, mais encorpado.", ["Álcool", "Acidez"]),
  t("Decantação", "Transferir o vinho para outro recipiente para separar sedimentos ou oxigená-lo.", undefined, ["Aerador", "Sedimento"]),
  t("Denominação de origem", "Nome geográfico protegido que garante procedência e regras de produção.", "Vale dos Vinhedos, Rioja e Champagne são exemplos.", ["Appellation", "Indicação de procedência"]),
  t("Doçura", "Quantidade de açúcar residual percebida no vinho.", undefined, ["Brut", "Equilíbrio"]),
  t("Equilíbrio", "Harmonia entre acidez, doçura, álcool, tanino e fruta: nenhum elemento sobra.", undefined, ["Acidez", "Tanino", "Álcool"]),
  t("Espumante", "Vinho com gás carbônico dissolvido, obtido por uma segunda fermentação.", undefined, ["Método tradicional", "Método Charmat"]),
  t("Fermentação", "Processo em que leveduras transformam o açúcar do mosto em álcool e gás carbônico.", undefined, ["Levedura", "Mosto"]),
  t("Fermentação malolática", "Transformação do ácido málico em lático, que deixa o vinho mais macio.", "Pode dar notas amanteigadas ao Chardonnay.", ["Aromas secundários"]),
  t("Filoxera", "Inseto que ataca as raízes da videira e devastou vinhedos europeus no século XIX.", "A solução foi enxertar videiras europeias em raízes americanas.", ["Pé franco"]),
  t("Fortificado", "Vinho que recebe aguardente vínica, elevando o teor alcoólico.", "Porto, Jerez e Madeira.", ["Doçura"]),
  t("Indicação de procedência", "Reconhecimento de que um lugar ficou conhecido por um produto.", "Farroupilha tem IP para moscatéis.", ["Denominação de origem"]),
  t("Levedura", "Microrganismo responsável pela fermentação alcoólica.", undefined, ["Fermentação"]),
  t("Maceração", "Contato do mosto com as cascas para extrair cor, taninos e aromas.", "Tintos maceram; brancos, em geral, não.", ["Tanino", "Vinho laranja"]),
  t("Maceração carbônica", "Fermentação de cachos inteiros em ambiente de gás carbônico, que gera vinhos frutados e leves.", "Muito usada no Beaujolais.", ["Fermentação"]),
  t("Método Charmat", "Segunda fermentação do espumante em grandes tanques fechados.", "Preserva aromas frescos, como em muitos Proseccos e Moscatéis.", ["Espumante", "Método tradicional"]),
  t("Método tradicional", "Segunda fermentação do espumante dentro da própria garrafa.", "Usado em Champagne, Cava e muitos espumantes brasileiros.", ["Espumante", "Sur lie"]),
  t("Mosto", "Suco de uva, com ou sem cascas, antes ou durante a fermentação.", undefined, ["Fermentação"]),
  t("Pé franco", "Videira plantada sem enxerto, sobre as próprias raízes.", "Comum no Chile, livre da filoxera.", ["Filoxera"]),
  t("Persistência", "Tempo em que os sabores permanecem na boca após engolir.", undefined, ["Equilíbrio"]),
  t("Potencial de guarda", "Capacidade de um vinho melhorar ou se manter bem com o tempo.", undefined, ["Aromas terciários"]),
  t("Safra", "Ano em que as uvas foram colhidas.", undefined, ["Terroir"]),
  t("Sedimento", "Depósito sólido natural que se forma em vinhos envelhecidos.", undefined, ["Decantação"]),
  t("Sommelier", "Profissional que seleciona, conserva e serve vinhos, orientando o cliente.", undefined, []),
  t("Sur lie", "Envelhecimento do vinho em contato com as borras finas de levedura.", "Dá textura e notas de pão.", ["Bâtonnage"]),
  t("Tanino", "Composto das cascas, sementes, engaços e da madeira que dá estrutura e adstringência.", undefined, ["Adstringência", "Maceração"]),
  t("Terroir", "Interação entre solo, clima, relevo, uva e trabalho humano que dá identidade a um vinho.", undefined, ["Safra", "Denominação de origem"]),
  t("Varietal", "Vinho elaborado principalmente com uma única uva, citada no rótulo.", undefined, ["Blend"]),
  t("Vinho laranja", "Vinho de uvas brancas fermentado com as cascas, como um tinto.", undefined, ["Maceração"]),
];

export const glossaryBySlug = (slug: string) => glossary.find((g) => g.slug === slug);
export const glossaryByTerm = (term: string) => glossary.find((g) => g.term.toLowerCase() === term.toLowerCase());
