const authorization = (token, id) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'id': id
    },
});

const authEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}/users/auth`;
const favoriteEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}/users/favorite`;
const favoriteStateEndpoint = (content) => `${process.env.REACT_APP_API_GATEWAY_URL}/users/favorite/state?itemId=${content.id}&type=${content.type}`
const listEndpoint = (id) => `${process.env.REACT_APP_API_GATEWAY_URL}/users/list${id ? `?listId=${id}` : ''}`;
const favoriteListEndpoint = (content) => `${process.env.REACT_APP_API_GATEWAY_URL}/users/list/state?itemId=${content.id}&type=${content.type}`
const listRemoveEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}/users/list/remove`

export {
    authEndpoint, 
    favoriteEndpoint,
    listEndpoint,
    listRemoveEndpoint,
    authorization,
    favoriteStateEndpoint,
    favoriteListEndpoint
};