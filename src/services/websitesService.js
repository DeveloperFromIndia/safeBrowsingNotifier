import SiteModel from "../database/models/Other/site.js";
import { Op, Sequelize } from 'sequelize';
import { sendMessageToUser } from "../bot.js";
import { cmd } from "../utils/cmd.js";
import domainService from "./domainService.js";
import checkUrlSafety from "./googleSafeBrowsing.js";

class WebsitesService {
    getWebsiteSign = (alive) => {
        let sign = "";
        switch (alive) {
            case true:
                sign = "✅"
                break
            case false:
                sign = "❌"
                break
            case null:
                sign = "⏳"
        }
        return sign;
    }
    addWebsite = async (url, telegramId) => {
        const itemWithSameUrl = await SiteModel.findOne({ where: { url } });
        if (itemWithSameUrl)
            return null;

        const newItem = await SiteModel.create({ url, telegramId });
        return newItem;
    }
    getWebsiteById = async (id) => {
        try {
            const website = await SiteModel.findOne({ where: { id } });
            return website;
        } catch (error) {
            console.error(error);
        }
    }
    deleteWebsiteById = async (id, telegramId) => {
        try {
            const website = await SiteModel.findOne({ where: { id: id } });
            if (!website)
                return null;

            if (website.telegramId == telegramId || website.telegramId == null) {
                await website.destroy();
                return true;
            }
            
            return null;
        } catch (error) {
            throw error;
        }
    }
    getWebsitesByPage = async (currentPage, count, telegramId) => {
        try {
            const offset = (currentPage - 1) * count;
            const totalWebsites = await SiteModel.count({
                where: {
                    [Op.or]: [
                        { telegramId: telegramId },
                        { telegramId: null }
                    ]
                }
            });
            const totalPages = Math.ceil(totalWebsites / count);

            const websites = await SiteModel.findAll({
                offset,
                limit: count,
                order: [
                    [Sequelize.literal('CASE WHEN "telegramId" = :telegramId THEN 0 ELSE 1 END'), 'ASC'],
                    [Sequelize.literal('CASE WHEN "isAlive" IS NULL THEN 0 WHEN "isAlive" = true THEN 1 ELSE 2 END'), 'ASC'],
                    ['id', 'DESC']
                ],
                where: {
                    [Op.or]: [
                        { telegramId: telegramId },
                        { telegramId: null }
                    ]
                },
                replacements: { telegramId: telegramId } // Подставляем заданный telegramId в запрос
            });
            return {
                totalPages,
                currentPage,
                websites,
            }
        } catch (error) {
            console.error(error);
        }
    }
    getTotalInfo = async (telegramId) => {
        try {
            const active = await SiteModel.count({ where: { isAlive: true, telegramId } });
            const unacitve = await SiteModel.count({ where: { isAlive: false, telegramId } });
            const underInspection = await SiteModel.count({ where: { isAlive: null, telegramId } });
            const total = await SiteModel.count({ where: { telegramId } });

            return `📁 Всего доменов: ${total}\n\n✅ Активные: ${active}\n❌ Отбракованные: ${unacitve}\n⏳ Не проверенные: ${underInspection}`;
        } catch (error) {
            console.error(error);
        }
    }
    toggleSubscription = async (id, telegramId) => {
        try {
            const website = await SiteModel.findOne({ where: { id } })
            if (!website)
                return null;

            if (website.telegramId && website.telegramId != telegramId)
                return null;

            website.telegramId = website.telegramId == telegramId ? null : telegramId;

            await website.save();
            return website;
        } catch (error) {
            console.error(error)
        }
    }
    conductAudit = async () => {
        try {
            const sites = await SiteModel.findAll({
                where: {
                    isAlive: {
                        [Op.or]: [true, null]
                    }
                }
            });

            let counter = 0;
            let unactiveWebsites = [];
            for (const item of sites) {
                // dev
                // const result_dns = false;
                // const result = true;
                const result_dns = await domainService.dnsCheckStatus(item.url);
                const result = await checkUrlSafety(item.url);

                if (!result && result_dns) {
                    item.isAlive = true;
                } else {
                    counter++;
                    let err = ``;
                    if (!result_dns) {
                        err = `- Ошибка DNS\n`;
                    }
                    if (result) {
                        err += "- Заблокирован поисковой системой\n";
                    }

                    unactiveWebsites.push({ id: item.id, url: item.url, err, telegramId: item.telegramId });
                    item.isAlive = false;
                    item.cause = err;
                }
                await item.save();
            }

            if (counter == 0)
                return null;

            const filteredWebsites = Object.values(unactiveWebsites.reduce((acc, { id, url, telegramId, err }) => {
                if (!acc[telegramId]) {
                    acc[telegramId] = { telegramId, urls: [] };
                }
                acc[telegramId].urls.push({ id, url, err });
                return acc;
            }, {}))

            filteredWebsites.forEach(async scope => {
                if (scope.telegramId) {
                    const list = scope.urls.map(item => item.id).join(' ');

                    await sendMessageToUser({
                        chatId: scope.telegramId,
                        message: `❌ В результате аудита ${scope.urls.length} домен(ов) отбраковано.\n\n${scope.urls.map(item => `${item.url}\n${item.err}`).join('')}`,
                        options: {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: cmd.printList, callback_data: `${list} printList` }]
                                ]
                            }
                        }
                    });
                }
            })

        } catch (error) {
            console.error(error);
        }
    };
}

export default new WebsitesService;