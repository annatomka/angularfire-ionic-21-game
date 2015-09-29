angular.module('starter.services', [])

    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })
    .factory('RootRef', function(){
        return new Firebase("https://21game.firebaseio.com");
    })
    .factory('AuthFactory',function(RootRef){



        function authDataCallback(authData) {
            var isNewUser = true;

            if(RootRef.child("users").child(authData.uid))
                isNewUser = false;

            if (authData && isNewUser) {
                // save the user's profile into the database so we can list users,
                // use them in Security and Firebase Rules, and show profiles
                RootRef.child("users").child(authData.uid).set({
                    provider: authData.provider,
                    name: getName(authData),
                    avatar: getProfileImage(authData)
                });
            }
        }

        // find a suitable name based on the meta info given by each provider
        function getName(authData) {
            switch(authData.provider) {
                case 'google':
                    return authData.google.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
            }
        }

        function getProfileImage(authData){
            switch(authData.provider) {
                case 'google':
                    return authData.google.profileImageURL;
                case 'facebook':
                    return authData.facebook.profileImageURL;
            }
        }

        RootRef.onAuth(authDataCallback);

        return {
            login: function(provider){
                RootRef.authWithOAuthPopup(provider, function(error, authData) {
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        console.log("Authenticated successfully with payload:", authData);
                    }
                });
            }

        };
    });
