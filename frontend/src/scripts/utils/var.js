export function getHostname() {
  return "localhost";
}

export function getDjangoPort() {
  return "2344";
}

export function getServerHost() {
  return "http://" + getHostname() + ":" + getDjangoPort();
}

export function getSocialTypeName(type) {
  if (type == 0) return "FortyTwo";
  else if (type == 1) return "Google";
  else if (type == 2) return "Github";
  else if (type == 3) return "Naver";
  else if (type == 4) return "Kakao";
  else return "unknown";
}
