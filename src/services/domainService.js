import axios from "axios";

class DomainService {

    async dnsCheckStatus(domain) {
        try {
            const url = domain.includes('https://') ? domain :'https://' + domain; 
            const response = await axios.get(url);
            return true;
        } catch (error) {
            if (error.response) {
                // console.log(`${domain} returned HTTP status code:`, error.response.status);
                return true;
            } else if (error.code === 'EAI_AGAIN') {
                return false;
                // console.log(`${domain} has DNS issues (EAI_AGAIN). Could not resolve.`);
            } else if (error.code === 'ENOTFOUND') {
                return false;
                // console.log(`${domain} domain could not be found (ENOTFOUND).`);
            } else if (error.code === 'ECONNREFUSED') {
                return false;
                // console.log(`${domain} refused the connection (ECONNREFUSED).`);
            } 
        }
    }
}

export default new DomainService;