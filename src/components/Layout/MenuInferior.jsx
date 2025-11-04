// MenuInferiorOrcamentix.jsx
// Este é um exemplo de como integrar o FAQ no menu inferior existente do Orçamentix

import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  HelpCircle,
  Plus
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import FAQOrcamentix from './FAQ/FAQOrcamentix';

const MenuInferiorOrcamentix = () => {
  const location = useLocation();
  const [showFAQ, setShowFAQ] = useState(false);

  // Função para verificar se o item está ativo
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Menu Inferior Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
        <div className="grid grid-cols-5 gap-1 px-2 py-1">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
              isActive('/dashboard') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Início</span>
          </Link>

          {/* Orçamentos */}
          <Link
            to="/orcamentos"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
              isActive('/orcamentos') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs mt-1">Orçamentos</span>
          </Link>

          {/* Botão Novo Orçamento (Central) */}
          <Link
            to="/orcamentos/novo"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white transform hover:scale-105 transition-all"
          >
            <div className="relative">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs mt-1">Novo</span>
          </Link>

          {/* Clientes */}
          <Link
            to="/clientes"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
              isActive('/clientes') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Clientes</span>
          </Link>

          {/* FAQ - NOVO BOTÃO */}
          <button
            onClick={() => setShowFAQ(true)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs mt-1">Ajuda</span>
          </button>
        </div>
      </div>

      {/* Menu Desktop (Lateral ou Superior) - Versão Desktop */}
      <div className="hidden md:flex fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowFAQ(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Dúvidas e Informações</span>
        </button>
      </div>

      {/* Renderiza o Modal do FAQ quando necessário */}
      {showFAQ && (
        <div className="fixed inset-0 z-50">
          <FAQOrcamentix onClose={() => setShowFAQ(false)} />
        </div>
      )}
    </>
  );
};

// Componente alternativo: Apenas o Botão FAQ para adicionar onde quiser
export const BotaoFAQOrcamentix = () => {
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowFAQ(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
        title="Dúvidas e Informações"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Dúvidas e Informações</span>
        <span className="sm:hidden">FAQ</span>
      </button>

      {showFAQ && (
        <div className="fixed inset-0 z-50">
          <FAQOrcamentix onClose={() => setShowFAQ(false)} />
        </div>
      )}
    </>
  );
};

export default MenuInferiorOrcamentix;