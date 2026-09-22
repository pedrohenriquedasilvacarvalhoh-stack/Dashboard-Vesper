/**
 * DATASET & CONFIGURAÇÃO OFICIAL DA PESQUISA DE MERCADO - VESPER ARQUITETURA (TCC)
 * Endpoint de Integração Live Apps Script Web App
 */

const APPS_SCRIPT_DEFAULT_URL = "https://script.google.com/macros/s/AKfycbzgR1JYosVte5q-FiXVdwulZQrp2QWgeOAbZzBdDAj7BlH9fdKl8CQ2tbAfCqL23qSiIA/exec";

const VESPER_SURVEY_DATA = {
  metadata: {
    title: "Pesquisa de Mercado & Viabilidade - Vesper Arquitetura",
    totalResponses: 108,
    lastUpdated: "2026-09-21",
    author: "Vesper Arquitetura - Pesquisa de TCC",
    sectionsCount: 9,
    apiUrl: APPS_SCRIPT_DEFAULT_URL
  },
  
  sections: [
    {
      id: "sec-1",
      title: "1. Perguntas Básicas & Demografia",
      icon: "fa-user-circle",
      questions: [
        {
          id: "q1_1",
          columnHeader: "Gênero(opcional)",
          title: "Distribuição por Gênero",
          type: "single",
          data: []
        },
        {
          id: "q1_2",
          columnHeader: "Idade",
          title: "Faixa Etária dos Respondentes",
          type: "single",
          data: []
        },
        {
          id: "q1_3",
          columnHeader: "Cidade",
          title: "Localização / Cidade do Respondente",
          type: "single",
          data: []
        }
      ]
    },
    {
      id: "sec-2",
      title: "2. Moradia e Perfil do Imóvel",
      icon: "fa-home",
      questions: [
        {
          id: "q2_1",
          columnHeader: "Tipo de imóvel que possui ou utiliza",
          title: "Tipo de Imóvel Utilizado",
          type: "single",
          data: []
        },
        {
          id: "q2_2",
          columnHeader: "O imovel é:",
          title: "Situação da Propriedade (Próprio / Alugado)",
          type: "single",
          data: []
        },
        {
          id: "q2_3",
          columnHeader: "Você pretende construir, reformar ou redecorar algum espaço nos próximos 5 anos?",
          title: "Intenção de Construção ou Reforma (Próximos 5 Anos)",
          type: "single",
          data: []
        },
        {
          id: "q2_4",
          columnHeader: "Qual espaço teria prioridade para melhorias?",
          title: "Ambientes Prioritários para Melhoria",
          type: "multiple",
          data: []
        }
      ]
    },
    {
      id: "sec-3",
      title: "3. Serviços de Arquitetura",
      icon: "fa-drafting-compass",
      questions: [
        {
          id: "q3_1",
          columnHeader: "Você já contratou serviços de arquitetura ou design de interiores?",
          title: "Já contratou arquiteto ou designer anteriormente?",
          type: "single",
          data: []
        },
        {
          id: "q3_2",
          columnHeader: "Quais serviços você teria interesse em contratar?",
          title: "Serviços de Maior Interesse de Contratação",
          type: "multiple",
          data: []
        },
        {
          id: "q3_3",
          columnHeader: "Qual estilo de projeto mais te agrada?",
          title: "Estilo Arquitetônico de Preferência",
          type: "single",
          data: []
        }
      ]
    },
    {
      id: "sec-4",
      title: "4. Sustentabilidade e Responsabilidade Social",
      icon: "fa-leaf",
      questions: [
        {
          id: "q4_1",
          columnHeader: "A sustentabilidade influencia suas decisões relacionadas à construção ou reforma?",
          title: "Influência da Sustentabilidade nas Decisões",
          type: "single",
          data: []
        },
        {
          id: "q4_2",
          columnHeader: "Você teria interesse em soluções sustentáveis para seu imóvel?",
          title: "Soluções Sustentáveis de Maior Interesse",
          type: "multiple",
          data: []
        },
        {
          id: "q4_3",
          columnHeader: "Você considera importante que empresas contribuam com ações sociais e ambientais?",
          title: "Importância de Ações Sociais e Ambientais Corporativas",
          type: "single",
          data: []
        }
      ]
    },
    {
      id: "sec-5",
      title: "5. Análise de Preço",
      icon: "fa-calculator",
      questions: [
        {
          id: "q5_1",
          columnHeader: "Quanto você estaria disposto(a) a investir em um projeto ou de design de interiores?",
          title: "Orçamento Disposto a Investir em Projeto",
          type: "single",
          data: []
        },
        {
          id: "q5_2",
          columnHeader: "Você prefere:",
          title: "Preferência na Relação Custo x Benefício",
          type: "single",
          data: []
        }
      ]
    },
    {
      id: "sec-6",
      title: "6. Concorrência e Experiência",
      icon: "fa-award",
      questions: [
        {
          id: "q6_1",
          columnHeader: "Você conhece empresas de arquitetura ou design de interiores na sua região?",
          title: "Conhecimento Prévio de Concorrentes na Região",
          type: "single",
          data: []
        },
        {
          id: "q6_2",
          columnHeader: "O que é mais importante ao contratar um arquiteto ou designer?",
          title: "Fatores Mais Importantes na Contratação",
          type: "multiple",
          data: []
        },
        {
          id: "q6_3",
          columnHeader: "Quais características você considera essenciais em um projeto?",
          title: "Características Essenciais em um Projeto",
          type: "multiple",
          data: []
        }
      ]
    },
    {
      id: "sec-7",
      title: "7. Divulgação e Marketing",
      icon: "fa-bullhorn",
      questions: [
        {
          id: "q7_1",
          columnHeader: "Como você costuma conhecer empresas de arquitetura e design?",
          title: "Canais Principais de Descoberta de Marcas",
          type: "multiple",
          data: []
        },
        {
          id: "q7_2",
          columnHeader: "Você acompanha conteúdos relacionados à arquitetura, decoração ou design?",
          title: "Hábito de Acompanhar Conteúdos de Arquitetura",
          type: "single",
          data: []
        },
        {
          id: "q7_3",
          columnHeader: "Que tipo de conteúdo mais chama sua atenção?",
          title: "Tipo de Conteúdo de Maior Engajamento",
          type: "single",
          data: []
        }
      ]
    },
    {
      id: "sec-8",
      title: "8. Viabilidade do Negócio",
      icon: "fa-chart-line",
      questions: [
        {
          id: "q8_1",
          columnHeader: "Você acredita que uma empresa que ofereça arquitetura, design de interiores e soluções sustentáveis teria boa aceitação na região?",
          title: "Percepção de Aceitação e Viabilidade do Modelo Vesper",
          type: "single",
          data: []
        },
        {
          id: "q8_2",
          columnHeader: "Sugestões, opiniões ou comentários sobre a Vesper Arquitetura & Design",
          title: "Sugestões e Opiniões Qualitativas dos Participantes",
          type: "text_responses",
          responses: []
        }
      ]
    },
    {
      id: "sec-9",
      title: "9. Perfis dos Compradores & Personas",
      icon: "fa-id-card",
      questions: [
        {
          id: "q9_1",
          title: "Mapeamento dos 3 Perfis Chave de Clientes da Vesper Arquitetura",
          type: "personas",
          personas: [
            {
              title: "Comprador Residencial",
              subtitle: "Projetos Residenciais Executivos & Interiores",
              share: "68.5% do Mercado",
              badgeColor: "gold",
              icon: "fa-home",
              demographics: "25 a 49 anos | Renda 3 a 15 Salários Mínimos | 50.0% Ap. / 42.6% Casas",
              pains: [
                "Medo de estouro de orçamento durante a obra (51.9% citam como principal receio)",
                "Necessidade de otimização espacial em imóveis de 50m² a 90m² (42.6%)",
                "Exigência de visualização 3D interativa antes de comprar revestimentos e móveis",
                "Ambientes prioritários: Cozinha, Salas integradas, Quartos e Banheiros"
              ],
              ticket: "R$ 3.000 a R$ 10.000 (Preço Fixo / Escopo Fechado)"
            },
            {
              title: "Comprador Comercial",
              subtitle: "Projetos Corporativos, Escritórios & Lojas",
              share: "15.0% do Mercado",
              badgeColor: "blue",
              icon: "fa-building",
              demographics: "Empresários & Gestores (30 a 55 anos) | Pontos Comerciais & Escritórios",
              pains: [
                "Rigor absoluto nos prazos de entrega para abertura e inauguração do negócio",
                "Exigência de acessibilidade técnica (NBR 9050) e fluxo eficiente de clientes",
                "Foco no Retorno Sobre o Investimento (ROI) e valorização da marca",
                "Valoriza maquetes 3D rápidas e detalhamento executivo completo"
              ],
              ticket: "R$ 5.000 a R$ 15.000+ (Por Projeto ou R$/m²)"
            },
            {
              title: "Comprador de Consultoria",
              subtitle: "Viabilidade, Acessibilidade & Adaptação",
              share: "57.4% do Mercado",
              badgeColor: "emerald",
              icon: "fa-universal-access",
              demographics: "Famílias (35-50+ anos) | Inquilinos & Imóveis para Adaptação",
              pains: [
                "Dúvidas sobre o aproveitamento real do espaço antes de comprar ou alugar",
                "Necessidade de rotas acessíveis, banheiros adaptados e iluminação eficiente",
                "Forte afinidade com responsabilidade social e apoio à Fundação eSTAR (66.7%)",
                "Busca por intervenções técnicas rápidas sem obras físicas estruturais"
              ],
              ticket: "R$ 1.500 a R$ 4.000 (Hora Técnica / Laudo Diagnóstico)"
            }
          ]
        }
      ]
    }
  ]
};
