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
  // 201 = sync write, 202 = queued (ASYNC_WRITES=true)
  check(created, { "create 201/202": (r) => r.status === 201 || r.status === 202 });
  const songId = created.json("id");
  const queued = created.status === 202;

  for (let i = 0; i < READS; i++) {
    const res =
      i % 3 === 0
        ? http.get(`${BASE}/songs`, { headers: h })
        : i % 3 === 1
          ? // a queued song may not be written yet: 404 is expected, not an error
            http.get(`${BASE}/songs/${songId}`, {
              headers: h,
              responseCallback: http.expectedStatuses(200, queued ? 404 : 200),
            })
          : http.get(`${BASE}/artists/${artistId}`, { headers: h });
    check(res, { "read ok": (r) => r.status === 200 || (queued && r.status === 404) });
    sleep(0.3);
  }
}
