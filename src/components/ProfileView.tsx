import React, { useState, useEffect } from "react";
import { User } from "../types";
import { LocalDB } from "../db";
import { 
  User as UserIcon, Mail, Phone, MapPin, BookOpen, Target, Sparkles, Clipboard, Check, Camera, RefreshCw, Save, AlertCircle 
} from "lucide-react";

interface ProfileViewProps {
  user: User;
  onProfileUpdate: (updated: User) => void;
}

export default function ProfileView({ user, onProfileUpdate }: ProfileViewProps) {
  // Input fields
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [city, setCity] = useState(user.city || "");
  const [course, setCourse] = useState(user.course || "");
  const [objective, setObjective] = useState(user.objective || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [languages, setLanguages] = useState(user.languages || "");
  
  // Custom seed for Dicebear adventure avatar generator
  const [avatarSeed, setAvatarSeed] = useState(user.name || "Lucas");

  // Feedback notifications
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const profilePercent = LocalDB.getProfileCompletion(user);

  useEffect(() => {
    // Keep internal state in sync with updated context from parent
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setCity(user.city || "");
    setCourse(user.course || "");
    setObjective(user.objective || "");
    setSkills(user.skills || "");
    setLanguages(user.languages || "");
  }, [user]);

  // Handle saving profile changes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    setTimeout(() => {
      try {
        const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`;
        const updates: Partial<User> = {
          name,
          email,
          phone,
          city,
          course,
          objective,
          skills,
          languages,
          avatarUrl
        };

        const updatedUser = LocalDB.updateProfile(user.id, updates);
        onProfileUpdate(updatedUser);
        setSuccessMsg("Perfil atualizado com sucesso!");
      } catch (err: any) {
        setErrorMsg("Erro ao salvar dados do perfil.");
      } finally {
        setSaving(false);
      }
    }, 600);
  };

  const handleRandomAvatar = () => {
    const randomSeeds = ["Arthur", "Gabriela", "Julio", "Helena", "Pedro", "Mariana", "Tiago", "Sofia", "Daniel", "Luiza"];
    const seed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)] + Math.floor(Math.random() * 100);
    setAvatarSeed(seed);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-1 sm:p-2" id="profile-view-container">
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-2.5 text-sm border border-emerald-100 animate-fade-in">
          <Check className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl flex items-start gap-2.5 text-sm border border-red-100 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Profile Header Block */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden p-1 shadow-sm">
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`}
                alt="Selected Avatar"
                className="w-20 h-20 object-cover rounded-xl"
              />
            </div>
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="absolute -bottom-2 -right-2 p-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-lg border border-blue-950 transition outline-none cursor-pointer"
              title="Gerar avatar aleatório"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{user.name || "Seu Nome"}</h2>
            <p className="text-xs text-slate-400 font-mono">{user.course || "Nenhum curso selecionado"}</p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
              <div className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100 uppercase">
                {profilePercent}% preenchido
              </div>
              <span className="text-[11px] text-slate-400">Insira todos os dados para liberar 100% da avaliação IA.</span>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nome Completo</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setAvatarSeed(e.target.value);
                }}
                placeholder="Lucas Silva"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">E-mail para Contato</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Telefone / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98888-7777"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Cidade / Estado</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="São Paulo - SP"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Curso do Lynx EDU Sistemas Escolares Inteligentes</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
              <select
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition appearance-none"
              >
                <option value="">Selecione seu curso...</option>
                <option value="Técnico em Enfermagem">Técnico em Enfermagem</option>
                <option value="Técnico em Radiologia">Técnico em Radiologia</option>
                <option value="Técnico em Segurança do Trabalho">Técnico em Segurança do Trabalho</option>
                <option value="Especialização em Instrumentação Cirúrgica">Especialização em Instrumentação Cirúrgica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Competências Principais</label>
            <div className="relative">
              <Clipboard className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Ex: Excel, HTML, CSS, Comunicação ágil"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Objetivo Profissional</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Descreva o que busca na sua vaga de primeiro emprego ou estágio no Colégio..."
              rows={3}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Idiomas</label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="Ex: Português (Nativo), Inglês (Intermediário)"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
          </div>
        </div>

        {/* Submit Block */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            id="profile-save-btn"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
