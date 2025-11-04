import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Privacy() {
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
            Política de Privacidade
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              1. Introdução
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Bem-vindo ao Orçamentix. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços. Ao usar o Orçamentix, você concorda com os termos desta política.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              2. Informações que Coletamos
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                  2.1. Informações Fornecidas por Você
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nome completo</li>
                  <li>Endereço de e-mail</li>
                  <li>Nome da empresa</li>
                  <li>Telefone (opcional)</li>
                  <li>Dados de clientes e orçamentos que você criar</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                  2.2. Informações Coletadas Automaticamente
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Endereço IP</li>
                  <li>Tipo de navegador e dispositivo</li>
                  <li>Páginas visitadas e tempo de uso</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              3. Como Usamos Suas Informações
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar suas solicitações e transações</li>
              <li>Enviar notificações importantes sobre sua conta</li>
              <li>Personalizar sua experiência</li>
              <li>Prevenir fraudes e garantir a segurança</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              4. Compartilhamento de Informações
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
              <li><strong>Provedores de Serviço:</strong> Com empresas que nos auxiliam (hospedagem, pagamento, etc.)</li>
              <li><strong>Requisitos Legais:</strong> Quando exigido por lei ou ordem judicial</li>
              <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
              <li><strong>Com Seu Consentimento:</strong> Quando você autorizar explicitamente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              5. Cookies
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Utilizamos cookies para melhorar sua experiência, lembrar suas preferências e analisar o uso do serviço. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              6. Segurança dos Dados
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia SSL/TLS, armazenamento seguro e controles de acesso rigorosos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              7. Seus Direitos (LGPD)
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
              <li>Confirmar a existência de tratamento de seus dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
              <li>Solicitar a portabilidade dos dados</li>
              <li>Revogar seu consentimento</li>
            </ul>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
              Para exercer seus direitos, entre em contato conosco através de: <strong>privacidade@orcamentix.com.br</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              8. Retenção de Dados
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              9. Alterações nesta Política
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por e-mail ou através de um aviso em nosso site. Recomendamos que você revise esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
              10. Contato
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato conosco:
            </p>
            <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-zinc-900 dark:text-white font-medium">Orçamentix</p>
              <p className="text-zinc-600 dark:text-zinc-400">E-mail: privacidade@orcamentix.com.br</p>
              <p className="text-zinc-600 dark:text-zinc-400">Encarregado de Dados (DPO): dpo@orcamentix.com.br</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
