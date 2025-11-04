import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
          
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Termos de Uso
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ao acessar e usar o Orçamentix, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              O Orçamentix é uma plataforma SaaS (Software as a Service) que permite aos usuários criar, gerenciar e compartilhar orçamentos profissionais de forma rápida e eficiente. Oferecemos diferentes planos de assinatura com recursos variados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              3. Cadastro e Conta
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                <strong>3.1. Elegibilidade:</strong> Você deve ter pelo menos 18 anos para usar o Orçamentix. Ao se cadastrar, você declara ter capacidade legal para firmar este acordo.
              </p>
              <p>
                <strong>3.2. Informações Precisas:</strong> Você concorda em fornecer informações verdadeiras, precisas, atuais e completas durante o processo de cadastro.
              </p>
              <p>
                <strong>3.3. Segurança da Conta:</strong> Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta.
              </p>
              <p>
                <strong>3.4. Notificação de Uso Não Autorizado:</strong> Você deve notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              4. Planos e Pagamentos
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                <strong>4.1. Plano Gratuito:</strong> Oferecemos um plano gratuito com recursos limitados. Reservamo-nos o direito de modificar ou descontinuar o plano gratuito a qualquer momento.
              </p>
              <p>
                <strong>4.2. Planos Pagos:</strong> Os planos pagos são cobrados mensalmente ou anualmente, conforme sua escolha. Os preços estão sujeitos a alterações mediante aviso prévio de 30 dias.
              </p>
              <p>
                <strong>4.3. Renovação Automática:</strong> Sua assinatura será renovada automaticamente no final de cada período de cobrança, a menos que você cancele antes da data de renovação.
              </p>
              <p>
                <strong>4.4. Reembolsos:</strong> Oferecemos garantia de reembolso de 7 dias para novas assinaturas. Após esse período, não haverá reembolso proporcional.
              </p>
              <p>
                <strong>4.5. Impostos:</strong> Os preços não incluem impostos aplicáveis, que serão adicionados à sua fatura quando exigido por lei.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              5. Uso Aceitável
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Você concorda em NÃO usar o Orçamentix para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
              <li>Violar qualquer lei ou regulamento aplicável</li>
              <li>Infringir direitos de propriedade intelectual de terceiros</li>
              <li>Transmitir vírus, malware ou código malicioso</li>
              <li>Enviar spam ou comunicações não solicitadas</li>
              <li>Tentar obter acesso não autorizado a sistemas ou redes</li>
              <li>Interferir ou interromper o funcionamento do serviço</li>
              <li>Coletar informações de outros usuários sem consentimento</li>
              <li>Usar o serviço para atividades fraudulentas ou enganosas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              6. Propriedade Intelectual
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                <strong>6.1. Propriedade do Orçamentix:</strong> Todo o conteúdo, design, código, marcas e recursos do Orçamentix são de nossa propriedade ou licenciados para nós e estão protegidos por leis de propriedade intelectual.
              </p>
              <p>
                <strong>6.2. Seu Conteúdo:</strong> Você mantém todos os direitos sobre os dados e conteúdos que você cria no Orçamentix. Ao usar o serviço, você nos concede uma licença limitada para hospedar, armazenar e processar seu conteúdo.
              </p>
              <p>
                <strong>6.3. Feedback:</strong> Qualquer feedback, sugestão ou ideia que você nos fornecer pode ser usado por nós sem compensação ou atribuição.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              7. Privacidade e Segurança
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Levamos sua privacidade a sério. Nossas práticas de coleta e uso de dados são descritas em nossa <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Política de Privacidade</Link>. Implementamos medidas de segurança razoáveis para proteger seus dados, mas não podemos garantir segurança absoluta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              8. Cancelamento e Suspensão
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                <strong>8.1. Por Você:</strong> Você pode cancelar sua conta a qualquer momento através das configurações da conta. O cancelamento será efetivo no final do período de cobrança atual.
              </p>
              <p>
                <strong>8.2. Por Nós:</strong> Podemos suspender ou encerrar sua conta se você violar estes Termos de Uso ou por qualquer motivo, mediante aviso prévio, quando possível.
              </p>
              <p>
                <strong>8.3. Efeitos do Cancelamento:</strong> Após o cancelamento, você perderá acesso ao serviço e seus dados poderão ser excluídos após um período de retenção.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              9. Limitação de Responsabilidade
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              O Orçamentix é fornecido "como está" e "conforme disponível". Não garantimos que o serviço será ininterrupto, livre de erros ou totalmente seguro. Na máxima extensão permitida por lei, não seremos responsáveis por danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou incapacidade de usar o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              10. Indenização
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Você concorda em indenizar, defender e isentar o Orçamentix e seus funcionários, diretores e agentes de quaisquer reclamações, danos, perdas ou despesas (incluindo honorários advocatícios) decorrentes de seu uso do serviço ou violação destes termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              11. Modificações dos Termos
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Notificaremos você sobre mudanças significativas por e-mail ou através de um aviso em nosso site. O uso continuado do serviço após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              12. Lei Aplicável e Jurisdição
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil. Quaisquer disputas serão resolvidas nos tribunais da comarca de São Paulo, SP.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              13. Disposições Gerais
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                <strong>13.1. Acordo Completo:</strong> Estes termos constituem o acordo completo entre você e o Orçamentix.
              </p>
              <p>
                <strong>13.2. Renúncia:</strong> Nossa falha em exercer qualquer direito sob estes termos não constitui renúncia a esse direito.
              </p>
              <p>
                <strong>13.3. Divisibilidade:</strong> Se qualquer disposição for considerada inválida, as demais permanecerão em vigor.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              14. Contato
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-zinc-900 dark:text-white font-medium">Orçamentix</p>
              <p className="text-zinc-600 dark:text-zinc-400">E-mail: suporte@orcamentix.com.br</p>
              <p className="text-zinc-600 dark:text-zinc-400">Site: www.orcamentix.com.br</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
