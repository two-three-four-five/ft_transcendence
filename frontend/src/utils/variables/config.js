const HOSTNAME = "localhost";
const DJANGO_PORT = "2344";
const DOMAIN = `${HOSTNAME}:${DJANGO_PORT}`;

const API_CONFIG = {
  HOSTNAME,
  DJANGO_PORT,
  DOMAIN,
  BASE_URL: `http://${DOMAIN}`,
  ENDPOINT: {
    OAUTH: {
      FT: "v1/auth/oauth/ft",
      GOOGLE: "v1/auth/oauth/google",
      NAVER: "v1/auth/oauth/naver",
      KAKAO: "v1/auth/oauth/kakao",
    },
    TOKEN: {
      VERIFY: "v1/auth/token/verify/",
      REFRESH: "v1/auth/token/refresh/",
    },
    FRIENDS: "v1/friends/",
    FRIENDS_REQUESTS: "v1/friends/requests/",
    CHATS: "v1/chats/",
    CHATROOMS: "v1/chatrooms/",
  },
};

export { API_CONFIG };
