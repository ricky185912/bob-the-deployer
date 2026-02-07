// app/docs/page.tsx
export default function DocsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 space-y-20">

      {/* HEADER */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Bob the Deployer — Documentation (v0.1)
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Bob is an immutable static artifact publisher.
          Every deployment is permanent, addressable, and auditable.
          Not a platform. A deployment primitive.
        </p>
      </section>

      {/* GOLD DIVIDER */}
      <div className="border-b border-amber-500/20 pb-2" />

      {/* FINAL VERDICT */}
      <section className="card bg-zinc-900/50 border border-amber-500/30">
        <h2 className="text-2xl font-semibold mb-4 text-amber-100">
          Bob v0.1 — Final Verdict
        </h2>
        <div className="space-y-4 text-zinc-300">
          <p>
            <strong>Bob v0.1 is not a platform</strong> and not a competitor to Vercel or Netlify.
            It is a <strong>deployment primitive</strong>: a content-addressed, immutable 
            static-site publishing engine that turns deployments into permanent facts 
            instead of mutable states.
          </p>
          <p>
            That's it. And that's enough.
          </p>
          <div className="bg-zinc-800/50 p-4 rounded border border-zinc-700">
            <p className="font-medium text-amber-100 mb-2">Is Bob v0.1 Legit or Just a Portfolio Project?</p>
            <p className="text-green-400">
              <strong>Verdict: Legit foundational product.</strong>
            </p>
            <p className="mt-2">
              Not because it's big — but because it is philosophically coherent, technically 
              disciplined, scope-honest, and invariant-driven.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT IS BOB */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What Bob Is (Core Reality)</h2>
        <p className="text-zinc-400">
          Bob accepts static site artifacts (ZIP files containing HTML, CSS, JS)
          and publishes them as immutable infrastructure.
        </p>
        <ul className="list-disc list-inside text-zinc-400 space-y-2">
          <li>No overwrites — Content-addressed storage</li>
          <li>No mutable "latest" pointer — Explicit deployment records</li>
          <li>No rebuilds — Pure artifact publishing</li>
          <li>No environment drift — SHA256 guarantees identity</li>
        </ul>
      </section>

      {/* WHAT IS NOT */}
      <section className="card bg-red-900/10 border border-red-500/30">
        <h2 className="text-xl font-semibold mb-3 text-red-100">What Bob Is Not</h2>
        <ul className="text-zinc-300 space-y-2">
          <li>• Not a CI/CD platform — No builds, no pipelines</li>
          <li>• Not a framework host — No React/Vue/Next.js awareness</li>
          <li>• Not Git-based deployment — No repositories, no webhooks</li>
          <li>• Not for rapid prototyping — Designed for certainty over speed</li>
        </ul>
      </section>

      {/* DATA FLOW */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Data Flow (Step by Step)</h2>
        <div className="space-y-6">
          <div className="bg-zinc-900/50 p-4 rounded border border-zinc-700">
            <h3 className="font-medium mb-2">Step 1: Upload</h3>
            <pre className="text-sm text-zinc-300">
{`Client → POST /api/artifacts
  - multipart/form-data with ZIP file
  - SHA256 hash precomputed`}
            </pre>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded border border-zinc-700">
            <h3 className="font-medium mb-2">Step 2: Validation & Hashing</h3>
            <pre className="text-sm text-zinc-300">
{`Server validates:
  - ZIP contains index.html at root
  - No forbidden paths
  - Hash matches content

SHA256 hash becomes artifact identity:
  Same ZIP → same hash → same artifact
  Different ZIP → different hash → new artifact`}
            </pre>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded border border-zinc-700">
            <h3 className="font-medium mb-2">Step 3: Artifact Storage</h3>
            <pre className="text-sm text-zinc-300">
{`Files extracted → Supabase Storage
Path: /artifacts/{hash}/{file-path}

Metadata stored in PostgreSQL:
  - Hash (primary key)
  - Size
  - File count
  - Created timestamp`}
            </pre>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded border border-zinc-700">
            <h3 className="font-medium mb-2">Step 4: Deployment Creation</h3>
            <pre className="text-sm text-zinc-300">
{`Client → POST /api/deploy
  - artifactId
  - siteName (e.g., "mysite.bob")

Creates deployment record:
  - Points to artifact
  - Assigns public URL
  - Status: READY

Deployment ≠ Artifact:
  Many deployments → One artifact (deduplication)`}
            </pre>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded border border-zinc-700">
            <h3 className="font-medium mb-2">Step 5: Serving</h3>
            <pre className="text-sm text-zinc-300">
{`Request: GET /{site-name}
  → Looks up deployment
  → Resolves to artifact hash
  → Serves files from immutable storage

HTML files get <base href="/{site-name}/"> injection
Static assets served with immutable cache headers`}
            </pre>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Architecture & Files</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card bg-zinc-900/50">
            <h3 className="font-semibold mb-3">Routes</h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li><code className="bg-zinc-800 px-2 py-1 rounded">/[site]/route.ts</code> — Site serving</li>
              <li><code className="bg-zinc-800 px-2 py-1 rounded">/api/artifacts/route.ts</code> — ZIP processing</li>
              <li><code className="bg-zinc-800 px-2 py-1 rounded">/api/deploy/route.ts</code> — Deployment creation</li>
              <li><code className="bg-zinc-800 px-2 py-1 rounded">/docs/page.tsx</code> — This documentation</li>
            </ul>
          </div>

          <div className="card bg-zinc-900/50">
            <h3 className="font-semibold mb-3">Core Libraries</h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li><strong>Next.js 15</strong> — App Router, Server Components</li>
              <li><strong>PostgreSQL</strong> — Deployment metadata</li>
              <li><strong>Supabase</strong> — Storage & Auth</li>
              <li><strong>adm-zip</strong> — ZIP extraction</li>
              <li><strong>NextAuth.js</strong> — Authentication</li>
            </ul>
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section className="card glow bg-green-900/10 border border-green-500/30">
        <h2 className="text-xl font-semibold mb-3 text-green-100">
          Guarantees & Invariants
        </h2>
        <ul className="text-zinc-300 space-y-2">
          <li>• <strong>URLs never change</strong> — Content-addressing ensures permanence</li>
          <li>• <strong>Artifacts are never mutated</strong> — Immutable storage</li>
          <li>• <strong>Deployments are fully reproducible</strong> — SHA256 determinism</li>
          <li>• <strong>Zero overwrites</strong> — No silent changes</li>
          <li>• <strong>Perfect deduplication</strong> — Same ZIP = same artifact</li>
          <li>• <strong>Cache-perfect</strong> — Immutable = infinite cache TTL</li>
        </ul>
      </section>

      {/* WHO IT'S FOR */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card bg-green-900/10 border border-green-500/30">
          <h2 className="text-xl font-semibold mb-3 text-green-100">Who Bob v0.1 IS For</h2>
          <ul className="text-zinc-300 space-y-2">
            <li>• Agencies shipping static client sites</li>
            <li>• Developers who value certainty over speed</li>
            <li>• Teams burned by rollback bugs</li>
            <li>• People who think in artifacts, not environments</li>
            <li>• Those who need permanent, auditable deployments</li>
          </ul>
        </div>

        <div className="card bg-red-900/10 border border-red-500/30">
          <h2 className="text-xl font-semibold mb-3 text-red-100">Who Bob v0.1 Is NOT For</h2>
          <ul className="text-zinc-300 space-y-2">
            <li>• Beginners needing hand-holding</li>
            <li>• Hackathon projects (too slow)</li>
            <li>• Rapid prototyping (too rigid)</li>
            <li>• Teams optimizing for DX above all else</li>
            <li>• Dynamic applications with builds</li>
          </ul>
        </div>
      </section>

      {/* DEPLOYMENT MODEL */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Deployment Model (By Example)</h2>
        
        <div className="bg-black border border-zinc-800 rounded p-4">
          <pre className="text-sm text-zinc-300">
{`# 1. Prepare your static site
my-site/
  ├── index.html
  ├── styles.css
  └── script.js

# 2. Create ZIP (must contain index.html at root)
zip -r my-site.zip my-site/

# 3. Compute hash (optional, Bob will verify)
sha256sum my-site.zip
# → cd06c2f5413ca4e7611560fcbe464f6677c71f97e5d73446e63fb3394fa2e5db

# 4. Upload through Bob's UI or API
POST /api/artifacts
  Content-Type: multipart/form-data
  zip: my-site.zip
  hash: cd06c2f...

# 5. Create deployment
POST /api/deploy
{
  "url": "my-client-site.bob",
  "artifactId": "79daf7a2-b6c0-41e1-8941-985f30ee309e"
}

# 6. Visit your immutable site
https://bob-deployer.vercel.app/my-client-site`}
          </pre>
        </div>
      </section>

      {/* STRATEGIC VALUE */}
      <section className="card bg-purple-900/10 border border-purple-500/30">
        <h2 className="text-xl font-semibold mb-3 text-purple-100">
          Strategic Value (Beyond Revenue)
        </h2>
        <ul className="text-zinc-300 space-y-2">
          <li>• <strong>Founder-grade credibility</strong> — Deep systems thinking proof</li>
          <li>• <strong>Strong infra narrative</strong> — "The Git of deployments"</li>
          <li>• <strong>Long-term optional startup path</strong> — Built on solid primitives</li>
          <li>• <strong>Powerful personal-brand anchor</strong> — Serious, not flashy</li>
          <li>• <strong>Invariant-first design showcase</strong> — Philosophy over features</li>
        </ul>
      </section>

      {/* FUTURE EVOLUTION */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Future Evolution (Correct Order)</h2>
        
        <div className="space-y-4">
          <div className="card bg-amber-900/10 border border-amber-500/30">
            <h3 className="font-semibold mb-2 text-amber-100">Phase 1 — v0.1 (Current)</h3>
            <p className="text-zinc-300">Prove the invariant works.</p>
            <ul className="text-sm text-zinc-400 mt-2 space-y-1">
              <li>✓ ZIP upload, SHA256 hashing</li>
              <li>✓ Immutable artifact storage</li>
              <li>✓ Deployment pointers, Public URLs</li>
            </ul>
          </div>

          <div className="card bg-blue-900/10 border border-blue-500/30">
            <h3 className="font-semibold mb-2 text-blue-100">Phase 2 — v0.2 (Stability & Trust)</h3>
            <p className="text-zinc-300">Make Bob safe to run unattended.</p>
            <ul className="text-sm text-zinc-400 mt-2 space-y-1">
              <li>→ Auth (single user), Rate limiting</li>
              <li>→ Abuse protection, Basic logs</li>
              <li>→ Soft quotas, Error handling</li>
              <li>❌ Still no builds, no Git, no mutability</li>
            </ul>
          </div>

          <div className="card bg-green-900/10 border border-green-500/30">
            <h3 className="font-semibold mb-2 text-green-100">Phase 3 — v0.3 (Operational Power)</h3>
            <p className="text-zinc-300">Make Bob trustworthy for agencies.</p>
            <ul className="text-sm text-zinc-400 mt-2 space-y-1">
              <li>→ Explicit rollback API</li>
              <li>→ Artifact pinning, Retention policies</li>
              <li>→ Audit timelines, Read-only history</li>
              <li>→ Deployment health checks</li>
            </ul>
          </div>

          <div className="card bg-purple-900/10 border border-purple-500/30">
            <h3 className="font-semibold mb-2 text-purple-100">Phase 4 — v1.0 (Ecosystem)</h3>
            <p className="text-zinc-300">Bob becomes infrastructure, not a UI.</p>
            <ul className="text-sm text-zinc-400 mt-2 space-y-1">
              <li>→ CDN integration, Custom domains</li>
              <li>→ Billing (artifact storage based)</li>
              <li>→ Orgs & teams (still artifact-first)</li>
              <li>→ API-first, CLI tooling</li>
            </ul>
          </div>
        </div>
      </section>

      {/* THE RULE */}
      <section className="card bg-red-900/20 border border-red-500/40">
        <h2 className="text-xl font-semibold mb-3 text-red-100">
          The Single Non-Negotiable Rule of Bob
        </h2>
        <p className="text-xl text-center font-bold text-amber-100 py-4">
          ARTIFACTS ARE IMMUTABLE. ALWAYS.
        </p>
        <p className="text-zinc-300 text-center">
          Every future feature must obey this. If a feature weakens this rule, 
          Bob stops being Bob.
        </p>
      </section>

      {/* BRUTAL ASSESSMENT */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card bg-red-900/10 border border-red-500/30">
          <h2 className="text-xl font-semibold mb-3 text-red-100">Biggest Risks</h2>
          <ul className="text-zinc-300 space-y-2">
            <li>• Trying to appeal to everyone</li>
            <li>• Adding builds too early</li>
            <li>• Chasing DX instead of guarantees</li>
            <li>• Marketing as Vercel replacement</li>
            <li>• Letting ego inflate scope</li>
          </ul>
        </div>

        <div className="card bg-green-900/10 border border-green-500/30">
          <h2 className="text-xl font-semibold mb-3 text-green-100">Biggest Strengths</h2>
          <ul className="text-zinc-300 space-y-2">
            <li>• Philosophical clarity</li>
            <li>• Invariant-first design</li>
            <li>• Refusal to compromise</li>
            <li>• Narrow but deep focus</li>
            <li>• Real, painful problem solved</li>
          </ul>
        </div>
      </section>

      {/* FINAL SUMMARY */}
      <section className="text-center py-8 border-t border-zinc-800">
        <h2 className="text-2xl font-semibold mb-4">Final Founder Verdict</h2>
        <div className="max-w-2xl mx-auto text-zinc-400 space-y-2">
          <p>Bob is <strong className="text-zinc-200">small but serious</strong>.</p>
          <p>Bob is <strong className="text-zinc-200">boring but powerful</strong>.</p>
          <p>Bob is <strong className="text-zinc-200">narrow but deep</strong>.</p>
          <p>Bob is <strong className="text-zinc-200">slow-burn but durable</strong>.</p>
          <p className="mt-6">
            If you stay disciplined, Bob will never embarrass you —
            even if it never becomes huge.
          </p>
          <p className="text-lg font-medium text-amber-100 mt-4">
            And that alone makes it worth building.
          </p>
        </div>
      </section>

    </main>
  );
}