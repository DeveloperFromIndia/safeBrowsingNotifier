import SiteModel from "../database/models/Other/site.js";

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
}

export default new WebsitesService;