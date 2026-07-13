import React, { useState, useEffect } from "react";
import { LocalDB } from "../db";
import { User } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Mail, User as UserIcon, BookOpen, Key, Check, AlertCircle, Eye, EyeOff, ShieldAlert, Sparkles 
} from "lucide-react";
import LynxLogo from "./LynxLogo";

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = "login" | "register" | "forgot" | "reset";

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  
  // Password Visibility Toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Validation Checklist States
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);

  useEffect(() => {
    // Perform real-time password analysis
    setHasMinLength(password.length >= 8);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasSpecial(/[^A-Za-z0-9]/.test(password));
  }, [password]);

  // Calculate Password Strength Score
  const getPasswordStrength = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (password.length === 0) return { label: "", color: "bg-gray-200", text: "text-gray-400", width: "w-0" };
    if (score <= 2) return { label: "Fraca", color: "bg-red-500", text: "text-red-500", width: "w-1/4" };
    if (score === 3) return { label: "Média", color: "bg-yellow-500", text: "text-yellow-500", width: "w-2/4" };
    if (score === 4) return { label: "Forte", color: "bg-green-500", text: "text-green-500", width: "w-3/4" };
    return { label: "Muito Forte", color: "bg-blue-500", text: "text-blue-500", width: "w-full" };
  };

  const strength = getPasswordStrength();

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (!email || !password) {
          setErrorMsg("Por favor, preencha todos os campos.");
          setLoading(false);
          return;
        }
        const res = await LocalDB.signIn(email, password);
        if (res.success && res.user) {
          setSuccessMsg("Bem-vindo de volta! Redirecionando...");
          setTimeout(() => onAuthSuccess(res.user!), 1000);
        } else {
          setErrorMsg(res.message);
        }
      } 
      else if (mode === "register") {
        if (!name || !email || !course || !password || !confirmPassword) {
          setErrorMsg("Todos os campos são obrigatórios.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg("As senhas não coincidem.");
          setLoading(false);
          return;
        }
        
        // Verify password strength requirements
        const isStrong = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
        if (!isStrong) {
          setErrorMsg("A senha precisa atender a todos os requisitos de segurança.");
          setLoading(false);
          return;
        }

        const res = await LocalDB.signUp(name, email, course, password);
        if (res.success && res.user) {
          setSuccessMsg("Cadastro efetuado com sucesso! Redirecionando...");
          setTimeout(() => onAuthSuccess(res.user!), 1200);
        } else {
          setErrorMsg(res.message);
        }
      } 
      else if (mode === "forgot") {
        if (!email) {
          setErrorMsg("Digite seu e-mail cadastrado.");
          setLoading(false);
          return;
        }
        const res = await LocalDB.requestPasswordReset(email);
        if (res.success) {
          setSuccessMsg("Código de redefinição enviado com sucesso! Verifique seu e-mail.");
          setTimeout(() => setMode("reset"), 2000);
        } else {
          setErrorMsg(res.message);
        }
      } 
      else if (mode === "reset") {
        if (!password || !confirmPassword) {
          setErrorMsg("Preencha e confirme a nova senha.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg("As senhas não coincidem.");
          setLoading(false);
          return;
        }
        const isStrong = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
        if (!isStrong) {
          setErrorMsg("A senha precisa atender a todos os requisitos de segurança.");
          setLoading(false);
          return;
        }

        const res = await LocalDB.resetPassword(password);
        if (res.success) {
          setSuccessMsg("Senha atualizada! Redirecionando para a plataforma...");
          const user = LocalDB.getSessionUser();
          if (user) {
            setTimeout(() => onAuthSuccess(user), 1500);
          } else {
            setMode("login");
          }
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err: any) {
      setErrorMsg("Ocorreu um erro no sistema. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row justify-center items-stretch overflow-hidden select-none" id="auth-container">
      {/* Decorative Brand Panel */}
      <div className="md:w-1/2 bg-blue-900 text-white flex flex-col justify-between p-8 md:p-16 relative">
        {/* Background Gradients/Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-700 rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full filter blur-3xl opacity-10 -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <LynxLogo size="lg" />
          </div>
        </div>

        <div className="relative z-10 max-w-lg my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-800 text-blue-200 border border-blue-700/50 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Alunos Lynx EDU Sistemas Escolares Inteligentes
            </span>
            <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight mb-4">
              Seu caminho inteligente para o <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">primeiro emprego.</span>
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-6 font-sans">
              Desenvolva seu currículo com inteligência artificial, treine com nosso simulador realista de entrevistas de emprego e receba conselhos personalizados do nosso consultor IA.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-blue-300 font-mono mt-8 flex flex-col gap-1">
          <span>Lynx EDU Sistemas Escolares Inteligentes • © 2026</span>
          <span className="text-blue-400/80">Plataforma Educacional Segura</span>
        </div>
      </div>

      {/* Auth Forms Panel */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 md:p-16 relative overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <AnimatePresence mode="wait">
            {/* LOGIN MODE */}
            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-sans font-bold text-slate-900 tracking-tight">Acesse sua conta</h2>
                  <p className="text-slate-500 text-sm mt-1">Insira suas credenciais do Lynx EDU Sistemas Escolares Inteligentes.</p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 mb-6 bg-red-50 text-red-600 rounded-xl flex items-start gap-2.5 text-sm border border-red-100 animate-shake">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3.5 mb-6 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-2.5 text-sm border border-emerald-100">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.nome@aluno.oswaldocruz.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                        id="login-email"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Senha</label>
                      <button 
                        type="button" 
                        onClick={() => setMode("forgot")}
                        className="text-xs font-medium text-blue-600 hover:underline outline-none"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha secreta"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                        id="login-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 focus:ring-4 focus:ring-blue-100 active:bg-blue-950 transition flex items-center justify-center shadow-lg shadow-blue-950/10 cursor-pointer"
                    id="login-submit-btn"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Entrar na plataforma"
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-3">
                  <p className="text-sm text-slate-600">
                    Ainda não tem cadastro?{" "}
                    <button 
                      onClick={() => setMode("register")}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Cadastre-se grátis
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* REGISTER MODE */}
            {mode === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-sans font-bold text-slate-900 tracking-tight">Crie sua conta</h2>
                  <p className="text-slate-500 text-sm mt-1">Exclusivo para alunos Lynx EDU.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-2 text-sm border border-red-100 animate-shake">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 mb-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-2 text-sm border border-emerald-100">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nome Completo</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Lucas Silva"
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
                        id="reg-name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.nome@aluno.oswaldocruz.com"
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
                        id="reg-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Seu Curso</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                      <select
                        required
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none appearance-none"
                        id="reg-course"
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
                        id="reg-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                    
                    {/* Security message requested */}
                    <p className="text-[11px] text-slate-500 leading-normal mt-1 flex items-start gap-1">
                      <span className="shrink-0 mt-0.5">🔐</span>
                      <span>Sua segurança é importante! Escolha uma senha com pelo menos 8 caracteres, combinando letras maiúsculas, letras minúsculas, números e símbolos para tornar sua conta mais protegida.</span>
                    </p>

                    {/* PASSWORD STRENGTH METER */}
                    {password.length > 0 && (
                      <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="text-slate-500 font-medium">Força da Senha:</span>
                          <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${strength.color} transition-all duration-300 ${strength.width}`}></div>
                        </div>

                        {/* Real-time Validation Checklist */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasMinLength ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasMinLength ? "text-slate-800" : "text-slate-400"}>Mínimo de 8 caracteres</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasUpperCase ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasUpperCase ? "text-slate-800" : "text-slate-400"}>1 letra maiúscula</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasLowerCase ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasLowerCase ? "text-slate-800" : "text-slate-400"}>1 letra minúscula</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasNumber ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasNumber ? "text-slate-800" : "text-slate-400"}>1 número</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasSpecial ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasSpecial ? "text-slate-800" : "text-slate-400"}>1 caractere especial</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Confirmar Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Digite a senha novamente"
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
                        id="reg-confirm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 active:bg-blue-950 transition flex items-center justify-center shadow-md cursor-pointer mt-2"
                    id="reg-submit-btn"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Criar minha conta"
                    )}
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-600">
                    Já possui uma conta?{" "}
                    <button 
                      onClick={() => setMode("login")}
                      className="font-bold text-blue-600 hover:underline outline-none"
                    >
                      Faça login
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-sans font-bold text-slate-900 tracking-tight">Esqueci minha senha</h2>
                  <p className="text-slate-500 text-sm mt-1">Não se preocupe! Insira seu e-mail para receber o código de recuperação.</p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 mb-6 bg-red-50 text-red-600 rounded-xl flex items-start gap-2.5 text-sm border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3.5 mb-6 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-2.5 text-sm border border-emerald-100">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">E-mail Cadastrado</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.nome@aluno.oswaldocruz.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
                        id="forgot-email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition flex items-center justify-center shadow-md cursor-pointer"
                    id="forgot-submit-btn"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Enviar instruções"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition text-center block outline-none cursor-pointer"
                  >
                    Voltar para o Login
                  </button>
                </form>
              </motion.div>
            )}

            {/* RESET PASSWORD MODE (SIMULATED FLOW) */}
            {mode === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-sans font-bold text-slate-900 tracking-tight">Definir nova senha</h2>
                  <p className="text-slate-500 text-sm mt-1">Crie uma nova senha forte para acessar sua conta.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-2 text-sm border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 mb-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-2 text-sm border border-emerald-100">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="p-3.5 mb-5 bg-blue-50 text-blue-800 rounded-xl text-xs border border-blue-100 flex items-start gap-2">
                  <Key className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                  <span>Código de validação preenchido automaticamente de seu fluxo de redefinição para <strong>{email}</strong>.</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo de 8 caracteres"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
                        id="reset-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* PASSWORD STRENGTH METER */}
                    {password.length > 0 && (
                      <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="text-slate-500 font-medium">Força da Senha:</span>
                          <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${strength.color} transition-all duration-300 ${strength.width}`}></div>
                        </div>

                        {/* Real-time Validation Checklist */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasMinLength ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasMinLength ? "text-slate-800" : "text-slate-400"}>Mínimo de 8 caracteres</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasUpperCase ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasUpperCase ? "text-slate-800" : "text-slate-400"}>1 letra maiúscula</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasLowerCase ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasLowerCase ? "text-slate-800" : "text-slate-400"}>1 letra minúscula</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasNumber ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasNumber ? "text-slate-800" : "text-slate-400"}>1 número</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasSpecial ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={hasSpecial ? "text-slate-800" : "text-slate-400"}>1 caractere especial</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Confirmar Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Digite a senha novamente"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
                        id="reset-confirm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition flex items-center justify-center shadow-md cursor-pointer"
                    id="reset-submit-btn"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Atualizar Senha e Entrar"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
