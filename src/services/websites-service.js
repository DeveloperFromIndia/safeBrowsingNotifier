import SiteModel from "../database/models/Other/site.js";
import { Op } from 'sequelize';
import checkUrlSafety from "./googleSafeBrowsing.js";
import userService from "./user-service.js";

class WebsitesService {
    addWebsite = async (url) => {
        const itemWithSameUrl = await SiteModel.findOne({ where: { url } });
        if (itemWithSameUrl) {
            return null;
        } else {
            const newItem = await SiteModel.create({ url });
            return newItem;
        }
    }
    getWebsiteById = async (id) => {
        try {
            const website = await SiteModel.findOne({ where: { id: id } });
            return website;
        } catch (error) {
            console.error(error);
        }
    }
    deleteWebsiteById = async (id) => {
        try {
            const website = await SiteModel.findOne({ where: { id: id } });
            if (website) {
                await website.destroy();
                return true;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
    getWebsitesByPage = async (currentPage, count) => {
        try {
            const offset = (currentPage - 1) * count;
            const totalWebsites = await SiteModel.count();
            const totalPages = Math.ceil(totalWebsites / count);
            const websites = await SiteModel.findAll({
                offset,
                limit: count,
                order: [['id', 'DESC']]
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
    getTotalInfo = async () => {
        try {
            const active = await SiteModel.count({ where: { isAlive: true } });
            const b = await SiteModel.count({ where: { isAlive: false } });
            const c = await SiteModel.count({ where: { isAlive: null } });

            return `✅ Активные: ${active}\n❌ Забаненные: ${b}\n⏳ Не проверенные: ${c}`;
        } catch (error) {
            console.error(error);
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
                const result = await checkUrlSafety(item.url);
                if (!result) {
                    item.isAlive = true;
                } else {
                    counter++;
                    unactiveWebsites.push(item.url);
                    item.isAlive = false;
                }
                await item.save();
            }

            if (counter > 0) {
                const text = `❌ Забанено ${counter} доменов.\n${unactiveWebsites.map(item => "\n" + item)}`
                userService.notifyAllUsers(text);
            }
        } catch (error) {
            console.error(error);
        }
    };
}

export default new WebsitesService;