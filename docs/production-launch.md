# Studio launch gates

Follow [booking operations](booking-workflow.md), [legal matrix](legal-compliance-matrix.md), [security findings](security-audit.md), [privacy operations](privacy-operations.md) and [proposed production controls](security/production-security-plan.md). These identify unresolved decisions and evidence; they do not certify launch readiness.

No production deployment or WAF/DNS enforcement change is authorized by this audit. Keep previews isolated from the branch-linked public domain. Payments and dashboard endpoints remain disabled; do not apply historical Supabase migrations. Configure a restricted sending key/verified sender in the intended environment only after approval, verify both transactional messages and provisional PDFs, and complete the outstanding business address, grievance, retention, supplier/access and applicable incident/log obligations before public launch.
