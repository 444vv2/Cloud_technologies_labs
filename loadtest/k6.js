import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE_URL;
const N = Number(__ENV.VUS || 40);
const READS = 9;

export const options = {
  stages: [
    { duration: "2m30s", target: N },
    { duration: "5m", target: N },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

const json = { "Content-Type": "application/json" };

export function setup() {
  const login = http.post(
    `${BASE}/auth/login`,
    JSON.stringify({ email: __ENV.EMAIL, password: __ENV.PASSWORD }),
    { headers: json },
  );
  const token = login.json("accessToken");
  if (!token) throw new Error(`login failed: ${login.status} ${login.body} (password length ${(__ENV.PASSWORD || '').length})`);
  const h = { ...json, Authorization: `Bearer ${token}` };
  const artist = http.post(
    `${BASE}/artists`,
    JSON.stringify({ name: `k6 artist ${Date.now()}` }),
    { headers: h },
  );
  const artistId = artist.json("id");
  if (!artistId) throw new Error(`artist create failed: ${artist.status} ${artist.body}`);
  return { h, artistId };
}

export default function ({ h, artistId }) {
  const created = http.post(
    `${BASE}/songs`,
    JSON.stringify({ title: `k6-${__VU}-${__ITER}`, artistId }),
    { headers: h },
  );
  check(created, { "create 201": (r) => r.status === 201 });
  const songId = created.json("id");

  for (let i = 0; i < READS; i++) {
    const res =
      i % 3 === 0
        ? http.get(`${BASE}/songs`, { headers: h })
        : i % 3 === 1
          ? http.get(`${BASE}/songs/${songId}`, { headers: h })
          : http.get(`${BASE}/artists/${artistId}`, { headers: h });
    check(res, { "read 200": (r) => r.status === 200 });
    sleep(0.3);
  }
}
