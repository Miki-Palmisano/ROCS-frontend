const genreEndpoint = (type) => `${process.env.REACT_APP_API_GATEWAY_URL}${type}/genres`;
const providerEndpoint = (type) => `${process.env.REACT_APP_API_GATEWAY_URL}${type}/providers`;
const queryEndpoint = (type, queryString) => `${process.env.REACT_APP_API_GATEWAY_URL}${type}${queryString}`;
const searchEndpoint = (type, keywords) => `${process.env.REACT_APP_API_GATEWAY_URL}${type}/search?keywords=${keywords}`;
const allSearchEndpoint = (queryString) => `${process.env.REACT_APP_API_GATEWAY_URL}/all/search${queryString}`;
const allPopularEndpoint = (queryString) => `${process.env.REACT_APP_API_GATEWAY_URL}/all/popular${queryString}`;
const infoEndpoint = (content) => `${process.env.REACT_APP_API_GATEWAY_URL}/${content.type}/info/${content.id}`;
const getListEndpoint = (type) => `${process.env.REACT_APP_API_GATEWAY_URL}${type}`;

export {
    genreEndpoint,
    providerEndpoint,
    queryEndpoint,
    searchEndpoint,
    allSearchEndpoint,
    allPopularEndpoint,
    infoEndpoint,
    getListEndpoint
};