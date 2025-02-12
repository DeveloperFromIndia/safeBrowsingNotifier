export const cmd = {
    main: "💾 Стастистика",
    websites: "📁 Домены",
    // users
    users: "👤 Пользователи",
    access: {
        0:"❌ Заблокировать",
        1:"🔑 Анулировать права",
        2:"📂 Доступ к доменам",
        3:"👤 Доступ к пользователям",
    },
    accessRequest: "🔑 Запросить доступ",
    // utils buttons
    backInMainMenu: "Отменить",
    saveSomething: "Сохранить",
    
    printList: "🖨 Вывести список",
    addNewWebsite: "📝 Добавить",
    subsrcibeWebsite: "📥 Подписать",
    unscribeWebsite: "📤 Отписать",
    deleteWebsite: "🗑 Удалить",
}

export const inlineCmd = {
    addNewWebsite: "ANW",
    printAllWebsites: "PrintALL",
    // User
    getUserInfoById: /[0-9]+ GUser/,
    setRole: /[0-9]+ SUser [0-9]+/,
    // List User CRUD
    prevUserPage: /[0-9]+ PUsersPage/,
    nextUserPage: /[0-9]+ NUsersPage/,
    // Website CRUD
    getWebsiteInfoById: /[0-9]+ GWebsite/,
    deleteWebsiteById: /[0-9]+ DeleteWebsite/,
    giveUpWebsiteById: /[0-9]+ GiveUpWebsite/,
    // List
    nextWebsitePage: /[0-9]+ NWebsitePage/,
    prevWebsitePage: /[0-9]+ PWebsitePage/,
    // Subscriptions
    unsubscribeSite: /[0-9]+ unsubscribeSite/,
    subscribeSite: /[0-9]+ subscribeSite/,
    printAuditList: /(\d+\s*)+printList/,
}