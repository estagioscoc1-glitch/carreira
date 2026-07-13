import React, { useState, useEffect, useRef } from "react";
import { User } from "../types";
import { LocalDB } from "../db";
import { 
  User as UserIcon, Mail, Phone, MapPin, BookOpen, Target, Sparkles, Clipboard, Check, Camera, RefreshCw, Save, AlertCircle, Upload, Trash2, Palette, Glasses, Smile, Eye
} from "lucide-react";

interface ProfileViewProps {
  user: User;
  onProfileUpdate: (updated: User) => void;
}

// ---------------- DICTIONARIES AND OPTIONS ----------------

const SKIN_TONES_ADVENTURER = [
  { value: "ffd1b3", name: "Pálida", hex: "#ffd1b3" },
  { value: "f5c19b", name: "Clara", hex: "#f5c19b" },
  { value: "e0a370", name: "Média", hex: "#e0a370" },
  { value: "a56b46", name: "Parda", hex: "#a56b46" },
  { value: "804d2f", name: "Escura", hex: "#804d2f" },
  { value: "5a351f", name: "Negra", hex: "#5a351f" }
];

const HAIR_STYLES_ADVENTURER = [
  { value: "short01", name: "Curto Espetado" },
  { value: "short02", name: "Curto Casual" },
  { value: "short03", name: "Curto Ondulado" },
  { value: "short04", name: "Curto Clássico" },
  { value: "short05", name: "Militar" },
  { value: "short06", name: "Topete" },
  { value: "short07", name: "Repicado" },
  { value: "short08", name: "Bagunçado" },
  { value: "short09", name: "Franja" },
  { value: "short10", name: "Slick Back" },
  { value: "long01", name: "Longo Solto" },
  { value: "long02", name: "Longo Liso" },
  { value: "long03", name: "Longo Volumoso" },
  { value: "long04", name: "Longo Cacheado" },
  { value: "long05", name: "Tranças" }
];

const HAIR_COLORS_ADVENTURER = [
  { value: "090807", name: "Preto", hex: "#090807" },
  { value: "2c1b18", name: "C. Escuro", hex: "#2c1b18" },
  { value: "4a3728", name: "Castanho", hex: "#4a3728" },
  { value: "b5a183", name: "Loiro", hex: "#b5a183" },
  { value: "9a3324", name: "Ruivo", hex: "#9a3324" },
  { value: "d7607c", name: "Rosa", hex: "#d7607c" },
  { value: "4f46e5", name: "Azul", hex: "#4f46e5" },
  { value: "0d9488", name: "Verde Água", hex: "#0d9488" }
];

const ACCESSORIES_ADVENTURER = [
  { value: "", name: "Nenhum" },
  { value: "glasses", name: "Óculos de Grau" },
  { value: "roundGlasses", name: "Óculos Redondos" },
  { value: "sunglasses", name: "Óculos de Sol" }
];

const SKIN_TONES_AVATAAARS = [
  { value: "ffdbb4", name: "Clara", hex: "#ffdbb4" },
  { value: "f8d25c", name: "Amarela", hex: "#f8d25c" },
  { value: "edb98a", name: "Bronzeada", hex: "#edb98a" },
  { value: "fd9841", name: "Média Escura", hex: "#fd9841" },
  { value: "d08b5b", name: "Parda", hex: "#d08b5b" },
  { value: "ae5d29", name: "Escura", hex: "#ae5d29" },
  { value: "614335", name: "Negra", hex: "#614335" }
];

const HAIR_STYLES_AVATAAARS = [
  { value: "shortHair", name: "Curto Executivo" },
  { value: "longHair", name: "Longo Ondulado" },
  { value: "bunny", name: "Coque Alto" },
  { value: "hijab", name: "Hijab" },
  { value: "turban", name: "Turbante" },
  { value: "bob", name: "Corte Bob" },
  { value: "curly", name: "Cacheado" },
  { value: "dreads", name: "Dreads" },
  { value: "frida", name: "Tranças Frida" },
  { value: "shavedSides", name: "Lateral Raspada" },
  { value: "hat", name: "Boné" },
  { value: "noHair", name: "Careca" }
];

const HAIR_COLORS_AVATAAARS = [
  { value: "2c1b18", name: "Preto", hex: "#2c1b18" },
  { value: "3d2314", name: "C. Escuro", hex: "#3d2314" },
  { value: "4a3728", name: "Castanho", hex: "#4a3728" },
  { value: "b5814c", name: "Loiro Escuro", hex: "#b5814c" },
  { value: "e8c194", name: "Loiro Claro", hex: "#e8c194" },
  { value: "a55728", name: "Ruivo", hex: "#a55728" },
  { value: "c53a58", name: "Vermelho", hex: "#c53a58" },
  { value: "f59797", name: "Rosa", hex: "#f59797" }
];

const BEARD_STYLES_AVATAAARS = [
  { value: "blank", name: "Sem Barba" },
  { value: "beardLight", name: "Barba por Fazer" },
  { value: "beardMedium", name: "Barba Média" },
  { value: "beardMajestic", name: "Barba Cheia" },
  { value: "moustacheFancy", name: "Bigode Estiloso" },
  { value: "moustacheThin", name: "Bigode Fino" }
];

const ACCESSORIES_AVATAAARS = [
  { value: "blank", name: "Nenhum" },
  { value: "prescription01", name: "Óculos Retangulares" },
  { value: "prescription02", name: "Óculos de Grau" },
  { value: "round", name: "Óculos Redondos" },
  { value: "sunglasses", name: "Óculos de Sol" },
  { value: "wayfarers", name: "Wayfarer" }
];

const CLOTHING_STYLES_AVATAAARS = [
  { value: "blazerAndShirt", name: "Blazer e Camisa" },
  { value: "blazerAndSweater", name: "Blazer e Suéter" },
  { value: "collarAndSweater", name: "Suéter Gola Alta" },
  { value: "graphicShirt", name: "Camiseta Estampada" },
  { value: "hoodie", name: "Moletom" },
  { value: "shirtCrewNeck", name: "Camiseta Gola Redonda" },
  { value: "shirtVNeck", name: "Camiseta Gola V" }
];

const CLOTHING_COLORS_AVATAAARS = [
  { value: "263238", name: "Cinza", hex: "#263238" },
  { value: "4f46e5", name: "Índigo", hex: "#4f46e5" },
  { value: "0d9488", name: "Teal", hex: "#0d9488" },
  { value: "16a34a", name: "Verde", hex: "#16a34a" },
  { value: "e53935", name: "Vermelho", hex: "#e53935" },
  { value: "ea580c", name: "Laranja", hex: "#ea580c" },
  { value: "ffffff", name: "Branco", hex: "#ffffff" },
  { value: "000000", name: "Preto", hex: "#000000" }
];

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

  // Avatar Type & Mode Configuration
  const [avatarType, setAvatarType] = useState<"generated" | "uploaded">("generated");
  const [avatarStyle, setAvatarStyle] = useState<"adventurer" | "avataaars">("adventurer");
  
  // Custom generator parameters
  const [skinColor, setSkinColor] = useState("f5c19b");
  const [hairStyle, setHairStyle] = useState("short01");
  const [hairColor, setHairColor] = useState("2c1b18");
  const [beardStyle, setBeardStyle] = useState("blank");
  const [beardColor, setBeardColor] = useState("2c1b18");
  const [accessories, setAccessories] = useState("");
  const [clothingStyle, setClothingStyle] = useState("shirtCrewNeck");
  const [clothingColor, setClothingColor] = useState("4f46e5");

  // Uploaded photo state (data URI Base64)
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback notifications
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const profilePercent = LocalDB.getProfileCompletion(user);

  // Load avatar data on mount/user update
  useEffect(() => {
    // Sync text fields
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setCity(user.city || "");
    setCourse(user.course || "");
    setObjective(user.objective || "");
    setSkills(user.skills || "");
    setLanguages(user.languages || "");

    // Parse existing avatarUrl
    if (user.avatarUrl) {
      if (user.avatarUrl.startsWith("data:image/")) {
        setAvatarType("uploaded");
        setUploadedPhoto(user.avatarUrl);
      } else {
        setAvatarType("generated");
        try {
          const isAvataaars = user.avatarUrl.includes("avataaars");
          const urlObj = new URL(user.avatarUrl);
          const params = urlObj.searchParams;

          if (isAvataaars) {
            setAvatarStyle("avataaars");
            setSkinColor(params.get("skinColor") || "ffdbb4");
            setHairStyle(params.get("top") || "shortHair");
            setHairColor(params.get("hairColor") || "2c1b18");
            setBeardStyle(params.get("facialHair") || "blank");
            setBeardColor(params.get("facialHairColor") || "2c1b18");
            setAccessories(params.get("accessories") || "blank");
            setClothingStyle(params.get("clothing") || "shirtCrewNeck");
            setClothingColor(params.get("clothingColor") || "4f46e5");
          } else {
            setAvatarStyle("adventurer");
            setSkinColor(params.get("skinColor") || "f5c19b");
            setHairStyle(params.get("hair") || "short01");
            setHairColor(params.get("hairColor") || "2c1b18");
            setAccessories(params.get("features") || "");
          }
        } catch (e) {
          // If not a full valid URL but contains style name
          if (user.avatarUrl.includes("avataaars")) {
            setAvatarStyle("avataaars");
          } else {
            setAvatarStyle("adventurer");
          }
        }
      }
    }
  }, [user]);

  // Construct current dynamic Dicebear URL based on chosen settings
  const getPreviewUrl = () => {
    if (avatarStyle === "avataaars") {
      return `https://api.dicebear.com/7.x/avataaars/svg?skinColor=${skinColor}&top=${hairStyle}&hairColor=${hairColor}&facialHair=${beardStyle}&facialHairColor=${beardColor}&accessories=${accessories}&clothing=${clothingStyle}&clothingColor=${clothingColor}`;
    } else {
      const featuresParam = accessories ? `&features=${accessories}` : "";
      return `https://api.dicebear.com/7.x/adventurer/svg?skinColor=${skinColor}&hair=${hairStyle}&hairColor=${hairColor}${featuresParam}`;
    }
  };

  // Switch design styles and safely reset compatible options
  const handleStyleChange = (style: "adventurer" | "avataaars") => {
    setAvatarStyle(style);
    if (style === "avataaars") {
      setSkinColor("ffdbb4");
      setHairStyle("shortHair");
      setHairColor("2c1b18");
      setAccessories("blank");
    } else {
      setSkinColor("f5c19b");
      setHairStyle("short01");
      setHairColor("2c1b18");
      setAccessories("");
    }
  };

  // Dynamic randomization of selected engine's variables
  const handleRandomizeOptions = () => {
    setAvatarType("generated");
    if (avatarStyle === "adventurer") {
      const randomSkin = SKIN_TONES_ADVENTURER[Math.floor(Math.random() * SKIN_TONES_ADVENTURER.length)].value;
      const randomHair = HAIR_STYLES_ADVENTURER[Math.floor(Math.random() * HAIR_STYLES_ADVENTURER.length)].value;
      const randomHairColor = HAIR_COLORS_ADVENTURER[Math.floor(Math.random() * HAIR_COLORS_ADVENTURER.length)].value;
      const randomAcc = ACCESSORIES_ADVENTURER[Math.floor(Math.random() * ACCESSORIES_ADVENTURER.length)].value;
      
      setSkinColor(randomSkin);
      setHairStyle(randomHair);
      setHairColor(randomHairColor);
      setAccessories(randomAcc);
    } else {
      const randomSkin = SKIN_TONES_AVATAAARS[Math.floor(Math.random() * SKIN_TONES_AVATAAARS.length)].value;
      const randomHair = HAIR_STYLES_AVATAAARS[Math.floor(Math.random() * HAIR_STYLES_AVATAAARS.length)].value;
      const randomHairColor = HAIR_COLORS_AVATAAARS[Math.floor(Math.random() * HAIR_COLORS_AVATAAARS.length)].value;
      const randomBeard = BEARD_STYLES_AVATAAARS[Math.floor(Math.random() * BEARD_STYLES_AVATAAARS.length)].value;
      const randomBeardColor = HAIR_COLORS_AVATAAARS[Math.floor(Math.random() * HAIR_COLORS_AVATAAARS.length)].value;
      const randomAcc = ACCESSORIES_AVATAAARS[Math.floor(Math.random() * ACCESSORIES_AVATAAARS.length)].value;
      const randomCloth = CLOTHING_STYLES_AVATAAARS[Math.floor(Math.random() * CLOTHING_STYLES_AVATAAARS.length)].value;
      const randomClothColor = CLOTHING_COLORS_AVATAAARS[Math.floor(Math.random() * CLOTHING_COLORS_AVATAAARS.length)].value;
      
      setSkinColor(randomSkin);
      setHairStyle(randomHair);
      setHairColor(randomHairColor);
      setBeardStyle(randomBeard);
      setBeardColor(randomBeardColor);
      setAccessories(randomAcc);
      setClothingStyle(randomCloth);
      setClothingColor(randomClothColor);
    }
    setSuccessMsg("Novo avatar aleatório configurado! Salve para registrar.");
  };

  // Image scaling canvas-based compressor for keeping base64 lightweight and safe for localStorage
  const handlePhotoFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("O arquivo deve ser uma imagem válida (PNG, JPG, JPEG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 180; // Compact 180x180 resolution is clean & lightweight
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const base64Scaled = canvas.toDataURL("image/jpeg", 0.82); // High-performance jpeg encoding
          setUploadedPhoto(base64Scaled);
          setAvatarType("uploaded");
          setSuccessMsg("Sua foto foi enviada, otimizada e está pronta!");
          setErrorMsg("");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoFile(e.target.files[0]);
    }
  };

  // Submit Profile Changes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    setTimeout(() => {
      try {
        const avatarUrl = avatarType === "uploaded" && uploadedPhoto
          ? uploadedPhoto
          : getPreviewUrl();

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
        setSuccessMsg("Seu perfil e avatar foram salvos com sucesso!");
      } catch (err: any) {
        setErrorMsg("Erro ao salvar dados do perfil.");
      } finally {
        setSaving(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-1 sm:p-2 animate-fade-in" id="profile-view-container">
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

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 space-y-8 shadow-xs">
        
        {/* AVATAR CONFIGURATION WORKBENCH */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4 sm:p-6 space-y-6" id="avatar-workbench">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Estilo do seu Avatar</h3>
                <p className="text-[11px] text-slate-400">Personalize seu boneco vetorizado ou envie sua foto real</p>
              </div>
            </div>
            
            {/* Main Toggle */}
            <div className="flex bg-slate-200/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAvatarType("generated")}
                className={`px-3 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all duration-150 cursor-pointer ${avatarType === "generated" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                Criador IA
              </button>
              <button
                type="button"
                onClick={() => setAvatarType("uploaded")}
                className={`px-3 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all duration-150 cursor-pointer ${avatarType === "uploaded" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                Enviar Foto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Live Preview Display Box (Column 1-4) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visualização</span>
              
              <div className="relative w-36 h-36 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden p-2 shadow-inner">
                {avatarType === "generated" ? (
                  <img 
                    src={getPreviewUrl()} 
                    alt="Custom Avatar Preview" 
                    className="w-32 h-32 object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : uploadedPhoto ? (
                  <img 
                    src={uploadedPhoto} 
                    alt="Uploaded Avatar" 
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center p-3 space-y-1">
                    <Camera className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-[10px] font-bold text-slate-400">Sem foto</p>
                  </div>
                )}
              </div>

              {avatarType === "generated" ? (
                <button
                  type="button"
                  onClick={handleRandomizeOptions}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition outline-none cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin duration-1000" />
                  <span>Aleatório</span>
                </button>
              ) : uploadedPhoto ? (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedPhoto(null);
                    setAvatarType("generated");
                  }}
                  className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-3 py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar Foto</span>
                </button>
              ) : null}
            </div>

            {/* Customizer Panel Controls (Column 5-12) */}
            <div className="md:col-span-8 space-y-5">
              {avatarType === "generated" ? (
                <div className="space-y-5" id="generated-controls-pane">
                  {/* Style Engine Selector */}
                  <div className="flex gap-4 items-center">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Estilo Artístico:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStyleChange("adventurer")}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${avatarStyle === "adventurer" ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                      >
                        🎨 Ilustrado
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStyleChange("avataaars")}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${avatarStyle === "avataaars" ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                      >
                        💼 Corporativo
                      </button>
                    </div>
                  </div>

                  {/* CUSTOM CHIP GRID CONTROLS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Skin Color Palette selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Tom de Pele</label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200/60">
                        {(avatarStyle === "adventurer" ? SKIN_TONES_ADVENTURER : SKIN_TONES_AVATAAARS).map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setSkinColor(item.value)}
                            className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${skinColor === item.value ? "border-indigo-600 scale-110 shadow-sm" : "border-slate-200 hover:scale-105"}`}
                            style={{ backgroundColor: item.hex }}
                            title={item.name}
                          >
                            {skinColor === item.value && (
                              <span className="w-1.5 h-1.5 bg-indigo-900 rounded-full"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hair Style */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Corte de Cabelo</label>
                      <select
                        value={hairStyle}
                        onChange={(e) => setHairStyle(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                      >
                        {(avatarStyle === "adventurer" ? HAIR_STYLES_ADVENTURER : HAIR_STYLES_AVATAAARS).map((hair) => (
                          <option key={hair.value} value={hair.value}>{hair.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Hair Color Palette */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Cor do Cabelo</label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200/60">
                        {(avatarStyle === "adventurer" ? HAIR_COLORS_ADVENTURER : HAIR_COLORS_AVATAAARS).map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setHairColor(item.value)}
                            className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${hairColor === item.value ? "border-indigo-600 scale-110 shadow-sm" : "border-slate-200 hover:scale-105"}`}
                            style={{ backgroundColor: item.hex }}
                            title={item.name}
                          >
                            {hairColor === item.value && (
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accessories (Glasses, etc.) */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Óculos & Acessórios</label>
                      <select
                        value={accessories}
                        onChange={(e) => setAccessories(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                      >
                        {(avatarStyle === "adventurer" ? ACCESSORIES_ADVENTURER : ACCESSORIES_AVATAAARS).map((acc) => (
                          <option key={acc.value} value={acc.value}>{acc.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Engine Specifics - Beard for Avataaars */}
                    {avatarStyle === "avataaars" && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Estilo de Barba</label>
                          <select
                            value={beardStyle}
                            onChange={(e) => setBeardStyle(e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                          >
                            {BEARD_STYLES_AVATAAARS.map((beard) => (
                              <option key={beard.value} value={beard.value}>{beard.name}</option>
                            ))}
                          </select>
                        </div>

                        {beardStyle !== "blank" && (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Cor da Barba</label>
                            <select
                              value={beardColor}
                              onChange={(e) => setBeardColor(e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                            >
                              {HAIR_COLORS_AVATAAARS.map((color) => (
                                <option key={color.value} value={color.value}>{color.name}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Modelo de Roupa</label>
                          <select
                            value={clothingStyle}
                            onChange={(e) => setClothingStyle(e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                          >
                            {CLOTHING_STYLES_AVATAAARS.map((cloth) => (
                              <option key={cloth.value} value={cloth.value}>{cloth.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Clothing Color Palette */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Cor da Roupa</label>
                          <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200/60">
                            {CLOTHING_COLORS_AVATAAARS.map((item) => (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => setClothingColor(item.value)}
                                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${clothingColor === item.value ? "border-indigo-600 scale-110 shadow-sm" : "border-slate-200 hover:scale-105"}`}
                                style={{ backgroundColor: item.hex }}
                                title={item.name}
                              >
                                {clothingColor === item.value && (
                                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* FILE PHOTO UPLOAD FORM */
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition duration-150 cursor-pointer flex flex-col items-center justify-center space-y-3 ${dragActive ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-300 hover:border-slate-400 bg-white'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  id="drag-drop-avatar-zone"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full shadow-inner">
                    <Upload className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Arraste sua foto real aqui ou toque para selecionar</p>
                    <p className="text-[10px] text-slate-400">Suporta arquivos PNG, JPG e JPEG. Comprimido localmente.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROFILE FORM FIELD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Nome Completo</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lucas Silva"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">E-mail de Contato</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: seu-email@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Telefone / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (11) 98888-7777"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Cidade / Estado</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo - SP"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Curso de Formação Técnica</label>
            <div className="relative">
              <BookOpen className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <select
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none"
              >
                <option value="">Selecione seu curso...</option>
                <option value="Técnico em Enfermagem">Técnico em Enfermagem</option>
                <option value="Técnico em Radiologia">Técnico em Radiologia</option>
                <option value="Técnico em Segurança do Trabalho">Técnico em Segurança do Trabalho</option>
                <option value="Especialização em Instrumentação Cirúrgica">Especialização em Instrumentação Cirúrgica</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Competências Principais</label>
            <div className="relative">
              <Clipboard className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Ex: Curativos, Sinais Vitais, Biossegurança"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Objetivo Profissional</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Descreva brevemente o que você busca na sua vaga de primeiro emprego ou estágio técnico..."
              rows={3}
              className="w-full p-4.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Idiomas</label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="Ex: Português (Nativo), Inglês (Básico)"
              className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {/* SAVE PROFILE SUBMIT ROW */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
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
