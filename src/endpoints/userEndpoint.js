const authorization = (token, id) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'id': id
    },
});

const authEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}/users/auth`;
const favouriteEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}/users/favorite`;
const favouriteStateEndpoint = (content) => `${process.env.REACT_APP_API_GATEWAY_URL}/users/favorite/state?itemId=${content.id}&type=${content.type}`
const listEndpoint = (element) => `${process.env.REACT_APP_API_GATEWAY_URL}/users/list${element ? `?listType=${element.type}&listState=${element.state}&listFavourite=${element.favourite}` : ''}`;
const stateListEndpoint = (content) => `${process.env.REACT_APP_API_GATEWAY_URL}/users/list/state?itemId=${content.id}`
const listRemoveEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}/users/list/remove`
const setProfileImageEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}/users/setProfileImage`
const getProfileImageEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}/users/getProfileImage`

export {
    authEndpoint, 
    favouriteEndpoint,
    listEndpoint,
    listRemoveEndpoint,
    authorization,
    favouriteStateEndpoint,
    stateListEndpoint,
    setProfileImageEndpoint,
    getProfileImageEndpoint
};