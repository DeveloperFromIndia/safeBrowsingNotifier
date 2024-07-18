import axios from "axios"

const API_KEY = process.env.GOOGLE_API_KEY;
const URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + API_KEY;

const checkUrlSafety = async (url) => {
    const requestBody = {
        client: {
            clientId: 'test',
            clientVersion: '1a'
        },
        threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [
                { url: url }
            ]
        }
    };

    try {
        const response = await axios.post(URL, requestBody);
        if (response.data.matches) {
            console.log('Threats found:', response.data.matches);
        } else {
            console.log('No threats found.');
        }
    } catch (error) {
        console.error('Error checking URL:', error);
    }
};

checkUrlSafety(urlToCheck);