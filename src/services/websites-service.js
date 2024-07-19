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