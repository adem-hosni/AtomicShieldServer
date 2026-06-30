import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "nl", name: "Nederlands", flag: "��🇱" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

// Comprehensive translation map for the entire application
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Navigation & Layout
    dashboard: "Dashboard",
    players: "Players",
    bans: "Bans",
    language: "Language",
    news: "News",
    changelogs: "Changelogs",
    download: "Download",
    models: "Models",
    myServers: "My Platforms",
    support: "Support",
    documentation: "Documentation",
    configuration: "Configuration",
    lookup: "Lookup",
    moderators: "Moderators",
    auditLogs: "Audit Logs",

    // Dashboard Content
    fiveCityRpDashboard: "Performance Dashboard",
    monitorServerPerformance:
      "Monitor your platform's performance optimization and user activity",
    serverStatus: "Platform Status",
    online: "Online",
    offline: "Offline",
    serverIP: "Platform IP",
    licenseKey: "License Key",
    licenseExpiration: "License Expiration",
    totalPlayers: "Total Users",
    activeBans: "Access Controls",
    threatDetection: "Performance Monitoring",
    uptime: "Uptime",
    analytics: "Analytics",
    today: "Today",
    week: "Week",
    month: "Month",

    // Common Actions
    view: "View",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    loading: "Loading",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    refresh: "Refresh",

    // Status & Messages
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",

    // Page Titles & Content
    playerManagement: "User Management",
    monitorAndManage: "Monitor and manage active users on your platform",
    moderatorManagement: "Administrator Management",
    auditLogManagement: "Audit Log Management",
    configurationManagement: "Configuration Management",
    anticheatConfiguration: "Enhancement Configuration",

    // Home Page
    nextGenCybersecurity: "Next-Generation Cybersecurity Platform",
    secureYour: "Secure Your",
    digitalEmpire: "Digital Empire",
    militaryGradeProtection:
      "Quantum-grade performance optimization powered by AI-driven insights. Enhance your gaming platforms with intelligent monitoring and adaptive defense systems.",
    getStarted: "Get Started",
    watchDemo: "Watch Demo",

    // Welcome & Misc
    welcome: "Welcome to AtomicShield",
    languageChanged: "Language Changed",
    switchedTo: "Switched to",
  },
  es: {
    // Navigation & Layout
    dashboard: "Panel de Control",
    players: "Jugadores",
    bans: "Prohibiciones",
    language: "Idioma",
    news: "Noticias",
    changelogs: "Registro de Cambios",
    download: "Descargar",
    models: "Modelos",
    myServers: "Mis Servidores",
    support: "Soporte",
    documentation: "Documentación",
    configuration: "Configuración",
    lookup: "Búsqueda",
    moderators: "Moderadores",
    auditLogs: "Registros de Auditoría",

    // Dashboard Content
    fiveCityRpDashboard: "Panel de FiveCity RP",
    monitorServerPerformance:
      "Monitorea el rendimiento anti-cheat de tu servidor y la actividad de los jugadores",
    serverStatus: "Estado del Servidor",
    online: "En Línea",
    offline: "Desconectado",
    serverIP: "IP del Servidor",
    licenseKey: "Clave de Licencia",
    licenseExpiration: "Expiración de Licencia",
    totalPlayers: "Total de Jugadores",
    activeBans: "Prohibiciones Activas",
    threatDetection: "Detección de Amenazas",
    uptime: "Tiempo Activo",
    analytics: "Analíticas",
    today: "Hoy",
    week: "Semana",
    month: "Mes",

    // Common Actions
    view: "Ver",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    loading: "Cargando",
    search: "Buscar",
    filter: "Filtrar",
    export: "Exportar",
    import: "Importar",
    refresh: "Actualizar",

    // Status & Messages
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
    success: "Éxito",
    error: "Error",
    warning: "Advertencia",
    info: "Información",

    // Page Titles & Content
    playerManagement: "Gestión de Jugadores",
    monitorAndManage: "Monitorea y gestiona jugadores en línea en tu servidor",
    moderatorManagement: "Gesti��n de Moderadores",
    auditLogManagement: "Gestión de Registros de Auditoría",
    configurationManagement: "Gestión de Configuración",
    anticheatConfiguration: "Configuración Anticheat",

    // Home Page
    nextGenCybersecurity: "Plataforma de Ciberseguridad de Nueva Generación",
    secureYour: "Asegura Tu",
    digitalEmpire: "Imperio Digital",
    militaryGradeProtection:
      "Protección anti-trampas de grado militar impulsada por IA cuántica. Defiende tus servidores FiveM contra amenazas sofisticadas con detección de latencia cero.",
    getStarted: "Comenzar",
    watchDemo: "Ver Demo",

    // Welcome & Misc
    welcome: "Bienvenido a AtomicShield",
    languageChanged: "Idioma Cambiado",
    switchedTo: "Cambiado a",
  },
  fr: {
    // Navigation & Layout
    dashboard: "Tableau de Bord",
    players: "Joueurs",
    bans: "Bannissements",
    language: "Langue",
    news: "Actualités",
    changelogs: "Journaux de Modifications",
    download: "Télécharger",
    models: "Modèles",
    myServers: "Mes Serveurs",
    support: "Support",
    documentation: "Documentation",
    configuration: "Configuration",
    lookup: "Recherche",
    moderators: "Modérateurs",
    auditLogs: "Journaux d'Audit",

    // Dashboard Content
    fiveCityRpDashboard: "Tableau de Bord FiveCity RP",
    monitorServerPerformance:
      "Surveillez les performances anti-triche de votre serveur et l'activité des joueurs",
    serverStatus: "Statut du Serveur",
    online: "En Ligne",
    offline: "Hors Ligne",
    serverIP: "IP du Serveur",
    licenseKey: "Clé de Licence",
    licenseExpiration: "Expiration de Licence",
    totalPlayers: "Total des Joueurs",
    activeBans: "Bannissements Actifs",
    threatDetection: "Détection de Menaces",
    uptime: "Temps de Fonctionnement",
    analytics: "Analyses",
    today: "Aujourd'hui",
    week: "Semaine",
    month: "Mois",

    // Common Actions
    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Sauvegarder",
    cancel: "Annuler",
    confirm: "Confirmer",
    loading: "Chargement",
    search: "Rechercher",
    filter: "Filtrer",
    export: "Exporter",
    import: "Importer",
    refresh: "Actualiser",

    // Status & Messages
    active: "Actif",
    inactive: "Inactif",
    pending: "En Attente",
    approved: "Approuvé",
    rejected: "Rejeté",
    success: "Succès",
    error: "Erreur",
    warning: "Avertissement",
    info: "Information",

    // Page Titles & Content
    playerManagement: "Gestion des Joueurs",
    monitorAndManage:
      "Surveillez et gérez les joueurs en ligne sur votre serveur",
    moderatorManagement: "Gestion des Modérateurs",
    auditLogManagement: "Gestion des Journaux d'Audit",
    configurationManagement: "Gestion de la Configuration",
    anticheatConfiguration: "Configuration Anticheat",

    // Home Page
    nextGenCybersecurity: "Plateforme de Cybersécurité Nouvelle Génération",
    secureYour: "Sécurisez Votre",
    digitalEmpire: "Empire Numérique",
    militaryGradeProtection:
      "Protection anti-triche de niveau militaire alimentée par l'IA quantique. Défendez vos serveurs FiveM contre les menaces sophistiquées avec une détection à latence zéro.",
    getStarted: "Commencer",
    watchDemo: "Voir la Démo",

    // Welcome & Misc
    welcome: "Bienvenue sur AtomicShield",
    languageChanged: "Langue Changée",
    switchedTo: "Basculé vers",
  },
  de: {
    // Navigation & Layout
    dashboard: "Dashboard",
    players: "Spieler",
    bans: "Sperren",
    language: "Sprache",
    news: "Nachrichten",
    changelogs: "Änderungsprotokoll",
    download: "Herunterladen",
    models: "Modelle",
    myServers: "Meine Server",
    support: "Support",
    documentation: "Dokumentation",
    configuration: "Konfiguration",
    lookup: "Suche",
    moderators: "Moderatoren",
    auditLogs: "Audit-Protokolle",

    // Dashboard Content
    fiveCityRpDashboard: "FiveCity RP Dashboard",
    monitorServerPerformance:
      "Überwachen Sie die Anti-Cheat-Leistung Ihres Servers und die Spieleraktivität",
    serverStatus: "Server-Status",
    online: "Online",
    offline: "Offline",
    serverIP: "Server-IP",
    licenseKey: "Lizenzschlüssel",
    licenseExpiration: "Lizenz-Ablauf",
    totalPlayers: "Gesamte Spieler",
    activeBans: "Aktive Sperren",
    threatDetection: "Bedrohungserkennung",
    uptime: "Betriebszeit",
    analytics: "Analysen",
    today: "Heute",
    week: "Woche",
    month: "Monat",

    // Common Actions
    view: "Anzeigen",
    edit: "Bearbeiten",
    delete: "Löschen",
    save: "Speichern",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    loading: "Laden",
    search: "Suchen",
    filter: "Filtern",
    export: "Exportieren",
    import: "Importieren",
    refresh: "Aktualisieren",

    // Status & Messages
    active: "Aktiv",
    inactive: "Inaktiv",
    pending: "Ausstehend",
    approved: "Genehmigt",
    rejected: "Abgelehnt",
    success: "Erfolg",
    error: "Fehler",
    warning: "Warnung",
    info: "Information",

    // Page Titles & Content
    playerManagement: "Spielerverwaltung",
    monitorAndManage:
      "Überwachen und verwalten Sie Online-Spieler auf Ihrem Server",
    moderatorManagement: "Moderatorenverwaltung",
    auditLogManagement: "Audit-Log-Verwaltung",
    configurationManagement: "Konfigurationsverwaltung",
    anticheatConfiguration: "Anticheat-Konfiguration",

    // Home Page
    nextGenCybersecurity: "Cybersicherheitsplattform der nächsten Generation",
    secureYour: "Sichern Sie Ihr",
    digitalEmpire: "Digitales Reich",
    militaryGradeProtection:
      "Anti-Cheat-Schutz in Militärqualität, angetrieben von Quanten-KI. Verteidigen Sie Ihre FiveM-Server gegen raffinierte Bedrohungen mit latenzfreier Erkennung.",
    getStarted: "Erste Schritte",
    watchDemo: "Demo ansehen",

    // Welcome & Misc
    welcome: "Willkommen bei AtomicShield",
    languageChanged: "Sprache Geändert",
    switchedTo: "Gewechselt zu",
  },
  nl: {
    // Navigation & Layout
    dashboard: "Dashboard",
    players: "Spelers",
    bans: "Verbanningen",
    language: "Taal",
    news: "Nieuws",
    changelogs: "Wijzigingslogboek",
    download: "Downloaden",
    models: "Modellen",
    myServers: "Mijn Servers",
    support: "Ondersteuning",
    documentation: "Documentatie",
    configuration: "Configuratie",
    lookup: "Opzoeken",
    moderators: "Moderators",
    auditLogs: "Audit Logboeken",

    // Dashboard Content
    fiveCityRpDashboard: "FiveCity RP Dashboard",
    monitorServerPerformance:
      "Monitor de anti-cheat prestaties van je server en speler activiteit",
    serverStatus: "Server Status",
    online: "Online",
    offline: "Offline",
    serverIP: "Server IP",
    licenseKey: "Licentiesleutel",
    licenseExpiration: "Licentie Vervaldatum",
    totalPlayers: "Totaal Spelers",
    activeBans: "Actieve Verbanningen",
    threatDetection: "Bedreigingsdetectie",
    uptime: "Uptime",
    analytics: "Analytics",
    today: "Vandaag",
    week: "Week",
    month: "Maand",

    // Common Actions
    view: "Bekijken",
    edit: "Bewerken",
    delete: "Verwijderen",
    save: "Opslaan",
    cancel: "Annuleren",
    confirm: "Bevestigen",
    loading: "Laden",
    search: "Zoeken",
    filter: "Filteren",
    export: "Exporteren",
    import: "Importeren",
    refresh: "Vernieuwen",

    // Status & Messages
    active: "Actief",
    inactive: "Inactief",
    pending: "In Behandeling",
    approved: "Goedgekeurd",
    rejected: "Afgewezen",
    success: "Succes",
    error: "Fout",
    warning: "Waarschuwing",
    info: "Informatie",

    // Page Titles & Content
    playerManagement: "Spelerbeheer",
    monitorAndManage: "Monitor en beheer online spelers op je server",
    moderatorManagement: "Moderatorbeheer",
    auditLogManagement: "Audit Log Beheer",
    configurationManagement: "Configuratiebeheer",
    anticheatConfiguration: "Anticheat Configuratie",

    // Welcome & Misc
    welcome: "Welkom bij AtomicShield",
    languageChanged: "Taal Gewijzigd",
    switchedTo: "Overgeschakeld naar",
  },
  it: {
    // Navigation & Layout
    dashboard: "Dashboard",
    players: "Giocatori",
    bans: "Ban",
    language: "Lingua",
    news: "Notizie",
    changelogs: "Registro Modifiche",
    download: "Scarica",
    models: "Modelli",
    myServers: "I Miei Server",
    support: "Supporto",
    documentation: "Documentazione",
    configuration: "Configurazione",
    lookup: "Ricerca",
    moderators: "Moderatori",
    auditLogs: "Log di Audit",

    // Dashboard Content
    fiveCityRpDashboard: "Dashboard FiveCity RP",
    monitorServerPerformance:
      "Monitora le prestazioni anti-cheat del tuo server e l'attività dei giocatori",
    serverStatus: "Stato del Server",
    online: "Online",
    offline: "Offline",
    serverIP: "IP del Server",
    licenseKey: "Chiave di Licenza",
    licenseExpiration: "Scadenza Licenza",
    totalPlayers: "Giocatori Totali",
    activeBans: "Ban Attivi",
    threatDetection: "Rilevamento Minacce",
    uptime: "Uptime",
    analytics: "Analisi",
    today: "Oggi",
    week: "Settimana",
    month: "Mese",

    // Common Actions
    view: "Visualizza",
    edit: "Modifica",
    delete: "Elimina",
    save: "Salva",
    cancel: "Annulla",
    confirm: "Conferma",
    loading: "Caricamento",
    search: "Cerca",
    filter: "Filtra",
    export: "Esporta",
    import: "Importa",
    refresh: "Aggiorna",

    // Status & Messages
    active: "Attivo",
    inactive: "Inattivo",
    pending: "In Attesa",
    approved: "Approvato",
    rejected: "Rifiutato",
    success: "Successo",
    error: "Errore",
    warning: "Avviso",
    info: "Informazione",

    // Page Titles & Content
    playerManagement: "Gestione Giocatori",
    monitorAndManage: "Monitora e gestisci i giocatori online sul tuo server",
    moderatorManagement: "Gestione Moderatori",
    auditLogManagement: "Gestione Log di Audit",
    configurationManagement: "Gestione Configurazione",
    anticheatConfiguration: "Configurazione Anticheat",

    // Welcome & Misc
    welcome: "Benvenuto su AtomicShield",
    languageChanged: "Lingua Cambiata",
    switchedTo: "Passato a",
  },
  pt: {
    // Navigation & Layout
    dashboard: "Painel",
    players: "Jogadores",
    bans: "Banimentos",
    language: "Idioma",
    news: "Notícias",
    changelogs: "Registro de Mudanças",
    download: "Download",
    models: "Modelos",
    myServers: "Meus Servidores",
    support: "Suporte",
    documentation: "Documentação",
    configuration: "Configuração",
    lookup: "Pesquisa",
    moderators: "Moderadores",
    auditLogs: "Logs de Auditoria",

    // Dashboard Content
    fiveCityRpDashboard: "Painel FiveCity RP",
    monitorServerPerformance:
      "Monitore o desempenho anti-cheat do seu servidor e atividade dos jogadores",
    serverStatus: "Status do Servidor",
    online: "Online",
    offline: "Offline",
    serverIP: "IP do Servidor",
    licenseKey: "Chave da Licença",
    licenseExpiration: "Expiração da Licença",
    totalPlayers: "Total de Jogadores",
    activeBans: "Banimentos Ativos",
    threatDetection: "Detecção de Ameaças",
    uptime: "Tempo Ativo",
    analytics: "Análises",
    today: "Hoje",
    week: "Semana",
    month: "Mês",

    // Common Actions
    view: "Visualizar",
    edit: "Editar",
    delete: "Deletar",
    save: "Salvar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    loading: "Carregando",
    search: "Pesquisar",
    filter: "Filtrar",
    export: "Exportar",
    import: "Importar",
    refresh: "Atualizar",

    // Status & Messages
    active: "Ativo",
    inactive: "Inativo",
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
    success: "Sucesso",
    error: "Erro",
    warning: "Aviso",
    info: "Informação",

    // Page Titles & Content
    playerManagement: "Gestão de Jogadores",
    monitorAndManage: "Monitore e gerencie jogadores online em seu servidor",
    moderatorManagement: "Gestão de Moderadores",
    auditLogManagement: "Gestão de Logs de Auditoria",
    configurationManagement: "Gestão de Configuração",
    anticheatConfiguration: "Configuração Anticheat",

    // Welcome & Misc
    welcome: "Bem-vindo ao AtomicShield",
    languageChanged: "Idioma Alterado",
    switchedTo: "Alterado para",
  },
  ko: {
    // Navigation & Layout
    dashboard: "대시보드",
    players: "플레이어",
    bans: "차단",
    language: "언어",
    news: "뉴스",
    changelogs: "변경 로그",
    download: "다운로드",
    models: "모델",
    myServers: "내 서버",
    support: "지원",
    documentation: "문서",
    configuration: "구���",
    lookup: "조회",
    moderators: "중재자",
    auditLogs: "감사 로그",

    // Dashboard Content
    fiveCityRpDashboard: "FiveCity RP 대시보드",
    monitorServerPerformance:
      "서버의 안티치트 성능과 플레이어 활동을 모니터링하세요",
    serverStatus: "서버 상태",
    online: "온라인",
    offline: "오프라인",
    serverIP: "서버 IP",
    licenseKey: "라이선스 키",
    licenseExpiration: "라이선스 만료",
    totalPlayers: "총 플레이어",
    activeBans: "활성 차단",
    threatDetection: "위협 탐지",
    uptime: "가동 시간",
    analytics: "분석",
    today: "오늘",
    week: "주",
    month: "월",

    // Common Actions
    view: "보기",
    edit: "편집",
    delete: "삭제",
    save: "저장",
    cancel: "취소",
    confirm: "확인",
    loading: "로딩",
    search: "검색",
    filter: "필터",
    export: "내보내기",
    import: "가져오기",
    refresh: "새로고침",

    // Status & Messages
    active: "활성",
    inactive: "비활성",
    pending: "대기 중",
    approved: "승인됨",
    rejected: "거부됨",
    success: "성공",
    error: "오류",
    warning: "경고",
    info: "정보",

    // Page Titles & Content
    playerManagement: "플레이어 관리",
    monitorAndManage: "서버의 온라인 플레이어를 모니터링하고 관리하세요",
    moderatorManagement: "중재자 관리",
    auditLogManagement: "감사 로그 관리",
    configurationManagement: "구성 관리",
    anticheatConfiguration: "안티치트 구성",

    // Welcome & Misc
    welcome: "AtomicShield에 오신 것을 환영합니다",
    languageChanged: "언어 변경됨",
    switchedTo: "다음으로 변경:",
  },
  cs: {
    // Navigation & Layout
    dashboard: "Ř��dicí Panel",
    players: "Hrá��i",
    bans: "Bany",
    language: "Jazyk",
    news: "Novinky",
    changelogs: "Protokol Změn",
    download: "Stáhnout",
    models: "Modely",
    myServers: "Moje Servery",
    support: "Podpora",
    documentation: "Dokumentace",
    configuration: "Konfigurace",
    lookup: "Vyhledávání",
    moderators: "Moderátoři",
    auditLogs: "Audit Logy",

    // Dashboard Content
    fiveCityRpDashboard: "FiveCity RP Řídicí Panel",
    monitorServerPerformance:
      "Sledujte výkon anti-cheat vašeho serveru a aktivitu hráčů",
    serverStatus: "Stav Serveru",
    online: "Online",
    offline: "Offline",
    serverIP: "IP Serveru",
    licenseKey: "Licenční Klíč",
    licenseExpiration: "Vypršení Licence",
    totalPlayers: "Celkem Hráčů",
    activeBans: "Aktivní Bany",
    threatDetection: "Detekce Hrozeb",
    uptime: "Doba Provozu",
    analytics: "Analytika",
    today: "Dnes",
    week: "Týden",
    month: "Měsíc",

    // Common Actions
    view: "Zobrazit",
    edit: "Upravit",
    delete: "Smazat",
    save: "Uložit",
    cancel: "Zrušit",
    confirm: "Potvrdit",
    loading: "Načítání",
    search: "Hledat",
    filter: "Filtrovat",
    export: "Exportovat",
    import: "Importovat",
    refresh: "Obnovit",

    // Status & Messages
    active: "Aktivní",
    inactive: "Neaktivní",
    pending: "Čekající",
    approved: "Schváleno",
    rejected: "Zamítnuto",
    success: "Úspěch",
    error: "Chyba",
    warning: "Varování",
    info: "Informace",

    // Page Titles & Content
    playerManagement: "Správa Hráčů",
    monitorAndManage: "Sledujte a spravujte online hráče na vašem serveru",
    moderatorManagement: "Správa Moderátorů",
    auditLogManagement: "Správa Audit Logů",
    configurationManagement: "Správa Konfigurace",
    anticheatConfiguration: "Konfigurace Anticheat",

    // Welcome & Misc
    welcome: "Vítejte v AtomicShield",
    languageChanged: "Jazyk Změněn",
    switchedTo: "Přepnuto na",
  },
  vi: {
    // Navigation & Layout
    dashboard: "Bảng Điều Khiển",
    players: "Người Chơi",
    bans: "Cấm",
    language: "Ngôn Ngữ",
    news: "Tin Tức",
    changelogs: "Nhật Ký Thay Đổi",
    download: "Tải Xuống",
    models: "Mô Hình",
    myServers: "Máy Chủ Của Tôi",
    support: "Hỗ Trợ",
    documentation: "Tài Liệu",
    configuration: "Cấu Hình",
    lookup: "Tra Cứu",
    moderators: "Người Điều Hành",
    auditLogs: "Nhật Ký Kiểm Tra",

    // Dashboard Content
    fiveCityRpDashboard: "Bảng Điều Khiển FiveCity RP",
    monitorServerPerformance:
      "Theo dõi hiệu suất chống gian lận và hoạt động người chơi của máy chủ",
    serverStatus: "Trạng Thái Máy Chủ",
    online: "Trực Tuyến",
    offline: "Ngoại Tuyến",
    serverIP: "IP Máy Chủ",
    licenseKey: "Khóa Bản Quyền",
    licenseExpiration: "Hết Hạn Bản Quyền",
    totalPlayers: "Tổng Số Người Chơi",
    activeBans: "Lệnh Cấm Đang Hoạt Động",
    threatDetection: "Phát Hiện Mối Đe Dọa",
    uptime: "Thời Gian Hoạt Động",
    analytics: "Phân Tích",
    today: "Hôm Nay",
    week: "Tuần",
    month: "Tháng",

    // Common Actions
    view: "Xem",
    edit: "Chỉnh Sửa",
    delete: "Xóa",
    save: "Lưu",
    cancel: "Hủy",
    confirm: "Xác Nhận",
    loading: "Đang Tải",
    search: "Tìm Kiếm",
    filter: "Lọc",
    export: "Xuất",
    import: "Nh���p",
    refresh: "Làm Mới",

    // Status & Messages
    active: "Hoạt Động",
    inactive: "Không Hoạt Động",
    pending: "Đang Chờ",
    approved: "Đã Phê Duyệt",
    rejected: "Đã Từ Chối",
    success: "Thành Công",
    error: "Lỗi",
    warning: "Cảnh Báo",
    info: "Thông Tin",

    // Page Titles & Content
    playerManagement: "Quản Lý Người Chơi",
    monitorAndManage:
      "Theo dõi và quản lý người chơi trực tuyến trên máy chủ của bạn",
    moderatorManagement: "Quản Lý Người Điều Hành",
    auditLogManagement: "Quản Lý Nhật Ký Kiểm Tra",
    configurationManagement: "Quản Lý Cấu Hình",
    anticheatConfiguration: "Cấu Hình Anticheat",

    // Welcome & Misc
    welcome: "Chào Mừng Đến Với AtomicShield",
    languageChanged: "Đã Thay Đổi Ngôn Ngữ",
    switchedTo: "Chuyển Sang",
  },
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  isLoading: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES[0],
  );
  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = async (language: Language) => {
    setIsLoading(true);
    try {
      // Store preference in localStorage
      localStorage.setItem("preferred-language", language.code);
      setCurrentLanguage(language);

      // Show visual feedback for language change
      const event = new CustomEvent("language-changed", {
        detail: { language: language.name, flag: language.flag },
      });
      window.dispatchEvent(event);

      // Simulate loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Failed to change language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key: string): string => {
    const translations =
      TRANSLATIONS[currentLanguage.code] || TRANSLATIONS["en"];
    return translations[key] || key;
  };

  // Initialize language from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(
        (lang) => lang.code === savedLanguage,
      );
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setLanguage, isLoading, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
