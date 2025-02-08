export const cmd = {
    main: "💾 Стастистика",
    websites: "📁 Домены",
    // utils buttons
    backInMainMenu: "Отменить",
    saveSomething: "Сохранить",
    
    printList: "🖨 Вывести список",
    addNewWebsite: "📝 Добавить",
    subsrcibeWebsite: "📥 Подписать",
    unscribeWebsite: "📤 Отписать",
    deleteWebsite: "🗑 Удалить"
}

export const inlineCmd = {
    addNewWebsite: "ANW",
    printAllWebsites: "PrintALL",
    // CRUD
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