import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL(
    "../src/layouts/full/vertical-header/VerticalHeader.vue",
    import.meta.url,
  ),
  "utf8",
);
const methods = ["checkUpdate", "getReleases"]
  .map((name) => {
    const match = source.match(
      new RegExp(`function ${name}\\(\\) \\{[\\s\\S]*?\\n\\}`, "m"),
    );
    assert.ok(match, `Missing header method: ${name}`);
    return match[0];
  })
  .join("\n");

function createHeaderHarness(overrides = {}) {
  const refs = Object.fromEntries(
    [
      "updateStatus",
      "updateError",
      "releasesError",
      "hasNewVersion",
      "dashboardHasNewVersion",
      "releaseMessage",
      "isDesktopReleaseMode",
      "releases",
      "releasesLoading",
    ].map((key) => [key, { value: key === "releases" ? [] : "" }]),
  );
  const context = {
    ...refs,
    updatesApi: {
      check: async () => ({
        data: {
          status: "success",
          message: "Latest",
          data: { has_new_version: false },
        },
      }),
      releases: async () => ({ data: { status: "ok", data: [] } }),
      ...overrides,
    },
    t: (key) => key,
    authStore: {
      logout() {
        context.loggedOut = true;
      },
    },
    console: { log() {} },
  };
  const compiled = ts.transpileModule(methods, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const functions = new Function(
    ...Object.keys(context),
    `${compiled}; return { checkUpdate, getReleases };`,
  )(...Object.values(context));
  return { ...context, ...functions };
}

test("a successful latest-version check displays a localized status", async () => {
  const header = createHeaderHarness();
  await header.checkUpdate();
  assert.equal(header.hasNewVersion.value, false);
  assert.equal(header.updateStatus.value, "core.header.updateDialog.status.upToDate");
  assert.equal(header.updateError.value, "");
});

test("a newer release retains its notes and update indicators", async () => {
  const header = createHeaderHarness({
    check: async () => ({
      data: {
        status: "success",
        message: "Release notes",
        data: { has_new_version: true, dashboard_has_new_version: true },
      },
    }),
  });
  await header.checkUpdate();
  assert.equal(header.hasNewVersion.value, true);
  assert.equal(header.dashboardHasNewVersion.value, true);
  assert.equal(header.releaseMessage.value, "Release notes");
});

test("an HTTP 200 error envelope with null data shows a localized failure", async () => {
  const header = createHeaderHarness({
    check: async () => ({
      data: {
        status: "error",
        data: null,
        message: "Unable to fetch releases",
      },
    }),
  });
  header.hasNewVersion.value = true;
  await header.checkUpdate();
  assert.equal(header.hasNewVersion.value, false);
  assert.equal(
    header.updateStatus.value,
    "core.header.updateDialog.status.checkFailed",
  );
  assert.equal(
    header.updateError.value,
    "core.header.updateDialog.status.sourceUnavailable",
  );
  assert.doesNotMatch(header.updateStatus.value, /TypeError/);
});

test("malformed update data and network failures remain retryable", async () => {
  for (const check of [
    async () => ({ data: { status: "ok", data: {} } }),
    async () => {
      throw new Error("Network unavailable");
    },
  ]) {
    const header = createHeaderHarness({ check });
    await header.checkUpdate();
    assert.ok(header.updateError.value);
    header.updatesApi.check = async () => ({
      data: {
        status: "success",
        message: "Latest",
        data: { has_new_version: false },
      },
    });
    await header.checkUpdate();
    assert.equal(header.updateError.value, "");
    assert.equal(header.updateStatus.value, "core.header.updateDialog.status.upToDate");
  }
});

test("desktop-managed installs ignore core and WebUI update indicators", async () => {
  const header = createHeaderHarness({
    check: async () => ({
      data: {
        status: "success",
        data: { has_new_version: true, dashboard_has_new_version: true },
      },
    }),
  });
  header.isDesktopReleaseMode.value = true;
  await header.checkUpdate();
  assert.equal(header.hasNewVersion.value, false);
  assert.equal(header.dashboardHasNewVersion.value, false);
});

test("release-list errors clear stale rows and leave loading state", async () => {
  const header = createHeaderHarness({
    releases: async () => ({
      data: {
        status: "error",
        data: null,
      },
    }),
  });
  header.releases.value = [{ tag_name: "v0.0.0" }];
  await header.getReleases();
  assert.deepEqual(header.releases.value, []);
  assert.equal(header.releasesLoading.value, false);
  assert.equal(
    header.releasesError.value,
    "core.header.updateDialog.status.releasesFailed",
  );
});

test("release-list success preserves source data and clears the error", async () => {
  const release = {
    tag_name: "v4.29.3",
    published_at: "2026-10-30T18:13:51Z",
    body: "Notes",
  };
  const header = createHeaderHarness({
    releases: async () => ({
      data: {
        status: "ok",
        data: [release],
      },
    }),
  });
  header.releasesError.value = "Previous error";
  await header.getReleases();
  assert.equal(header.releasesError.value, "");
  assert.equal(header.releases.value[0].tag_name, "v4.29.3");
  assert.equal(release.published_at, "2026-10-30T18:13:51Z");
});
