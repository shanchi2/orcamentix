import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, X, Send, User, Mail, Phone, CheckCircle, FileText, Calculator, Clock, CreditCard, Shield } from 'lucide-react';

const FAQ = ({ onClose }) => {
  // Estados para controlar o sistema
  const [isModalOpen, setIsModalOpen] = useState(true); // Começa aberto quando componente é renderizado
  const [currentStep, setCurrentStep] = useState('userData'); 
  const [expandedItems, setExpandedItems] = useState({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  
  // Dados do usuário
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Dúvida do usuário
  const [userQuestion, setUserQuestion] = useState('');

  // FAQ específico do Orçamentix
  const faqData = [
    {
      id: 1,
      category: "Sobre o Orçamentix",
      icon: <FileText className="w-4 h-4" />,
      question: "O que é o Orçamentix?",
      answer: "O Orçamentix é um sistema profissional de criação e gestão de orçamentos. Com ele você pode criar orçamentos detalhados, adicionar produtos/serviços, aplicar descontos, gerar PDFs profissionais e acompanhar o status de cada proposta enviada aos seus clientes."
    },
    {
      id: 2,
      category: "Sobre o Orçamentix",
      icon: <FileText className="w-4 h-4" />,
      question: "Posso personalizar os orçamentos com minha logo?",
      answer: "Sim! O Orçamentix permite total personalização. Você pode adicionar sua logo, informações da empresa, cores da marca e criar templates personalizados para diferentes tipos de orçamentos. Tudo para manter sua identidade visual profissional."
    },
    {
      id: 3,
      category: "Criação de Orçamentos",
      icon: <Calculator className="w-4 h-4" />,
      question: "Como criar meu primeiro orçamento?",
      answer: "É muito simples! Clique em 'Novo Orçamento' no menu superior, preencha os dados do cliente, adicione os produtos ou serviços com suas quantidades e valores. O sistema calcula automaticamente os totais. Depois é só revisar e enviar!"
    },
    {
      id: 4,
      category: "Criação de Orçamentos",
      icon: <Calculator className="w-4 h-4" />,
      question: "Posso salvar produtos/serviços para usar depois?",
      answer: "Sim! O Orçamentix tem um cadastro de produtos e serviços. Você pode salvar todos os seus itens com descrições e preços, e depois é só selecionar da lista quando criar um novo orçamento. Isso agiliza muito o processo!"
    },
    {
      id: 5,
      category: "Criação de Orçamentos",
      icon: <Calculator className="w-4 h-4" />,
      question: "Como aplicar descontos?",
      answer: "Você pode aplicar descontos de duas formas: percentual (%) ou valor fixo (R$). Pode aplicar desconto em itens individuais ou no valor total do orçamento. O sistema recalcula tudo automaticamente e mostra o valor final ao cliente."
    },
    {
      id: 6,
      category: "Gestão e Acompanhamento",
      icon: <Clock className="w-4 h-4" />,
      question: "Como acompanhar o status dos orçamentos?",
      answer: "No painel principal você visualiza todos os orçamentos com seus status: Pendente, Aprovado, Recusado ou Expirado. Use os filtros para encontrar rapidamente um orçamento específico por cliente, data ou status."
    },
    {
      id: 7,
      category: "Gestão e Acompanhamento",
      icon: <Clock className="w-4 h-4" />,
      question: "Os orçamentos têm prazo de validade?",
      answer: "Sim! Você define o prazo de validade de cada orçamento (padrão de 30 dias, mas personalizável). O sistema alerta quando um orçamento está próximo de expirar e marca automaticamente como expirado após a data."
    },
    {
      id: 8,
      category: "Gestão e Acompanhamento",
      icon: <Clock className="w-4 h-4" />,
      question: "Posso editar um orçamento depois de enviado?",
      answer: "Sim! Você pode criar uma nova versão do orçamento com as alterações necessárias. O sistema mantém um histórico de todas as versões para você acompanhar as mudanças e negociações com o cliente."
    },
    {
      id: 9,
      category: "Envio e Compartilhamento",
      icon: <Send className="w-4 h-4" />,
      question: "Como enviar o orçamento para o cliente?",
      answer: "Você tem várias opções: gerar um PDF para enviar por e-mail, compartilhar um link direto para visualização online, ou enviar por WhatsApp. O cliente pode aprovar o orçamento diretamente pelo link, facilitando o fechamento!"
    },
    {
      id: 10,
      category: "Envio e Compartilhamento",
      icon: <Send className="w-4 h-4" />,
      question: "O cliente pode aprovar online?",
      answer: "Sim! Quando você envia o link do orçamento, o cliente pode visualizar todos os detalhes e clicar em 'Aprovar Orçamento'. Você recebe uma notificação instantânea e pode dar sequência no atendimento."
    },
    {
      id: 11,
      category: "Pagamento e Planos",
      icon: <CreditCard className="w-4 h-4" />,
      question: "O Orçamentix é gratuito?",
      answer: "Oferecemos um plano gratuito com recursos básicos para você começar. Para funcionalidades avançadas como relatórios, múltiplos usuários, integrações e templates premium, temos planos pagos com preços acessíveis."
    },
    {
      id: 12,
      category: "Pagamento e Planos",
      icon: <CreditCard className="w-4 h-4" />,
      question: "Quais formas de pagamento são aceitas?",
      answer: "Aceitamos cartão de crédito, boleto bancário e PIX. Os planos podem ser mensais ou anuais (com desconto). Você pode fazer upgrade, downgrade ou cancelar a qualquer momento pelo painel de configurações."
    },
    {
      id: 13,
      category: "Segurança e Dados",
      icon: <Shield className="w-4 h-4" />,
      question: "Meus dados estão seguros?",
      answer: "Absolutamente! Usamos criptografia de ponta a ponta, servidores seguros e fazemos backups diários. Seus dados e os dos seus clientes estão protegidos. Seguimos a LGPD e você pode exportar ou deletar seus dados quando quiser."
    },
    {
      id: 14,
      category: "Segurança e Dados",
      icon: <Shield className="w-4 h-4" />,
      question: "Posso fazer backup dos meus orçamentos?",
      answer: "Sim! Você pode exportar todos os seus orçamentos em formato PDF ou Excel. Também fazemos backups automáticos diários na nuvem. Você nunca perderá seus dados!"
    },
    {
      id: 15,
      category: "Suporte e Ajuda",
      icon: <HelpCircle className="w-4 h-4" />,
      question: "Como obter suporte técnico?",
      answer: "Estamos aqui para ajudar! Use este FAQ para dúvidas rápidas, acesse nossos tutoriais em vídeo, ou entre em contato pelo WhatsApp para suporte personalizado. Respondemos em até 24 horas úteis!"
    }
  ];

  // Agrupa perguntas por categoria
  const groupedFAQ = faqData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Função para abrir/fechar modal
  const toggleModal = () => {
    if (onClose) {
      onClose();
    } else {
      setIsModalOpen(!isModalOpen);
      if (!isModalOpen) {
        setCurrentStep('userData');
        setShowContactForm(false);
        setMessageSent(false);
        setUserQuestion('');
      }
    }
  };

  // Função para expandir/contrair pergunta
  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Função para validar dados do usuário
  const validateUserData = () => {
    return userData.name && userData.email && userData.phone;
  };

  // Função para ir para o FAQ
  const proceedToFAQ = () => {
    if (validateUserData()) {
      setCurrentStep('faq');
    }
  };

  // Função para enviar mensagem via WhatsApp
  const sendToWhatsApp = () => {
    if (!userQuestion.trim()) return;

    // Número do WhatsApp da empresa
    const whatsappNumber = '5514998466583'; // Seu número já configurado
    
    // Monta a mensagem
    const message = `*Dúvida do FAQ - Orçamentix*\n\n` +
                   `*Cliente:* ${userData.name}\n` +
                   `*E-mail:* ${userData.email}\n` +
                   `*WhatsApp:* ${userData.phone}\n\n` +
                   `*Dúvida:* ${userQuestion}`;
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abre o WhatsApp com a mensagem pré-preenchida
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Mostra mensagem de sucesso
    setMessageSent(true);
    setUserQuestion('');
    
    // Fecha o modal após 3 segundos
    setTimeout(() => {
      if (onClose) {
        onClose();
      } else {
        toggleModal();
      }
    }, 3000);
  };

  // Previne scroll do body quando o modal está aberto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Ícone por categoria para visual mais rico
  const getCategoryIcon = (category) => {
    switch(category) {
      case "Sobre o Orçamentix":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "Criação de Orçamentos":
        return <Calculator className="w-5 h-5 text-green-600" />;
      case "Gestão e Acompanhamento":
        return <Clock className="w-5 h-5 text-purple-600" />;
      case "Envio e Compartilhamento":
        return <Send className="w-5 h-5 text-orange-600" />;
      case "Pagamento e Planos":
        return <CreditCard className="w-5 h-5 text-red-600" />;
      case "Segurança e Dados":
        return <Shield className="w-5 h-5 text-indigo-600" />;
      case "Suporte e Ajuda":
        return <HelpCircle className="w-5 h-5 text-teal-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleModal();
          }}
        >
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calculator className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Central de Ajuda - Orçamentix</h2>
                </div>
                <p className="text-blue-100 text-sm">
                  {currentStep === 'userData' && 'Precisamos de alguns dados para melhor atendê-lo'}
                  {currentStep === 'faq' && 'Tire suas dúvidas sobre o sistema de orçamentos'}
                </p>
              </div>
              <button
                onClick={toggleModal}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Step 1: Coleta de Dados */}
              {currentStep === 'userData' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Bem-vindo ao suporte do Orçamentix!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Para oferecermos o melhor atendimento, precisamos de algumas informações:
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Campo Nome */}
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Seu nome completo"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    {/* Campo E-mail */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Seu e-mail cadastrado no Orçamentix"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    {/* Campo Telefone */}
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="WhatsApp para contato"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  {/* Botão Continuar */}
                  <button
                    onClick={proceedToFAQ}
                    disabled={!validateUserData()}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      validateUserData()
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Acessar Perguntas Frequentes
                  </button>
                </div>
              )}

              {/* Step 2: FAQ */}
              {currentStep === 'faq' && (
                <div>
                  {/* Saudação personalizada */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <p className="text-gray-700">
                      Olá <span className="font-semibold text-blue-700">{userData.name}</span>! 
                      <span className="ml-1">Encontre abaixo as respostas para as principais dúvidas sobre o Orçamentix:</span>
                    </p>
                  </div>

                  {/* Lista de FAQs por categoria */}
                  {Object.entries(groupedFAQ).map(([category, questions]) => (
                    <div key={category} className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        {getCategoryIcon(category)}
                        <h4 className="text-lg font-semibold text-gray-800">
                          {category}
                        </h4>
                      </div>
                      
                      <div className="space-y-3">
                        {questions.map((item) => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                          >
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all"
                            >
                              <span className="font-medium text-gray-800 pr-3">
                                {item.question}
                              </span>
                              {expandedItems[item.id] ? (
                                <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                            </button>
                            
                            {/* Resposta expandível */}
                            {expandedItems[item.id] && (
                              <div className="px-5 pb-4 text-gray-600 leading-relaxed bg-gradient-to-b from-white to-gray-50">
                                {item.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Botão de contato */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="text-center mb-4">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-white rounded-full shadow-md">
                          <MessageCircle className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Não encontrou o que procurava?
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm">
                        Nossa equipe está pronta para ajudar com dúvidas específicas sobre o Orçamentix
                      </p>
                    </div>
                    
                    {!showContactForm ? (
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Falar com Suporte via WhatsApp
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          placeholder="Descreva sua dúvida sobre o Orçamentix..."
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                          rows="4"
                        />
                        
                        {!messageSent ? (
                          <button
                            onClick={sendToWhatsApp}
                            disabled={!userQuestion.trim()}
                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                              userQuestion.trim()
                                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transform hover:-translate-y-0.5 hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Send className="w-5 h-5" />
                            Enviar Dúvida via WhatsApp
                          </button>
                        ) : (
                          <div className="text-center p-6 bg-green-50 rounded-lg">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                            <h4 className="text-lg font-bold text-green-700">
                              Mensagem enviada com sucesso!
                            </h4>
                            <p className="text-green-600 mt-2 text-sm">
                              Nossa equipe responderá em breve pelo WhatsApp
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FAQ;