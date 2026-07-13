import React, { useState } from "react";
import { User } from "../types";
import { LocalDB } from "../db";
import { 
  Settings, Key, AlertTriangle, ShieldAlert, CheckCircle, Trash2, HelpCircle, Cpu, Sparkles, Eye, EyeOff 
} from "lucide-react";

interface SettingsViewProps {
  user: User;
  onLogout: () => void;
  onProfileUpdate: (updates: Partial<User>) => void;
}

export default function SettingsView({ user, onLogout, onProfileUpdate }: SettingsViewProps) {
  // AI Provider state
  const [preferredProvider, setPreferredProvider] = useState<"gemini" | "openai">(user.preferredProvider || "gemini");
  const [openaiApiKey, setOpenaiApiKey] = useState(user.openaiApiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState("");

  const handleAISave = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate({
      preferredProvider,
      openaiApiKey: preferredProvider === "openai" ? openaiApiKey : ""
    });
    setAiSuccessMsg("Configurações de Inteligência Artificial salvas com sucesso!");
    setTimeout(() => setAiSuccessMsg(""), 3000);
  };

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Feedback states
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Validation Checklist States
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  // Handle password updates
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMsg("Todos os campos de senha são obrigatórios.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("As novas senhas não coincidem.");
      return;
    }

    const isStrong = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
    if (!isStrong) {
      setErrorMsg("A nova senha não atende a todos os critérios de segurança estabelecidos.");
      return;
    }

    setLoading(true);

    try {
      const res = await LocalDB.changePassword(user.id, currentPassword, newPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg("Ocorreu um erro ao tentar alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Account Flow with Cloud Firestore cleanup
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("ATENÇÃO: Tem certeza de que deseja excluir permanentemente sua conta? Esta ação é irreversível e todos os seus currículos e simulações serão perdidos.");
    if (confirmDelete) {
      try {
        await LocalDB.deleteAccount(user.id);
        alert("Sua conta foi excluída com sucesso.");
        onLogout();
      } catch (err) {
        alert("Ocorreu um erro ao excluir a conta.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-1 sm:p-2" id="settings-view-container">
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-2.5 text-sm border border-emerald-100 animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl flex items-start gap-2.5 text-sm border border-red-100 animate-shake">
          <ShieldAlert className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* AI Provider Config Block */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-900" /> Inteligência Artificial & Modelos
            </h3>
            <p className="text-xs text-slate-500 leading-normal mt-1">
              Escolha seu provedor de IA favorito para alimentar o assistente, o simulador de entrevista e o gerador de currículos.
            </p>
          </div>

          {aiSuccessMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 text-xs border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>{aiSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleAISave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreferredProvider("gemini")}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-28 ${
                  preferredProvider === "gemini"
                    ? "border-blue-900 bg-blue-50/40 text-blue-950 font-bold"
                    : "border-slate-200 bg-slate-50/20 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-bold uppercase tracking-wider">Google Gemini</span>
                  <Sparkles className={`w-4 h-4 ${preferredProvider === "gemini" ? "text-blue-900 animate-pulse" : "text-slate-400"}`} />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-800">Gemini 3.5 Flash</span>
                  <span className="text-[11px] text-slate-500 leading-tight">Incluso por padrão no Colégio, rápido e robusto.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredProvider("openai")}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-28 ${
                  preferredProvider === "openai"
                    ? "border-blue-900 bg-blue-50/40 text-blue-950 font-bold"
                    : "border-slate-200 bg-slate-50/20 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-bold uppercase tracking-wider">OpenAI GPT</span>
                  <Cpu className={`w-4 h-4 ${preferredProvider === "openai" ? "text-blue-900 animate-pulse" : "text-slate-400"}`} />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-800">GPT-4o-mini</span>
                  <span className="text-[11px] text-slate-500 leading-tight">Excelente redação e feedbacks de currículo (requer chave).</span>
                </div>
              </button>
            </div>

            {preferredProvider === "openai" && (
              <div className="space-y-2 animate-fade-in">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Sua Chave de API OpenAI</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <span>Sua chave é salva localmente e de forma totalmente privada em seu navegador.</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition flex items-center justify-center cursor-pointer shadow-md"
            >
              Salvar Preferência de IA
            </button>
          </form>
        </div>

        {/* Change Password Block Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-900" /> Alterar Senha de Acesso
            </h3>
            <p className="text-xs text-slate-500 leading-normal mt-1">
              Mantenha sua senha atualizada e segura utilizando os padrões recomendados pelo setor de TI do Colégio.
            </p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Senha Atual</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Insira sua senha atual"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Nova Senha</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Insira nova senha forte"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            {newPassword.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                <span className="block font-bold text-slate-700">Checklist de segurança:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600" : "text-slate-400"}`}>
                    <span>{hasMinLength ? "✅" : "❌"}</span> Mínimo 8 caracteres
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-600" : "text-slate-400"}`}>
                    <span>{hasUpperCase ? "✅" : "❌"}</span> Letra maiúscula
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLowerCase ? "text-emerald-600" : "text-slate-400"}`}>
                    <span>{hasLowerCase ? "✅" : "❌"}</span> Letra minúscula
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600" : "text-slate-400"}`}>
                    <span>{hasNumber ? "✅" : "❌"}</span> Pelo menos 1 número
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600" : "text-slate-400"}`}>
                    <span>{hasSpecial ? "✅" : "❌"}</span> Caractere especial
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Confirmar Nova Senha</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirme nova senha"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition flex items-center justify-center cursor-pointer shadow-md"
              id="settings-password-save"
            >
              {loading ? "Atualizando..." : "Atualizar minha senha"}
            </button>
          </form>
        </div>

        {/* Danger Area Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Zona de Segurança
          </h3>
          <p className="text-[11px] text-slate-500 leading-normal">
            A exclusão da conta removerá em definitivo o seu acesso ao portal e todos os dados guardados em nossos arquivos virtuais locais.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200/60 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer outline-none"
            id="settings-delete-account-btn"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir Conta Permanentemente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
