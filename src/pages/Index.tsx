import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Page = "register" | "home" | "news" | "rules" | "characters" | "factions" | "profile";

interface Character {
  id: string;
  name: string;
  faction: string;
  species: string;
  backstory: string;
  rank: string;
  xp: number;
  createdAt: string;
  photo: string;
  username: string;
}

interface User {
  username: string;
  password: string;
  character: Character;
}

interface RegData {
  username: string;
  password: string;
  confirmPassword: string;
  charName: string;
  faction: string;
  species: string;
  backstory: string;
}

const FACTION_PHOTOS: Record<string, string> = {
  republic: "https://cdn.poehali.dev/projects/b0ae4b5a-b625-4c90-a1bb-96eacac78c2f/files/3236bde9-a70e-4d31-9e0c-468bb1548134.jpg",
  jedi: "https://cdn.poehali.dev/projects/b0ae4b5a-b625-4c90-a1bb-96eacac78c2f/files/31fc1373-c82e-4158-ada6-8e309186bfaf.jpg",
  mandalorians: "https://cdn.poehali.dev/projects/b0ae4b5a-b625-4c90-a1bb-96eacac78c2f/files/224783e1-d3c7-4cd1-a9d8-37bf80040f31.jpg",
};

const FACTIONS = [
  {
    id: "republic",
    name: "Галактическая Республика",
    color: "#00d4ff",
    emblem: "🔵",
    description: "Защитники мира и демократии, опора цивилизации",
    ranks: [
      { id: 1, name: "Рядовой CT", code: "CT-0000", xp: 0 },
      { id: 2, name: "Ефрейтор", code: "CT-1000", xp: 500 },
      { id: 3, name: "Сержант", code: "CC-1100", xp: 1500 },
      { id: 4, name: "Старший сержант", code: "CC-2200", xp: 3000 },
      { id: 5, name: "Лейтенант", code: "CC-3300", xp: 6000 },
      { id: 6, name: "Капитан", code: "CC-4400", xp: 10000 },
      { id: 7, name: "Майор", code: "CC-5500", xp: 16000 },
      { id: 8, name: "Командер", code: "CC-6600", xp: 25000 },
      { id: 9, name: "Маршал-командер", code: "CC-7700", xp: 40000 },
      { id: 10, name: "Генерал-Джедай", code: "JEDI-01", xp: 60000 },
    ],
  },
  {
    id: "jedi",
    name: "Орден Джедаев",
    color: "#b8a0ff",
    emblem: "🟣",
    description: "Хранители мира, слуги Силы и защитники справедливости",
    ranks: [
      { id: 1, name: "Инициат", code: "JI-0001", xp: 0 },
      { id: 2, name: "Падаван", code: "JP-0100", xp: 500 },
      { id: 3, name: "Падаван-воин", code: "JP-0200", xp: 1500 },
      { id: 4, name: "Рыцарь Джедай", code: "JK-1000", xp: 3000 },
      { id: 5, name: "Рыцарь-страж", code: "JK-2000", xp: 6000 },
      { id: 6, name: "Рыцарь-консул", code: "JK-3000", xp: 10000 },
      { id: 7, name: "Мастер Джедай", code: "JM-1000", xp: 16000 },
      { id: 8, name: "Мастер Совета", code: "JM-2000", xp: 25000 },
      { id: 9, name: "Великий Мастер", code: "JM-3000", xp: 40000 },
      { id: 10, name: "Гранд-Мастер", code: "JGM-001", xp: 60000 },
    ],
  },
  {
    id: "mandalorians",
    name: "Мандалорцы",
    color: "#ff6b35",
    emblem: "🟠",
    description: "Воины чести, следующие пути Мандалора",
    ranks: [
      { id: 1, name: "Алит", code: "ALIT-0", xp: 0 },
      { id: 2, name: "Воин Рам", code: "RAM-1", xp: 500 },
      { id: 3, name: "Рам Верда", code: "VERD-1", xp: 1500 },
      { id: 4, name: "Сол'йор", code: "SOL-1", xp: 3000 },
      { id: 5, name: "Краммок", code: "KRAM-1", xp: 6000 },
      { id: 6, name: "Аруэтий", code: "ARU-1", xp: 10000 },
      { id: 7, name: "Джетий'кад", code: "JK-001", xp: 16000 },
      { id: 8, name: "Алор", code: "ALOR-1", xp: 25000 },
      { id: 9, name: "Алор'ад", code: "ARAD-1", xp: 40000 },
      { id: 10, name: "Мандалор", code: "MAND-0", xp: 60000 },
    ],
  },
];

const NEWS = [
  {
    id: 1, title: "Битва при Джеонозисе — официальный старт сервера",
    date: "21.02.26 | 00:00 GST", category: "СОБЫТИЕ", color: "#00d4ff",
    text: "Сервер Nova | Galactic Multiverse официально запущен. Первая фаза Войн клонов началась. Все игроки могут зарегистрировать своих персонажей.",
  },
  {
    id: 2, title: "Добавлена система рангов и прогрессии",
    date: "20.02.26 | 18:30 GST", category: "ОБНОВЛЕНИЕ", color: "#00ff88",
    text: "Введена полная иерархия рангов для трёх фракций: Республика, КНС и Мандалорцы. Каждый ранг открывается при накоплении опыта.",
  },
  {
    id: 3, title: "Новые локации: Камино и Корусант",
    date: "19.02.26 | 12:00 GST", category: "КОНТЕНТ", color: "#00d4ff",
    text: "Открыты тренировочные базы на Камино и командный центр Джедаев на Корусанте. Доступны для всех зарегистрированных персонажей.",
  },
];

const RULES = [
  {
    section: "I. Основные правила", color: "#00d4ff",
    items: ["Уважение ко всем участникам RP-сообщества обязательно", "Meta-gaming и god-moding строго запрещены", "Все действия персонажа должны соответствовать эпохе клонов", "OOC общение только в специальных каналах"],
  },
  {
    section: "II. Боевая система", color: "#00ff88",
    items: ["Бои проводятся через систему кубиков (/roll)", "Смерть персонажа возможна только с согласия игрока", "Захват персонажа требует 3 хода без сопротивления", "Запрещено использование сил/оружия не по классу"],
  },
  {
    section: "III. Ролевое поведение", color: "#00d4ff",
    items: ["Персонаж должен оставаться в роли во время RP сцен", "История персонажа должна соответствовать лору", "Межфракционное взаимодействие возможно в нейтральных зонах", "Все конфликты разрешаются через администрацию"],
  },
];

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "news", label: "Новости", icon: "Radio" },
  { id: "rules", label: "Правила", icon: "ScrollText" },
  { id: "characters", label: "Картотека", icon: "Users" },
  { id: "factions", label: "Фракции", icon: "Shield" },
  { id: "profile", label: "Профиль", icon: "CircleUser" },
];

const STARS = Array.from({ length: 120 }).map((_, i) => ({
  key: i,
  width: Math.random() > 0.9 ? "2px" : "1px",
  top: `${Math.random() * 200}%`,
  left: `${Math.random() * 100}%`,
  background: Math.random() > 0.7 ? "rgba(0,212,255,0.6)" : "rgba(255,255,255,0.4)",
  opacity: Math.random() * 0.8 + 0.2,
}));

function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem("nova_users") || "[]"); } catch { return []; }
}
function saveUsers(users: User[]) {
  localStorage.setItem("nova_users", JSON.stringify(users));
}
function getCurrentUser(): User | null {
  try { return JSON.parse(localStorage.getItem("nova_current_user") || "null"); } catch { return null; }
}
function setCurrentUser(user: User | null) {
  localStorage.setItem("nova_current_user", JSON.stringify(user));
}
function getRankForFaction(factionId: string): string {
  const f = FACTIONS.find((x) => x.id === factionId);
  return f ? f.ranks[0].name : "Новобранец";
}

function StarField() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="animate-star-scroll">
        {STARS.map((s) => (
          <div key={s.key} className="absolute rounded-full"
            style={{ width: s.width, height: s.width, top: s.top, left: s.left, background: s.background, opacity: s.opacity }} />
        ))}
      </div>
    </div>
  );
}

function ScanLine() {
  return (
    <div className="fixed top-0 left-0 right-0 h-px pointer-events-none z-50 opacity-30"
      style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)", animation: "scan-line 8s linear infinite" }} />
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border border-[#00d4ff] rotate-45 opacity-60" />
        <div className="absolute inset-1 border border-[#00ff88] rotate-12 opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#00d4ff] text-xs font-orbitron font-bold">N</span>
        </div>
      </div>
      <div>
        <div className="font-orbitron text-sm font-bold text-[#00d4ff] glow-text-blue tracking-wider">NOVA</div>
        <div className="font-mono-tech text-[9px] text-[#00ff88] opacity-70 tracking-widest">GALACTIC MULTIVERSE</div>
      </div>
    </div>
  );
}

function NavBar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 scanline" style={{
      background: "rgba(2, 8, 15, 0.92)", borderBottom: "1px solid rgba(0,212,255,0.2)",
      boxShadow: "0 0 20px rgba(0,212,255,0.1)", backdropFilter: "blur(12px)",
    }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Logo />
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-rajdhani font-medium transition-all duration-200"
              style={{
                color: page === item.id ? "#00d4ff" : "rgba(0,212,255,0.45)",
                background: page === item.id ? "rgba(0,212,255,0.08)" : "transparent",
                border: `1px solid ${page === item.id ? "rgba(0,212,255,0.3)" : "transparent"}`,
                boxShadow: page === item.id ? "0 0 10px rgba(0,212,255,0.15)" : "none",
              }}>
              <Icon name={item.icon} size={13} />
              <span className="hidden md:inline tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="font-mono-tech text-[9px] text-[#00ff88] opacity-50">22 BBY · ФАЗА I</div>
      </div>
    </nav>
  );
}

function PageWrapper({ children, page, setPage }: { children: React.ReactNode; page: Page; setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <ScanLine />
      <NavBar page={page} setPage={setPage} />
      <div className="pt-14 relative z-10">{children}</div>
    </div>
  );
}

function DossierCard({ char, onClick }: { char: Character; onClick: () => void }) {
  const faction = FACTIONS.find((f) => f.id === char.faction);
  const color = faction?.color || "#00d4ff";
  const photo = char.photo || FACTION_PHOTOS[char.faction] || FACTION_PHOTOS.republic;

  return (
    <button onClick={onClick} className="holo-card text-left transition-all duration-300 hover:scale-[1.02] w-full overflow-hidden"
      style={{ borderColor: `${color}40`, boxShadow: `0 0 15px ${color}10` }}>
      <div className="relative h-44 overflow-hidden">
        <img src={photo} alt={char.name} className="w-full h-full object-cover" style={{ filter: "brightness(0.75) saturate(0.8)" }} />
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom, transparent 40%, rgba(2,8,15,0.95) 100%)`,
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${color}08 3px, ${color}08 4px)`,
        }} />
        <div className="absolute top-2 left-2">
          <span className="font-mono-tech text-[9px] px-1.5 py-0.5 rounded" style={{
            color, border: `1px solid ${color}50`, background: "rgba(2,8,15,0.8)",
          }}>
            {faction?.emblem} {faction?.id === "republic" ? "РЕСПУБЛИКА" : faction?.id === "separatists" ? "КНС" : "МАНДА."}
          </span>
        </div>
        <div className="absolute top-2 right-2 font-mono-tech text-[8px]" style={{ color, opacity: 0.6 }}>
          ID-{char.id.slice(-4).toUpperCase()}
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="font-orbitron text-sm font-bold leading-tight" style={{ color, textShadow: `0 0 10px ${color}` }}>
            {char.name}
          </div>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="font-mono-tech text-[9px] opacity-50" style={{ color }}>РАНГ</span>
          <span className="font-rajdhani text-xs font-semibold" style={{ color }}>{char.rank}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono-tech text-[9px] opacity-50" style={{ color }}>ВИД</span>
          <span className="font-rajdhani text-xs" style={{ color, opacity: 0.8 }}>{char.species || "Неизвестно"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono-tech text-[9px] opacity-50" style={{ color }}>ОПЫТ</span>
          <span className="font-orbitron text-xs font-bold" style={{ color }}>{char.xp.toLocaleString()} XP</span>
        </div>
        <div className="h-0.5 rounded-full mt-2" style={{ background: `${color}20` }}>
          <div className="h-full rounded-full" style={{ width: "5%", background: color, boxShadow: `0 0 4px ${color}` }} />
        </div>
      </div>
    </button>
  );
}

function DossierModal({ char, onClose, isOwn }: { char: Character; onClose: () => void; isOwn: boolean }) {
  const faction = FACTIONS.find((f) => f.id === char.faction);
  const color = faction?.color || "#00d4ff";
  const photo = char.photo || FACTION_PHOTOS[char.faction] || FACTION_PHOTOS.republic;
  const createdDate = new Date(char.createdAt).toLocaleDateString("ru-RU");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}
      style={{ background: "rgba(0,5,15,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="holo-card overflow-hidden scanline" style={{ borderColor: `${color}60`, boxShadow: `0 0 40px ${color}20` }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3" style={{
            background: `linear-gradient(90deg, ${color}15, transparent)`,
            borderBottom: `1px solid ${color}30`,
          }}>
            <div className="font-mono-tech text-[10px] tracking-widest" style={{ color }}>
              HOLONET DATABANK // ДОСЬЕ ПЕРСОНАЖА
            </div>
            <button onClick={onClose} className="font-mono-tech text-[10px] opacity-50 hover:opacity-100 transition-opacity" style={{ color }}>
              [ЗАКРЫТЬ]
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-0">
            {/* Photo column */}
            <div className="relative md:w-56 flex-shrink-0">
              <img src={photo} alt={char.name} className="w-full h-64 md:h-full object-cover"
                style={{ filter: "brightness(0.7) saturate(0.75)" }} />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, transparent 60%, rgba(2,8,15,0.8) 100%)",
              }} />
              <div className="absolute inset-0" style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${color}06 3px, ${color}06 4px)`,
              }} />
              <div className="absolute bottom-3 left-3">
                <div className="font-mono-tech text-[9px] mb-0.5 opacity-50" style={{ color }}>СТАТУС</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="font-mono-tech text-[10px] text-[#00ff88]">АКТИВЕН</span>
                </div>
              </div>
              {isOwn && (
                <div className="absolute top-3 left-3">
                  <span className="font-mono-tech text-[8px] px-1.5 py-0.5 rounded" style={{
                    color: "#00ff88", border: "1px solid rgba(0,255,136,0.4)", background: "rgba(0,10,5,0.8)",
                  }}>МОЙ ПЕРСОНАЖ</span>
                </div>
              )}
            </div>

            {/* Info column */}
            <div className="flex-1 p-5 space-y-4">
              <div>
                <div className="font-mono-tech text-[9px] opacity-40 mb-1" style={{ color }}>ПОЗЫВНОЙ / ИМЯ</div>
                <h2 className="font-orbitron text-xl font-bold" style={{ color, textShadow: `0 0 12px ${color}80` }}>
                  {char.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ФРАКЦИЯ", value: faction?.name || "—" },
                  { label: "ВИД", value: char.species || "Неизвестно" },
                  { label: "РАНГ", value: char.rank },
                  { label: "БОЕВОЙ ОПЫТ", value: `${char.xp.toLocaleString()} XP` },
                  { label: "ИГРОК", value: char.username },
                  { label: "ДАТА ЗАЧИСЛЕНИЯ", value: createdDate },
                ].map((row) => (
                  <div key={row.label} className="p-2 rounded" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
                    <div className="font-mono-tech text-[8px] opacity-40 mb-0.5" style={{ color }}>{row.label}</div>
                    <div className="font-rajdhani text-sm font-medium" style={{ color }}>{row.value}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="font-mono-tech text-[9px] opacity-40 mb-2" style={{ color }}>ЛИЧНОЕ ДЕЛО / ПРЕДЫСТОРИЯ</div>
                <div className="p-3 rounded font-rajdhani text-sm leading-relaxed" style={{
                  color, opacity: 0.75,
                  background: `${color}06`, border: `1px solid ${color}15`,
                  minHeight: "80px",
                }}>
                  {char.backstory || "Данные засекречены. Доступ ограничен."}
                </div>
              </div>

              <div className="pt-1">
                <div className="flex justify-between font-mono-tech text-[8px] opacity-40 mb-1" style={{ color }}>
                  <span>ПРОГРЕСС РАНГА</span><span>{char.xp} / 500 XP</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: `${color}15` }}>
                  <div className="h-full rounded-full" style={{
                    width: `${Math.min((char.xp / 500) * 100, 100)}%`,
                    background: color, boxShadow: `0 0 6px ${color}`,
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-2 flex items-center gap-3" style={{ borderTop: `1px solid ${color}20`, background: `${color}05` }}>
            <div className="font-mono-tech text-[8px] opacity-30 tracking-widest" style={{ color }}>
              NOVA GALACTIC MULTIVERSE · КЛАССИФИКАЦИЯ: ОТКРЫТЫЙ ДОСТУП · © 22 BBY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onDone }: { onDone: (user: User) => void }) {
  const [regStep, setRegStep] = useState(1);
  const [error, setError] = useState("");
  const [regData, setRegData] = useState<RegData>({
    username: "", password: "", confirmPassword: "", charName: "", faction: "", species: "", backstory: "",
  });

  const handleRegister = () => {
    const users = getUsers();
    if (users.find((u) => u.username.toLowerCase() === regData.username.toLowerCase())) {
      setError("Позывной уже занят. Выберите другой.");
      return;
    }
    const char: Character = {
      id: Date.now().toString(),
      name: regData.charName || `Боец-${Date.now().toString().slice(-4)}`,
      faction: regData.faction || "republic",
      species: regData.species,
      backstory: regData.backstory,
      rank: getRankForFaction(regData.faction || "republic"),
      xp: 0,
      createdAt: new Date().toISOString(),
      photo: FACTION_PHOTOS[regData.faction] || FACTION_PHOTOS.republic,
      username: regData.username,
    };
    const newUser: User = { username: regData.username, password: regData.password, character: char };
    const updated = [...users, newUser];
    saveUsers(updated);
    setCurrentUser(newUser);
    onDone(newUser);
  };

  const handleLogin = () => {
    const users = getUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === regData.username.toLowerCase() && u.password === regData.password
    );
    if (found) { setCurrentUser(found); onDone(found); }
    else setError("Неверный позывной или код доступа.");
  };

  const [mode, setMode] = useState<"register" | "login">("register");

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      <StarField />
      <ScanLine />
      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-2 border-[#00d4ff] rotate-45 opacity-50" />
              <div className="absolute inset-0 border border-[#00ff88] rotate-12 opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">⭐</div>
            </div>
          </div>
          <h1 className="font-orbitron text-2xl font-bold text-[#00d4ff] glow-text-blue tracking-widest mb-1">NOVA</h1>
          <div className="font-mono-tech text-xs text-[#00ff88] tracking-[0.4em] mb-2">GALACTIC MULTIVERSE</div>
          <div className="font-mono-tech text-[10px] text-[#00d4ff] opacity-50 tracking-widest">STAR WARS ROLEPLAY · ЭПОХА КЛОНОВ · ФАЗА I</div>
        </div>

        {/* Mode switch */}
        <div className="flex mb-4 rounded overflow-hidden" style={{ border: "1px solid rgba(0,212,255,0.2)" }}>
          {(["register", "login"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); setRegStep(1); }}
              className="flex-1 py-2 font-orbitron text-[10px] transition-all duration-200"
              style={{
                background: mode === m ? "rgba(0,212,255,0.12)" : "transparent",
                color: mode === m ? "#00d4ff" : "rgba(0,212,255,0.35)",
                boxShadow: mode === m ? "inset 0 0 10px rgba(0,212,255,0.1)" : "none",
              }}>
              {m === "register" ? "РЕГИСТРАЦИЯ" : "ВОЙТИ"}
            </button>
          ))}
        </div>

        <div className="holo-card scanline relative p-6 corner-tl corner-br">
          <div className="absolute top-2 right-2 font-mono-tech text-[10px] text-[#00d4ff] opacity-40">SYS://HOLONET/AUTH</div>

          {error && (
            <div className="mb-4 p-2 rounded font-mono-tech text-[10px] text-center"
              style={{ color: "#ff4444", border: "1px solid rgba(255,50,50,0.3)", background: "rgba(255,50,50,0.05)" }}>
              ► {error}
            </div>
          )}

          {mode === "login" && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-4">ИДЕНТИФИКАЦИЯ АГЕНТА</div>
              <div>
                <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ПОЗЫВНОЙ</label>
                <input className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="ваш_позывной"
                  value={regData.username} onChange={(e) => setRegData((d) => ({ ...d, username: e.target.value }))} />
              </div>
              <div>
                <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">КОД ДОСТУПА</label>
                <input type="password" className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="••••••••"
                  value={regData.password} onChange={(e) => setRegData((d) => ({ ...d, password: e.target.value }))} />
              </div>
              <button className="w-full py-3 rounded btn-neon-blue font-orbitron text-xs" onClick={handleLogin}>
                ВОЙТИ В СИСТЕМУ
              </button>
            </div>
          )}

          {mode === "register" && (
            <>
              <div className="flex mb-6 gap-1">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 h-0.5 rounded-full" style={{
                    background: regStep >= s ? "#00d4ff" : "rgba(0,212,255,0.15)",
                    boxShadow: regStep >= s ? "0 0 8px rgba(0,212,255,0.6)" : "none",
                  }} />
                ))}
              </div>

              {regStep === 1 && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-4">МОДУЛЬ 01 // ИДЕНТИФИКАЦИЯ</div>
                  <div>
                    <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ПОЗЫВНОЙ</label>
                    <input className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="ваш_позывной"
                      value={regData.username} onChange={(e) => setRegData((d) => ({ ...d, username: e.target.value }))} />
                  </div>
                  <div>
                    <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">КОД ДОСТУПА</label>
                    <input type="password" className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="••••••••"
                      value={regData.password} onChange={(e) => setRegData((d) => ({ ...d, password: e.target.value }))} />
                  </div>
                  <div>
                    <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ПОДТВЕРЖДЕНИЕ</label>
                    <input type="password" className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="••••••••"
                      value={regData.confirmPassword} onChange={(e) => setRegData((d) => ({ ...d, confirmPassword: e.target.value }))} />
                  </div>
                  <button className="w-full py-3 rounded btn-neon-blue font-orbitron text-xs mt-2"
                    onClick={() => {
                      if (!regData.username.trim()) { setError("Введите позывной."); return; }
                      if (regData.password.length < 4) { setError("Код доступа — минимум 4 символа."); return; }
                      if (regData.password !== regData.confirmPassword) { setError("Коды доступа не совпадают."); return; }
                      setError(""); setRegStep(2);
                    }}>
                    Следующий модуль →
                  </button>
                </div>
              )}

              {regStep === 2 && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-4">МОДУЛЬ 02 // СОЗДАНИЕ ПЕРСОНАЖА</div>
                  <div>
                    <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ИМЯ ПЕРСОНАЖА</label>
                    <input className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="CT-7567 'Рекс'"
                      value={regData.charName} onChange={(e) => setRegData((d) => ({ ...d, charName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ВИД</label>
                    <select className="w-full px-3 py-2.5 rounded text-sm holo-input"
                      value={regData.species} onChange={(e) => setRegData((d) => ({ ...d, species: e.target.value }))}>
                      <option value="">— Выберите вид —</option>
                      <option>Клон-человек</option><option>Человек</option><option>Тви'лек</option>
                      <option>Монгрел</option><option>Забрак</option><option>Кел Дор</option><option>Дроид</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ФРАКЦИЯ</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FACTIONS.map((f) => (
                        <button key={f.id} onClick={() => setRegData((d) => ({ ...d, faction: f.id }))}
                          className="p-2 rounded text-center transition-all duration-200 text-xs"
                          style={{
                            border: `1px solid ${regData.faction === f.id ? f.color : "rgba(0,212,255,0.2)"}`,
                            background: regData.faction === f.id ? `${f.color}20` : "transparent",
                            color: regData.faction === f.id ? f.color : "rgba(0,212,255,0.5)",
                            boxShadow: regData.faction === f.id ? `0 0 10px ${f.color}40` : "none",
                          }}>
                          <div>{f.emblem}</div>
                          <div className="font-mono-tech text-[8px] mt-1 leading-tight">
                            {f.id === "republic" ? "РЕСПУБЛИКА" : f.id === "jedi" ? "ДЖЕДАИ" : "МАНДА."}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded btn-neon-blue font-orbitron text-xs opacity-60" onClick={() => setRegStep(1)}>← Назад</button>
                    <button className="flex-1 py-3 rounded btn-neon-blue font-orbitron text-xs" onClick={() => { setError(""); setRegStep(3); }}>Далее →</button>
                  </div>
                </div>
              )}

              {regStep === 3 && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-4">МОДУЛЬ 03 // ПРЕДЫСТОРИЯ</div>
                  <div>
                    <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ИСТОРИЯ ПЕРСОНАЖА</label>
                    <textarea className="w-full px-3 py-2.5 rounded text-sm holo-input resize-none" rows={4}
                      placeholder="Опишите историю вашего персонажа..."
                      value={regData.backstory} onChange={(e) => setRegData((d) => ({ ...d, backstory: e.target.value }))} />
                  </div>
                  <div className="p-3 rounded font-mono-tech text-[10px] text-[#00d4ff] opacity-60 space-y-1"
                    style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}>
                    <div>► ПОЗЫВНОЙ: {regData.username || "—"}</div>
                    <div>► ПЕРСОНАЖ: {regData.charName || "—"}</div>
                    <div>► ФРАКЦИЯ: {regData.faction?.toUpperCase() || "—"}</div>
                    <div>► ВИД: {regData.species || "—"}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded btn-neon-blue font-orbitron text-xs opacity-60" onClick={() => setRegStep(2)}>← Назад</button>
                    <button className="flex-1 py-3 rounded btn-neon-green font-orbitron text-xs" onClick={handleRegister}>
                      ЗАРЕГИСТРИРОВАТЬСЯ
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="text-center mt-4 font-mono-tech text-[9px] text-[#00d4ff] opacity-30 tracking-widest">
          NOVA GALACTIC MULTIVERSE · SWRP · © 22 BBY
        </div>
      </div>
    </div>
  );
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const users = getUsers();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-[0.5em] mb-3 opacity-70">► HOLONET BROADCASTING · LIVE</div>
        <h1 className="font-orbitron text-4xl md:text-6xl font-black text-[#00d4ff] glow-text-blue tracking-widest mb-2">NOVA</h1>
        <div className="font-orbitron text-lg md:text-2xl text-white opacity-60 tracking-[0.3em] mb-4">GALACTIC MULTIVERSE</div>
        <div className="w-48 h-px mx-auto mb-4" style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)" }} />
        <p className="font-rajdhani text-[#00d4ff] opacity-70 text-lg max-w-2xl mx-auto">
          Звёздные войны. Ролевой проект. Эпоха клонов, первая фаза.<br />
          Сражайся за Республику, КНС или путь Мандалора.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "АГЕНТОВ В БАЗЕ", value: users.length.toString(), icon: "Users", color: "#00d4ff" },
          { label: "ФРАКЦИЙ", value: "3", icon: "Shield", color: "#00ff88" },
          { label: "АКТИВНЫХ RP", value: "38", icon: "Swords", color: "#00d4ff" },
          { label: "ДНЕЙ В ЭФИРЕ", value: "142", icon: "Star", color: "#00ff88" },
        ].map((stat) => (
          <div key={stat.label} className="holo-card scanline p-4 text-center animate-holo-pulse">
            <div style={{ color: stat.color }}>
              <Icon name={stat.icon} size={20} className="mx-auto mb-2" />
            </div>
            <div className="font-orbitron text-2xl font-bold mb-1" style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}80` }}>
              {stat.value}
            </div>
            <div className="font-mono-tech text-[9px] opacity-50 tracking-wider" style={{ color: stat.color }}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="holo-card p-5 relative">
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-3">ТЕКУЩАЯ ОБСТАНОВКА</div>
          <h3 className="font-orbitron text-sm text-[#00d4ff] mb-2">БИТВА ПРИ ДЖЕОНОЗИСЕ</h3>
          <p className="font-rajdhani text-sm text-[#00d4ff] opacity-60 leading-relaxed">
            Первая крупная битва Войны клонов. Республика развёртывает 200,000 клонов против дроидных армий КНС.
          </p>
        </div>
        <div className="holo-card p-5 relative">
          <div className="font-mono-tech text-[10px] text-[#00d4ff] tracking-widest mb-3">АКТИВНЫЕ ФРАКЦИИ</div>
          <div className="space-y-2">
            {FACTIONS.map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: f.color, boxShadow: `0 0 6px ${f.color}` }} />
                <span className="font-rajdhani text-sm" style={{ color: f.color }}>{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono-tech text-[10px] text-[#00d4ff] tracking-widest">ПОСЛЕДНИЕ ТРАНСЛЯЦИИ</div>
          <button className="font-mono-tech text-[9px] text-[#00ff88] opacity-60 hover:opacity-100 transition-opacity" onClick={() => setPage("news")}>
            ВСЕ НОВОСТИ →
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {NEWS.slice(0, 2).map((n) => (
            <div key={n.id} className="holo-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono-tech text-[9px] px-2 py-0.5 rounded" style={{
                  color: n.color, border: `1px solid ${n.color}40`, background: `${n.color}10`,
                }}>{n.category}</span>
                <span className="font-mono-tech text-[9px] text-[#00d4ff] opacity-40">{n.date}</span>
              </div>
              <h4 className="font-rajdhani font-semibold text-[#00d4ff] text-sm mb-1">{n.title}</h4>
              <p className="font-rajdhani text-xs text-[#00d4ff] opacity-50 line-clamp-2">{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-2">// HOLONET BROADCAST FEED</div>
        <h1 className="font-orbitron text-2xl font-bold text-[#00d4ff] glow-text-blue">НОВОСТИ И ОБНОВЛЕНИЯ</h1>
      </div>
      <div className="space-y-4">
        {NEWS.map((n, i) => (
          <div key={n.id} className="holo-card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 rounded-full" style={{ background: n.color, boxShadow: `0 0 8px ${n.color}` }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono-tech text-[9px] px-2 py-0.5 rounded" style={{
                      color: n.color, border: `1px solid ${n.color}40`, background: `${n.color}10`,
                    }}>{n.category}</span>
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-[#00d4ff]">{n.title}</h3>
                </div>
              </div>
              <span className="font-mono-tech text-[9px] text-[#00d4ff] opacity-40 whitespace-nowrap ml-4">{n.date}</span>
            </div>
            <p className="font-rajdhani text-sm text-[#00d4ff] opacity-65 pl-3 leading-relaxed">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-2">// GALACTIC CODEX v2.2</div>
        <h1 className="font-orbitron text-2xl font-bold text-[#00d4ff] glow-text-blue">ПРАВИЛА СЕРВЕРА</h1>
      </div>
      <div className="space-y-5">
        {RULES.map((section, i) => (
          <div key={i} className="holo-card p-5" style={{ borderColor: `${section.color}40`, boxShadow: `0 0 15px ${section.color}10` }}>
            <h3 className="font-orbitron text-sm font-bold mb-4" style={{ color: section.color, textShadow: `0 0 8px ${section.color}80` }}>
              {section.section}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-start gap-3 font-rajdhani text-sm text-[#00d4ff] opacity-75">
                  <span className="font-mono-tech text-[10px] mt-0.5" style={{ color: section.color }}>►</span>{item}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="p-5 text-center rounded" style={{
          background: "linear-gradient(135deg, rgba(0,255,136,0.05), rgba(0,10,20,0.8), rgba(0,212,255,0.03))",
          border: "1px solid rgba(0,255,136,0.3)",
        }}>
          <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-2">КОДЕКС ДЖЕДАЕВ</div>
          <div className="font-rajdhani text-[#00ff88] opacity-70 italic leading-relaxed">
            Нет эмоций — есть покой. Нет невежества — есть знание.<br />
            Нет страсти — есть безмятежность. Нет хаоса — есть гармония.<br />
            Нет смерти — есть Сила.
          </div>
        </div>
      </div>
    </div>
  );
}

function CharactersPage({ currentUser }: { currentUser: User | null }) {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const users = getUsers();
  const allChars = users.map((u) => u.character);

  const filtered = allChars.filter((c) => {
    const matchFaction = filter === "all" || c.faction === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase());
    return matchFaction && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {selectedChar && (
        <DossierModal
          char={selectedChar}
          onClose={() => setSelectedChar(null)}
          isOwn={currentUser?.character.id === selectedChar.id}
        />
      )}

      <div className="mb-6">
        <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-2">// HOLONET DATABANK · FIELD AGENTS</div>
        <h1 className="font-orbitron text-2xl font-bold text-[#00d4ff] glow-text-blue">КАРТОТЕКА ПЕРСОНАЖЕЙ</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input className="holo-input px-3 py-1.5 rounded text-sm flex-1 min-w-[180px]" placeholder="Поиск по имени или позывному..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex gap-1">
          {[{ id: "all", label: "ВСЕ" }, ...FACTIONS.map((f) => ({ id: f.id, label: f.emblem }))].map((f) => {
            const faction = FACTIONS.find((x) => x.id === f.id);
            const color = faction?.color || "#00d4ff";
            return (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className="px-3 py-1.5 rounded font-mono-tech text-[10px] transition-all duration-200"
                style={{
                  border: `1px solid ${filter === f.id ? color : "rgba(0,212,255,0.2)"}`,
                  background: filter === f.id ? `${color}15` : "transparent",
                  color: filter === f.id ? color : "rgba(0,212,255,0.4)",
                }}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="holo-card p-16 text-center">
          <div className="font-mono-tech text-[10px] text-[#00d4ff] opacity-30 tracking-widest mb-2">БАЗА ДАННЫХ ПУСТА</div>
          <div className="font-rajdhani text-[#00d4ff] opacity-40 text-sm">
            Зарегистрируйтесь, чтобы стать первым агентом в картотеке
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((char) => (
            <DossierCard key={char.id} char={char} onClick={() => setSelectedChar(char)} />
          ))}
        </div>
      )}

      <div className="mt-4 font-mono-tech text-[9px] text-[#00d4ff] opacity-30">
        АГЕНТОВ В БАЗЕ: {allChars.length} · ОТОБРАЖЕНО: {filtered.length}
      </div>
    </div>
  );
}

function FactionsPage() {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-2">// GALACTIC REGISTRY · FACTIONS</div>
        <h1 className="font-orbitron text-2xl font-bold text-[#00d4ff] glow-text-blue">ФРАКЦИИ И ИЕРАРХИЯ</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {FACTIONS.map((faction) => (
          <button key={faction.id}
            onClick={() => setSelectedFaction(selectedFaction === faction.id ? null : faction.id)}
            className="holo-card p-5 text-left transition-all duration-300 hover:scale-[1.01] w-full"
            style={{
              borderColor: selectedFaction === faction.id ? faction.color : `${faction.color}30`,
              boxShadow: selectedFaction === faction.id ? `0 0 25px ${faction.color}30` : `0 0 10px ${faction.color}10`,
            }}>
            <div className="text-3xl mb-3">{faction.emblem}</div>
            <h3 className="font-orbitron text-xs font-bold mb-2" style={{ color: faction.color }}>{faction.name}</h3>
            <p className="font-rajdhani text-xs opacity-60" style={{ color: faction.color }}>{faction.description}</p>
            <div className="mt-3 font-mono-tech text-[9px] opacity-40" style={{ color: faction.color }}>
              {selectedFaction === faction.id ? "▼ СВЕРНУТЬ РАНГИ" : "► ПОКАЗАТЬ РАНГИ"}
            </div>
          </button>
        ))}
      </div>
      {selectedFaction && (() => {
        const faction = FACTIONS.find((f) => f.id === selectedFaction)!;
        return (
          <div className="holo-card p-6 animate-fade-in-up" style={{ borderColor: `${faction.color}40` }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{faction.emblem}</span>
              <div>
                <h2 className="font-orbitron text-sm font-bold" style={{ color: faction.color }}>{faction.name}</h2>
                <div className="font-mono-tech text-[9px] opacity-50" style={{ color: faction.color }}>
                  ИЕРАРХИЯ РАНГОВ · {faction.ranks.length} УРОВНЕЙ
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {[...faction.ranks].reverse().map((rank, i) => {
                const level = faction.ranks.length - i;
                const isTop = level >= 8;
                return (
                  <div key={rank.id} className="flex items-center gap-3 p-3 rounded transition-all duration-200"
                    style={{ borderLeft: `2px solid ${isTop ? faction.color : `${faction.color}25`}` }}>
                    <div className="font-orbitron text-lg font-black w-8 text-center opacity-20" style={{ color: faction.color }}>{level}</div>
                    <div className="flex-1">
                      <div className="font-rajdhani font-semibold text-sm" style={{
                        color: isTop ? faction.color : `${faction.color}99`,
                        textShadow: isTop ? `0 0 8px ${faction.color}60` : "none",
                      }}>{rank.name}</div>
                      <div className="font-mono-tech text-[9px] opacity-40" style={{ color: faction.color }}>{rank.code}</div>
                    </div>
                    <div className="font-mono-tech text-[9px] text-right" style={{ color: faction.color, opacity: 0.5 }}>
                      {rank.xp.toLocaleString()} XP
                    </div>
                    {isTop && <div className="w-1.5 h-1.5 rounded-full" style={{ background: faction.color, boxShadow: `0 0 6px ${faction.color}` }} />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function ProfilePage({ currentUser, setPage, onLogout, onUserUpdate }: {
  currentUser: User | null;
  setPage: (p: Page) => void;
  onLogout: () => void;
  onUserUpdate: (u: User) => void;
}) {
  const char = currentUser?.character;
  const faction = FACTIONS.find((f) => f.id === char?.faction);
  const color = faction?.color || "#00d4ff";

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editData, setEditData] = useState({
    charName: char?.name || "",
    species: char?.species || "",
    faction: char?.faction || "republic",
    backstory: char?.backstory || "",
  });

  const handleSave = () => {
    if (!currentUser || !char) return;
    const newFaction = FACTIONS.find((f) => f.id === editData.faction);
    const updatedChar: Character = {
      ...char,
      name: editData.charName || char.name,
      species: editData.species,
      faction: editData.faction,
      backstory: editData.backstory,
      rank: newFaction ? newFaction.ranks[0].name : char.rank,
      photo: FACTION_PHOTOS[editData.faction] || FACTION_PHOTOS.republic,
    };
    const updatedUser: User = { ...currentUser, character: updatedChar };
    const users = getUsers();
    const newUsers = users.map((u) => u.username === currentUser.username ? updatedUser : u);
    saveUsers(newUsers);
    setCurrentUser(updatedUser);
    onUserUpdate(updatedUser);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const displayFaction = editing ? FACTIONS.find((f) => f.id === editData.faction) : faction;
  const displayColor = displayFaction?.color || "#00d4ff";
  const displayPhoto = editing
    ? (FACTION_PHOTOS[editData.faction] || FACTION_PHOTOS.republic)
    : (char?.photo || FACTION_PHOTOS[char?.faction || "republic"] || FACTION_PHOTOS.republic);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-2">// PERSONAL DATABANK</div>
          <h1 className="font-orbitron text-2xl font-bold text-[#00d4ff] glow-text-blue">ПРОФИЛЬ АГЕНТА</h1>
        </div>
        {saved && (
          <div className="font-mono-tech text-[10px] text-[#00ff88] animate-fade-in-up px-3 py-1.5 rounded"
            style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.08)" }}>
            ✓ ДАННЫЕ СОХРАНЕНЫ
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Левая колонка — фото + статистика */}
        <div className="holo-card overflow-hidden scanline" style={{ borderColor: `${displayColor}40` }}>
          {char && (
            <div className="relative h-48">
              <img src={displayPhoto} alt={char.name}
                className="w-full h-full object-cover transition-all duration-500" style={{ filter: "brightness(0.6) saturate(0.8)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(2,8,15,0.95) 100%)" }} />
              <div className="absolute bottom-3 left-3">
                <div className="font-orbitron text-sm font-bold" style={{ color: displayColor, textShadow: `0 0 8px ${displayColor}` }}>
                  {editing ? (editData.charName || "—") : char.name}
                </div>
                <div className="font-mono-tech text-[9px] opacity-60" style={{ color: displayColor }}>
                  {displayFaction?.ranks[0].name || char.rank}
                </div>
              </div>
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            </div>
          )}
          <div className="p-4 space-y-2">
            <div className="font-mono-tech text-[10px] text-[#00d4ff] tracking-widest mb-3">СТАТИСТИКА</div>
            {[
              { label: "ПОЗЫВНОЙ", value: currentUser?.username || "—" },
              { label: "ФРАКЦИЯ", value: displayFaction?.name || "—" },
              { label: "ВИД", value: editing ? (editData.species || "—") : (char?.species || "—") },
              { label: "БОЕВОЙ ОПЫТ", value: `${char?.xp || 0} XP` },
            ].map((s) => (
              <div key={s.label} className="flex justify-between font-mono-tech text-[9px]">
                <span className="text-[#00d4ff] opacity-40">{s.label}</span>
                <span style={{ color: displayColor }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Правая колонка */}
        <div className="md:col-span-2 space-y-4">
          {!editing ? (
            /* Режим просмотра */
            <>
              <div className="holo-card p-5" style={{ borderColor: `${color}30` }}>
                <div className="font-mono-tech text-[10px] tracking-widest mb-3" style={{ color }}>ЛИЧНОЕ ДЕЛО</div>
                <div className="font-rajdhani text-sm leading-relaxed" style={{ color, opacity: 0.75 }}>
                  {char?.backstory || "Данные отсутствуют."}
                </div>
              </div>
              <div className="holo-card p-5">
                <div className="font-mono-tech text-[10px] text-[#00d4ff] tracking-widest mb-4">УПРАВЛЕНИЕ</div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-neon-green px-5 py-2 rounded font-orbitron text-[10px]"
                    onClick={() => { setEditing(true); setEditData({ charName: char?.name || "", species: char?.species || "", faction: char?.faction || "republic", backstory: char?.backstory || "" }); }}>
                    РЕДАКТИРОВАТЬ ДОСЬЕ
                  </button>
                  <button className="btn-neon-blue px-5 py-2 rounded font-orbitron text-[10px]"
                    onClick={() => setPage("characters")}>
                    КАРТОТЕКА
                  </button>
                  <button className="px-5 py-2 rounded font-orbitron text-[10px] transition-all duration-200"
                    style={{ border: "1px solid rgba(255,50,50,0.4)", color: "rgba(255,100,100,0.8)" }}
                    onClick={onLogout}>
                    ВЫЙТИ
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Режим редактирования */
            <div className="holo-card p-5" style={{ borderColor: "rgba(0,255,136,0.3)" }}>
              <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-5">// РЕДАКТИРОВАНИЕ ДОСЬЕ</div>
              <div className="space-y-4">
                <div>
                  <label className="font-mono-tech text-[9px] text-[#00d4ff] opacity-60 tracking-wider block mb-1">ИМЯ ПЕРСОНАЖА</label>
                  <input className="w-full px-3 py-2.5 rounded text-sm holo-input"
                    value={editData.charName} onChange={(e) => setEditData((d) => ({ ...d, charName: e.target.value }))} />
                </div>
                <div>
                  <label className="font-mono-tech text-[9px] text-[#00d4ff] opacity-60 tracking-wider block mb-1">ВИД</label>
                  <select className="w-full px-3 py-2.5 rounded text-sm holo-input"
                    value={editData.species} onChange={(e) => setEditData((d) => ({ ...d, species: e.target.value }))}>
                    <option value="">— Выберите вид —</option>
                    <option>Клон-человек</option><option>Человек</option><option>Тви'лек</option>
                    <option>Монгрел</option><option>Забрак</option><option>Кел Дор</option><option>Дроид</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono-tech text-[9px] text-[#00d4ff] opacity-60 tracking-wider block mb-1">ФРАКЦИЯ</label>
                  <div className="grid grid-cols-3 gap-2">
                    {FACTIONS.map((f) => (
                      <button key={f.id} onClick={() => setEditData((d) => ({ ...d, faction: f.id }))}
                        className="p-2 rounded text-center transition-all duration-200"
                        style={{
                          border: `1px solid ${editData.faction === f.id ? f.color : "rgba(0,212,255,0.2)"}`,
                          background: editData.faction === f.id ? `${f.color}20` : "transparent",
                          color: editData.faction === f.id ? f.color : "rgba(0,212,255,0.5)",
                          boxShadow: editData.faction === f.id ? `0 0 10px ${f.color}40` : "none",
                        }}>
                        <div>{f.emblem}</div>
                        <div className="font-mono-tech text-[8px] mt-1">
                          {f.id === "republic" ? "РЕСПУБЛИКА" : f.id === "jedi" ? "ДЖЕДАИ" : "МАНДА."}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-mono-tech text-[9px] text-[#00d4ff] opacity-60 tracking-wider block mb-1">ИСТОРИЯ ПЕРСОНАЖА</label>
                  <textarea className="w-full px-3 py-2.5 rounded text-sm holo-input resize-none" rows={4}
                    placeholder="Опишите историю вашего персонажа..."
                    value={editData.backstory} onChange={(e) => setEditData((d) => ({ ...d, backstory: e.target.value }))} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 py-2.5 rounded btn-neon-green font-orbitron text-[10px]" onClick={handleSave}>
                    СОХРАНИТЬ
                  </button>
                  <button className="flex-1 py-2.5 rounded font-orbitron text-[10px] transition-all duration-200"
                    style={{ border: "1px solid rgba(0,212,255,0.2)", color: "rgba(0,212,255,0.5)" }}
                    onClick={() => setEditing(false)}>
                    ОТМЕНА
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState<Page>("register");
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) { setCurrentUserState(saved); setPage("home"); }
  }, []);

  const handleDone = (user: User) => {
    setCurrentUserState(user);
    setPage("home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setPage("register");
  };

  const handleUserUpdate = (updated: User) => {
    setCurrentUserState(updated);
  };

  if (page === "register") {
    return <RegisterPage onDone={handleDone} />;
  }

  return (
    <PageWrapper page={page} setPage={setPage}>
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "news" && <NewsPage />}
      {page === "rules" && <RulesPage />}
      {page === "characters" && <CharactersPage currentUser={currentUser} />}
      {page === "factions" && <FactionsPage />}
      {page === "profile" && <ProfilePage currentUser={currentUser} setPage={setPage} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />}
    </PageWrapper>
  );
}