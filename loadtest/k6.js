import http from "k6/http";
import { check, sleep } from "k6";
import process from "process";

const BASE = process.env.BASE_URL;
const N = Number(process.env.VUS || 40);
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
    JSON.stringify({
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    }),
    { headers: json },
  );
  const token = login.json("accessToken");
  if (!token) throw new Error(`login failed: ${login.status} ${login.body}`);
  const h = { ...json, Authorization: `Bearer ${token}` };
  const artist = http.post(
    `${BASE}/artists`,
    JSON.stringify({ name: "k6 artist" }),
    { headers: h },
  );
  return { h, artistId: artist.json("id") };
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
