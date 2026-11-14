# Production security activation plan — held at safe boundary

Stage 2 authorizes targeted controls only after their scope and safety are verified. The current prepared spec is production-rate-limit.proposed.json. It is not an importable Vercel API payload and has not been applied.

The public hostname points at a Preview/branch deployment, so environment=production alone misses the verified live mapping. The revised spec uses exact host studio.shashwataneja.com AND method POST AND path /api/booking-request. No rule should affect unrelated hosts/paths or GET/OPTIONS. Existing preview enforcement may overlap and must be assessed before insertion.

Current control evidence, activation gates, observation/false-positive review, rollback procedure, HSTS dependency and monitoring/incident gaps are in [Stage 2 controls](stage-2-controls-and-incidents.md). Safety cannot presently be established because Cloudflare proxy/client-IP settings and representative traffic were not verified, and final protected application responses were not inspected. No active provider settings were changed. Local max-age=86400 HSTS will require a later authorized, isolated application/header release; it is not live enforcement.

The original feature branch suppresses Git deployment in vercel.json, but the new working branch is not suppressed. Do not push it: branch defaults may trigger deployment and the earlier manual deployment reassigned the public domain unexpectedly. Never treat target Preview or Git suppression as sufficient proof of alias isolation. A future isolated test environment must have no public branch-domain assignment, with before/after alias read-back and recorded recovery deployment. No main merge, Pages migration, DNS change or application release is part of Stage 2.
