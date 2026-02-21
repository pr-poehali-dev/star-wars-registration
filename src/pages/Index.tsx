import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "register" | "home" | "news" | "rules" | "characters" | "factions" | "profile";

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
    id: "separatists",
    name: "Конфедерация Независимых Систем",
    color: "#00ff88",
    emblem: "🟢",
    description: "Освободители от тирании Республики",
    ranks: [
      { id: 1, name: "Боевой дроид B1", code: "B1-0000", xp: 0 },
      { id: 2, name: "Элитный B1", code: "B1-E000", xp: 500 },
      { id: 3, name: "Командир дроидов", code: "B1-C100", xp: 1500 },
      { id: 4, name: "Суперразрушитель", code: "B2-0100", xp: 3000 },
      { id: 5, name: "Лейтенант дроидов", code: "B2-L200", xp: 6000 },
      { id: 6, name: "Капитан дроидов", code: "B2-C300", xp: 10000 },
      { id: 7, name: "Командер ОМ-9", code: "OOM-900", xp: 16000 },
      { id: 8, name: "Тактический дроид", code: "TX-200", xp: 25000 },
      { id: 9, name: "СуперТактик", code: "TX-009", xp: 40000 },
      { id: 10, name: "Генерал КНС", code: "GEN-001", xp: 60000 },
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
    id: 1,
    title: "Битва при Джеонозисе — официальный старт сервера",
    date: "21.02.26 | 00:00 GST",
    category: "СОБЫТИЕ",
    color: "#00d4ff",
    text: "Сервер Nova | Galactic Multiverse официально запущен. Первая фаза Войн клонов началась. Все игроки могут зарегистрировать своих персонажей.",
  },
  {
    id: 2,
    title: "Добавлена система рангов и прогрессии",
    date: "20.02.26 | 18:30 GST",
    category: "ОБНОВЛЕНИЕ",
    color: "#00ff88",
    text: "Введена полная иерархия рангов для трёх фракций: Республика, КНС и Мандалорцы. Каждый ранг открывается при накоплении опыта.",
  },
  {
    id: 3,
    title: "Новые локации: Камино и Корусант",
    date: "19.02.26 | 12:00 GST",
    category: "КОНТЕНТ",
    color: "#00d4ff",
    text: "Открыты тренировочные базы на Камино и командный центр Джедаев на Корусанте. Доступны для всех зарегистрированных персонажей.",
  },
];

const RULES = [
  {
    section: "I. Основные правила",
    color: "#00d4ff",
    items: [
      "Уважение ко всем участникам RP-сообщества обязательно",
      "Meta-gaming и god-moding строго запрещены",
      "Все действия персонажа должны соответствовать эпохе клонов",
      "OOC общение только в специальных каналах",
    ],
  },
  {
    section: "II. Боевая система",
    color: "#00ff88",
    items: [
      "Бои проводятся через систему кубиков (/roll)",
      "Смерть персонажа возможна только с согласия игрока",
      "Захват персонажа требует 3 хода без сопротивления",
      "Запрещено использование сил/оружия не по классу",
    ],
  },
  {
    section: "III. Ролевое поведение",
    color: "#00d4ff",
    items: [
      "Персонаж должен оставаться в роли во время RP сцен",
      "История персонажа должна соответствовать лору",
      "Межфракционное взаимодействие возможно в нейтральных зонах",
      "Все конфликты разрешаются через администрацию",
    ],
  },
];

const CHARACTERS_MOCK = [
  { id: 1, name: "RC-1138 'Босс'", faction: "republic", rank: "Командер", xp: 28000, status: "active" },
  { id: 2, name: "В-Р34", faction: "separatists", rank: "Тактический дроид", xp: 22000, status: "active" },
];

export default function Index() {
  const [page, setPage] = useState<Page>("register");
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState({
    username: "", password: "", confirmPassword: "", charName: "", faction: "", species: "", backstory: ""
  });
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "news", label: "Новости", icon: "Radio" },
    { id: "rules", label: "Правила", icon: "ScrollText" },
    { id: "characters", label: "Персонажи", icon: "Users" },
    { id: "factions", label: "Фракции", icon: "Shield" },
    { id: "profile", label: "Профиль", icon: "CircleUser" },
  ];

  const StarField = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="animate-star-scroll">
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() > 0.9 ? "2px" : "1px",
              height: Math.random() > 0.9 ? "2px" : "1px",
              top: `${Math.random() * 200}%`,
              left: `${Math.random() * 100}%`,
              background: Math.random() > 0.7 ? "rgba(0,212,255,0.6)" : "rgba(255,255,255,0.4)",
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );

  const ScanLine = () => (
    <div
      className="fixed top-0 left-0 right-0 h-px pointer-events-none z-50 opacity-30"
      style={{
        background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
        animation: "scan-line 8s linear infinite",
      }}
    />
  );

  const Logo = () => (
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

  const RegisterPage = () => (
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

        <div className="holo-card scanline relative p-6 corner-tl corner-br">
          <div className="absolute top-2 right-2 font-mono-tech text-[10px] text-[#00d4ff] opacity-40">
            SYS://HOLONET/AUTH
          </div>
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
                  value={regData.username} onChange={(e) => setRegData({ ...regData, username: e.target.value })} />
              </div>
              <div>
                <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">КОД ДОСТУПА</label>
                <input type="password" className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="••••••••"
                  value={regData.password} onChange={(e) => setRegData({ ...regData, password: e.target.value })} />
              </div>
              <div>
                <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ПОДТВЕРЖДЕНИЕ</label>
                <input type="password" className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="••••••••"
                  value={regData.confirmPassword} onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })} />
              </div>
              <button className="w-full py-3 rounded btn-neon-blue font-orbitron text-xs mt-2" onClick={() => setRegStep(2)}>
                Следующий модуль →
              </button>
              <div className="text-center">
                <button className="font-mono-tech text-[10px] text-[#00d4ff] opacity-50 hover:opacity-100 transition-opacity"
                  onClick={() => setPage("home")}>
                  УЖЕ ЗАРЕГИСТРИРОВАН? ВОЙТИ
                </button>
              </div>
            </div>
          )}

          {regStep === 2 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-4">МОДУЛЬ 02 // СОЗДАНИЕ ПЕРСОНАЖА</div>
              <div>
                <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ИМЯ ПЕРСОНАЖА</label>
                <input className="w-full px-3 py-2.5 rounded text-sm holo-input" placeholder="CT-7567 'Рекс'"
                  value={regData.charName} onChange={(e) => setRegData({ ...regData, charName: e.target.value })} />
              </div>
              <div>
                <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ВИД</label>
                <select className="w-full px-3 py-2.5 rounded text-sm holo-input"
                  value={regData.species} onChange={(e) => setRegData({ ...regData, species: e.target.value })}>
                  <option value="">— Выберите вид —</option>
                  <option>Клон-человек</option>
                  <option>Человек</option>
                  <option>Тви'лек</option>
                  <option>Монгрел</option>
                  <option>Забрак</option>
                  <option>Кел Дор</option>
                  <option>Дроид</option>
                </select>
              </div>
              <div>
                <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ФРАКЦИЯ</label>
                <div className="grid grid-cols-3 gap-2">
                  {FACTIONS.map((f) => (
                    <button key={f.id} onClick={() => setRegData({ ...regData, faction: f.id })}
                      className="p-2 rounded text-center transition-all duration-200 text-xs"
                      style={{
                        border: `1px solid ${regData.faction === f.id ? f.color : "rgba(0,212,255,0.2)"}`,
                        background: regData.faction === f.id ? `${f.color}20` : "transparent",
                        color: regData.faction === f.id ? f.color : "rgba(0,212,255,0.5)",
                        boxShadow: regData.faction === f.id ? `0 0 10px ${f.color}40` : "none",
                      }}>
                      <div>{f.emblem}</div>
                      <div className="font-mono-tech text-[8px] mt-1 leading-tight">
                        {f.id === "republic" ? "РЕСПУБЛИКА" : f.id === "separatists" ? "КНС" : "МАНДА."}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded btn-neon-blue font-orbitron text-xs opacity-60" onClick={() => setRegStep(1)}>← Назад</button>
                <button className="flex-1 py-3 rounded btn-neon-blue font-orbitron text-xs" onClick={() => setRegStep(3)}>Далее →</button>
              </div>
            </div>
          )}

          {regStep === 3 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-4">МОДУЛЬ 03 // ПРЕДЫСТОРИЯ</div>
              <div>
                <label className="font-mono-tech text-[10px] text-[#00d4ff] opacity-70 tracking-wider block mb-1">ИСТОРИЯ ПЕРСОНАЖА</label>
                <textarea className="w-full px-3 py-2.5 rounded text-sm holo-input resize-none" rows={5}
                  placeholder="Опишите историю вашего персонажа..."
                  value={regData.backstory} onChange={(e) => setRegData({ ...regData, backstory: e.target.value })} />
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
                <button className="flex-1 py-3 rounded btn-neon-green font-orbitron text-xs" onClick={() => setPage("home")}>
                  ЗАРЕГИСТРИРОВАТЬСЯ
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="text-center mt-4 font-mono-tech text-[9px] text-[#00d4ff] opacity-30 tracking-widest">
          NOVA GALACTIC MULTIVERSE · SWRP · © 22 BBY
        </div>
      </div>
    </div>
  );

  const NavBar = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 scanline" style={{
      background: "rgba(2, 8, 15, 0.92)",
      borderBottom: "1px solid rgba(0,212,255,0.2)",
      boxShadow: "0 0 20px rgba(0,212,255,0.1)",
      backdropFilter: "blur(12px)",
    }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Logo />
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
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

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen relative">
      <StarField />
      <ScanLine />
      <NavBar />
      <div className="pt-14 relative z-10">{children}</div>
    </div>
  );

  const HomePage = () => (
    <PageWrapper>
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
            { label: "ИГРОКОВ ОНЛАЙН", value: "247", icon: "Users", color: "#00d4ff" },
            { label: "ПЕРСОНАЖЕЙ", value: "1,843", icon: "CircleUser", color: "#00ff88" },
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
            <div className="absolute top-3 right-3 font-mono-tech text-[9px] text-[#00d4ff] opacity-40">SYS OK</div>
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
          <div className="holo-card p-5">
            <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-3">БЫСТРЫЙ СТАРТ</div>
            <div className="space-y-2">
              {["Создай персонажа", "Выбери фракцию", "Изучи иерархию рангов", "Найди свою роль в RP"].map((step, i) => (
                <div key={i} className="flex items-center gap-2 font-rajdhani text-sm text-[#00d4ff] opacity-70">
                  <span className="font-orbitron text-[10px] text-[#00ff88]">0{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded btn-neon-green font-orbitron text-[10px]" onClick={() => setPage("factions")}>
              Смотреть фракции
            </button>
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
                    color: n.color, border: `1px solid ${n.color}40`, background: `${n.color}10`
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
    </PageWrapper>
  );

  const NewsPage = () => (
    <PageWrapper>
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
                        color: n.color, border: `1px solid ${n.color}40`, background: `${n.color}10`
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
    </PageWrapper>
  );

  const RulesPage = () => (
    <PageWrapper>
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
                    <span className="font-mono-tech text-[10px] mt-0.5" style={{ color: section.color }}>►</span>
                    {item}
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
    </PageWrapper>
  );

  const CharactersPage = () => (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-2">// DATABANK: CHARACTERS</div>
            <h1 className="font-orbitron text-2xl font-bold text-[#00d4ff] glow-text-blue">МОИ ПЕРСОНАЖИ</h1>
          </div>
          <button className="btn-neon-green px-4 py-2 rounded font-orbitron text-[10px]" onClick={() => { setRegStep(1); setPage("register"); }}>
            + СОЗДАТЬ
          </button>
        </div>
        <div className="space-y-4">
          {CHARACTERS_MOCK.map((char) => {
            const faction = FACTIONS.find((f) => f.id === char.faction);
            return (
              <div key={char.id} className="holo-card p-5 scanline relative" style={{ borderColor: `${faction?.color}40` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded flex items-center justify-center text-2xl"
                      style={{ background: `${faction?.color}10`, border: `1px solid ${faction?.color}40` }}>
                      {faction?.emblem}
                    </div>
                    <div>
                      <h3 className="font-orbitron text-sm font-bold" style={{ color: faction?.color }}>{char.name}</h3>
                      <div className="font-mono-tech text-[10px] text-[#00d4ff] opacity-60 mt-0.5">{char.rank}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-orbitron text-lg font-bold" style={{ color: faction?.color }}>{char.xp.toLocaleString()}</div>
                    <div className="font-mono-tech text-[9px] text-[#00d4ff] opacity-50">XP</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between font-mono-tech text-[9px] text-[#00d4ff] opacity-50 mb-1">
                    <span>ПРОГРЕСС К СЛЕДУЮЩЕМУ РАНГУ</span>
                    <span>{Math.round((char.xp / 40000) * 100)}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-[rgba(0,212,255,0.1)]">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((char.xp / 40000) * 100, 100)}%`, background: faction?.color, boxShadow: `0 0 6px ${faction?.color}` }} />
                  </div>
                </div>
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );

  const FactionsPage = () => (
    <PageWrapper>
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
    </PageWrapper>
  );

  const ProfilePage = () => (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="font-mono-tech text-[10px] text-[#00ff88] tracking-widest mb-2">// PERSONAL DATABANK</div>
          <h1 className="font-orbitron text-2xl font-bold text-[#00d4ff] glow-text-blue">ПРОФИЛЬ ИГРОКА</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="holo-card p-5 text-center scanline">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-[#00d4ff] flex items-center justify-center"
              style={{ background: "rgba(0,212,255,0.1)", boxShadow: "0 0 20px rgba(0,212,255,0.2)" }}>
              <Icon name="CircleUser" size={32} className="text-[#00d4ff]" />
            </div>
            <div className="font-orbitron text-sm font-bold text-[#00d4ff] mb-1">КОМАНДИР_01</div>
            <div className="font-mono-tech text-[9px] text-[#00ff88] opacity-60">СТАТУС: АКТИВЕН</div>
            <div className="mt-3 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, #00d4ff40, transparent)" }} />
            <div className="mt-3 space-y-1">
              {[
                { label: "ПЕРСОНАЖИ", value: "2" },
                { label: "ДНЕЙ НА СЕРВЕРЕ", value: "7" },
                { label: "RP СЕССИЙ", value: "14" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between font-mono-tech text-[9px]">
                  <span className="text-[#00d4ff] opacity-40">{s.label}</span>
                  <span className="text-[#00ff88]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="holo-card p-5">
              <div className="font-mono-tech text-[10px] text-[#00d4ff] tracking-widest mb-4">НАСТРОЙКИ АККАУНТА</div>
              <div className="space-y-3">
                {[
                  { label: "ПОЗЫВНОЙ", value: "КОМАНДИР_01" },
                  { label: "EMAIL", value: "cmd01@holonet.rep" },
                  { label: "ВРЕМЕННАЯ ЗОНА", value: "GST (Galactic Standard)" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="font-mono-tech text-[9px] text-[#00d4ff] opacity-50 tracking-wider block mb-1">{field.label}</label>
                    <input className="w-full px-3 py-2 rounded text-sm holo-input" defaultValue={field.value} />
                  </div>
                ))}
                <button className="btn-neon-blue px-5 py-2 rounded font-orbitron text-[10px] mt-2">СОХРАНИТЬ ДАННЫЕ</button>
              </div>
            </div>
            <div className="holo-card p-5">
              <div className="font-mono-tech text-[10px] text-[#00d4ff] tracking-widest mb-4">БЕЗОПАСНОСТЬ</div>
              <button className="btn-neon-blue px-5 py-2 rounded font-orbitron text-[10px] mr-2 mb-2">СМЕНИТЬ ПАРОЛЬ</button>
              <button
                className="px-5 py-2 rounded font-orbitron text-[10px] transition-all duration-200"
                style={{ border: "1px solid rgba(255,50,50,0.4)", color: "rgba(255,100,100,0.8)" }}
                onClick={() => setPage("register")}>
                ВЫЙТИ ИЗ СИСТЕМЫ
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );

  if (page === "register") return <RegisterPage />;
  if (page === "home") return <HomePage />;
  if (page === "news") return <NewsPage />;
  if (page === "rules") return <RulesPage />;
  if (page === "characters") return <CharactersPage />;
  if (page === "factions") return <FactionsPage />;
  if (page === "profile") return <ProfilePage />;
  return <HomePage />;
}