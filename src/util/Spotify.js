// const clientID = 'a9caee5f79874b0b9882ac7a0061ddab';
// const redirectURI = 'http://simmojammming.surge.sh';
const clientID = '0209a27dbd984e88b748082bf8ff7572';
const redirectURI = 'http://localhost:3000';

let accessToken;
let expiresIn;

let apiURL = 'https://api.spotify.com/v1';

const Spotify = {

    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }
        let findAccessToken = window.location.href.match(/access_token=([^&]*)/);
        let findExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (findAccessToken && findExpiresIn) {
            accessToken = findAccessToken[1];
            expiresIn = findExpiresIn[1];
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    search(term) {
        if (!accessToken) {
          Spotify.getAccessToken();
        }
        return fetch(`${apiURL}/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(
            response => {return response.json();
        }).then(
            jsonResponse => {
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
            }));
        });
    },

    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs.length) {
            return;
        }
        if (!accessToken) {
          Spotify.getAccessToken();
        }
        return fetch(`${apiURL}/me`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(
            response => {return response.json();
        }).then(
            jsonResponse => {
                let userID = jsonResponse.id;
                return fetch(`${apiURL}/users/${userID}/playlists`, {
                    headers: {Authorization: `Bearer ${accessToken}`},
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                }).then(
                    response => {return response.json();
                }).then(
                    jsonResponse => {
                        let playlistID = jsonResponse.id;
                        return fetch(`${apiURL}/users/${userID}/playlists/${playlistID}/tracks`, {
                            headers: {Authorization: `Bearer ${accessToken}`},
                            method: 'POST',
                            body: JSON.stringify({uris: trackURIs})
                        });
                    });
            });
    }
}

export default Spotify;
