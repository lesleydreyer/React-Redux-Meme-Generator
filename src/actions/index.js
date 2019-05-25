import { username, password } from './secrets';

export const RECEIVE_MEMES = 'RECEIVE_MEMES';
export const NEW_MEME = 'NEW_MEME';

//regular action creator function, receives some json data and returns action object
function receiveMemes(json) {
    const { memes } = json.data;
    return {
        type: RECEIVE_MEMES,
        memes
    }
}

//performs fetch and returns response.json
function fetchMemesJson() {
    return fetch('https://api.imgflip.com/get_memes')
        .then(response => response.json())//grab json then handle it
}

//returns an inner function itself that has its own dispatch function to allow to
//dispatch to receive json at any moment and handle acyn behavior of api. W/dispatch 
//function you grap the returned json from fechmemesjson and use regular recievememes
//function to return object type and finally returned recieved memes for application to use
export function fetchMemes() {
    return function (dispatch) {
        return fetchMemesJson()
            .then(json => dispatch(receiveMemes(json)))
    }
}

function newMeme(meme) {
    return {
        type: NEW_MEME,
        meme
    }
}


//kinda like fetchMemes
function postMemeJson(params) {
    params['username'] = username;
    params['password'] = password;
    const bodyParams = Object.keys(params).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&');
    console.log('bodyparams', bodyParams);
    return fetch('https://api.imgflip.com/caption_image', {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams
    }).then(response => response.json());
}

export function createMeme(new_meme_object) {
    return function (dispatch) {
        return postMemeJson(new_meme_object)
            .then(new_meme => dispatch(newMeme(new_meme)))
    }
}