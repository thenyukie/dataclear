/* DataClear demo — stage data. 14 linear stages, one scripted path. */
const STAGES = [
{
  id:"intake", n:1, title:"Intake",
  chips:["Submit for evaluation"],
  expected:["submit","evaluation","send","go","yes"],
  chat:[
    {who:"user", name:"Priya (HR Ops)", text:"We're planning a global employee benefits portal. It would hold employee IDs, salary bands, dependents and health-plan enrollment choices, administered by a US vendor."},
    {who:"bot", text:"Thanks Priya. I've captured your use case and structured it for evaluation. Nothing is decided yet — I'll check it stage by stage, and every verdict will point to the rule that produced it."},
    {who:"bot", text:"Summary → purpose: benefits administration · data: employee ID, salary band, dependents, health enrollment · systems: new portal + external vendor (US) · scope: all employees. Ready to submit?"}
  ],
  trace:[
    {label:"Parse submission", detail:"Free text → structured use case (9 fields)", cite:"intake.schema.v2"},
    {label:"Classify purpose", detail:"purpose = BENEFITS_ADMIN", cite:"taxonomy.purpose.07"},
    {label:"Extract data categories", detail:"[employee_id, salary_band, dependents, health_enrollment]", cite:"taxonomy.data.03/11"},
    {label:"Detect cross-border element", detail:"vendor region = US → transfer flag SET", cite:"transfer.detect.01"}
  ],
  artifacts:[{icon:"📋", title:"Intake form UC-2026-0148", status:"DRAFT", lines:["Requester: Priya Sharma (HR Operations)","Purpose: benefits administration","Data: employee ID · salary band · dependents · health enrollment","Vendor: Northgate Benefits Inc. (US)","Employees in scope: ~4,100 (all entities)"]}],
  people:[{name:"Priya Sharma", role:"Business requester · HR Ops", action:"submitted the use case"}],
  systems:[{name:"Intake API", action:"structured submission", status:"OK"}]
},
{
  id:"enrichment", n:2, title:"Enrichment",
  chips:["Confirm enriched data"],
  expected:["confirm","enrich","ok","yes","looks good"],
  chat:[
    {who:"bot", text:"Enriching your case from golden sources — I'll pull authoritative data rather than ask you to re-type it."},
    {who:"bot", text:"Found: your entity (DCBA Holdings → 6 subsidiaries), HRIS employee count 4,118, vendor Northgate already in Supplier Registry with DPA status: SIGNED (2025)."}
  ],
  trace:[
    {label:"Entity lookup", detail:"DCBA Holdings Plc + 6 subsidiaries resolved", cite:"golden.entity-register"},
    {label:"Population check", detail:"HRIS → 4,118 active employees across 7 countries", cite:"golden.hris"},
    {label:"Vendor registry", detail:"Northgate Benefits Inc. · DPA signed 2025-03-11 · no SCCs on file", cite:"golden.supplier-registry"},
    {label:"Gap flagged", detail:"No transfer mechanism for US vendor → carried to transfer stage", cite:"gap.transfer-mechanism"}
  ],
  artifacts:[{icon:"🔎", title:"Enrichment report", status:"COMPLETE", lines:["Entities: 7 (HQ + 6 subsidiaries)","Employees: 4,118 (golden HRIS, synced 09-24 06:00 UTC)","Vendor: Northgate Benefits Inc. — DPA ✓ · SCCs ✗","Open gaps: 1 (transfer mechanism)"]}],
  people:[{name:"System", role:"Automated enrichment", action:"queried 3 golden sources"}],
  systems:[
    {name:"Entity Register", action:"GET /entities?q=DCBA", status:"OK"},
    {name:"HRIS", action:"GET /headcount?active=true", status:"OK"},
    {name:"Supplier Registry", action:"GET /vendors/northgate", status:"OK"}
  ]
},
{
  id:"dedup", n:3, title:"Dedup / case matching",
  chips:["Proceed as new case"],
  expected:["proceed","new case","continue","yes","ok"],
  chat:[
    {who:"bot", text:"Checking 2,317 existing cases for overlap before creating anything new."},
    {who:"bot", text:"One related case: UC-2024-0090 (US payroll processing, 2024). 42% field overlap — same vendor, different purpose and data set. Recommendation: new case, linked to UC-2024-0090 for vendor context."}
  ],
  trace:[
    {label:"Similarity scan", detail:"2,317 cases · embedding + rule match", cite:"dedup.engine.v3"},
    {label:"Candidate found", detail:"UC-2024-0090 · overlap 42% (threshold 75% for merge)", cite:"dedup.threshold.75"},
    {label:"Decision", detail:"NO_MERGE → new case UC-2026-0148, link to UC-2024-0090", cite:"dedup.rule.link-not-merge"}
  ],
  artifacts:[{icon:"🧬", title:"Match report", status:"NO MERGE", lines:["Scanned: 2,317 closed/open cases","UC-2024-0090 — payroll (US) · overlap 42%","Reason: same vendor, different purpose + data categories","Action: cross-link for vendor history"]}],
  people:[{name:"System", role:"Automated dedup engine", action:"matched & linked cases"}],
  systems:[{name:"Case Store", action:"similarity scan (2,317)", status:"OK"}]
},
{
  id:"ropa", n:4, title:"RoPA creation",
  chips:["Continue"],
  expected:["continue","ok","next","yes"],
  chat:[
    {who:"bot", text:"Record of Processing (Art. 30) drafted from your case + enrichment. I pre-filled processing purposes, categories, recipients and transfers — you'd normally review this with your privacy team."},
    {who:"bot", text:"RoPA entry R-0812 created in DRAFT and attached to the case."}
  ],
  trace:[
    {label:"Controller/processor roles", detail:"DCBA = controller · Northgate = processor", cite:"gdpr.art.30"},
    {label:"Draft entry", detail:"R-0812 · purposes, categories, recipients, retention pre-filled", cite:"ropa.template.v4"},
    {label:"Retention proposal", detail:"24 months post-employment (policy RET-EMP-02)", cite:"policy.retention"}
  ],
  artifacts:[{icon:"🗂️", title:"RoPA entry R-0812", status:"DRAFT", lines:["Controller: DCBA Holdings Plc · Processor: Northgate Benefits Inc.","Purpose: benefits administration","Categories: identity · employment · salary band · dependents · health","Transfers: EEA → US (vendor)","Retention: 24 months post-employment"]}],
  people:[{name:"System", role:"Automated RoPA builder", action:"drafted Art. 30 record"}],
  systems:[{name:"RoPA Register", action:"POST /ropa (draft)", status:"OK"}]
},
{
  id:"notice", n:5, title:"Privacy notice check",
  chips:["Approve notice update"],
  expected:["approve","update","notice","yes","ok"],
  chat:[
    {who:"bot", text:"Checking the employee privacy notice against what this use case actually does. Two gaps found: health-plan enrollment data is not listed, and international transfers are described generically."},
    {who:"bot", text:"I've drafted the amendments. Notice stays in draft until the case completes — nothing is published without sign-off."}
  ],
  trace:[
    {label:"Notice coverage check", detail:"notice v9.2 vs use-case data map", cite:"notice.check.v2"},
    {label:"Gap 1", detail:"health enrollment not enumerated → add §3.4", cite:"gdpr.art.13(1)(d)"},
    {label:"Gap 2", detail:"US transfer described generically → specify recipient + mechanism", cite:"gdpr.art.13(1)(f)"},
    {label:"Draft amendment", detail:"notice v9.3-draft prepared", cite:"notice.draft.v1"}
  ],
  artifacts:[{icon:"📄", title:"Employee notice v9.3 (draft)", status:"2 GAPS FIXED", lines:["+ §3.4 health-plan enrollment data (categories)","+ §7.2 transfer: Northgate Benefits Inc. (US), SCCs + TIA reference","Publish gate: requires case completion + DPO view"]}],
  people:[{name:"System", role:"Automated notice checker", action:"diffed notice vs data map"}],
  systems:[{name:"Notice Library", action:"GET /notices/employee/v9.2", status:"OK"}]
},
{
  id:"risk", n:6, title:"Risk scoring",
  chips:["Accept risk outcome"],
  expected:["accept","risk","ok","yes","continue"],
  chat:[
    {who:"bot", text:"Scoring risk to decide assessment depth. Drivers: health data (special category) + all employees + external processor + transfer. Score: 16/25 → HIGH."},
    {who:"bot", text:"HIGH routes this to a full data privacy impact analysis rather than a light-touch PIA. That's a rule outcome, not a judgment call."}
  ],
  trace:[
    {label:"Factor: special category", detail:"health enrollment → +6", cite:"risk.factor.special"},
    {label:"Factor: population", detail:"all employees, 7 countries → +4", cite:"risk.factor.scale"},
    {label:"Factor: external processor", detail:"vendor beyond EEA → +3", cite:"risk.factor.processor"},
    {label:"Factor: transfer", detail:"EEA→US, no SCCs → +3", cite:"risk.factor.transfer"},
    {label:"Aggregate", detail:"16/25 → HIGH → full DPIA required", cite:"risk.matrix.v5 · ≥14 ⇒ DPIA"}
  ],
  artifacts:[{icon:"🌡️", title:"Risk scorecard UC-2026-0148", status:"HIGH 16/25", lines:["Special category: 6/8","Scale: 4/6","External processor: 3/5","Transfer: 3/6","Threshold ≥14 ⇒ full data privacy impact analysis"]}],
  people:[{name:"System", role:"Automated risk engine", action:"scored case"}],
  systems:[{name:"Risk Engine", action:"evaluate(matrix.v5)", status:"OK"}]
},
{
  id:"pia", n:7, title:"Privacy impact assessment",
  chips:["Proceed to full analysis"],
  expected:["proceed","continue","yes","ok","next"],
  chat:[
    {who:"bot", text:"Running the standard privacy impact assessment — the screening layer. It confirms what the risk score predicted: this case cannot close at PIA level."},
    {who:"bot", text:"PIA outcome: ESCALATE. Mandatory grounds: special-category data at scale. The full data privacy impact analysis is now required, not optional."}
  ],
  trace:[
    {label:"Screening questions", detail:"8/8 answered from case data (no human input needed)", cite:"pia.screen.v3"},
    {label:"Mandatory ground met", detail:"special-category data at scale", cite:"pia.escalation.grounds"},
    {label:"Outcome", detail:"PIA = ESCALATE → DPIA required", cite:"pia.rule.escalate"}
  ],
  artifacts:[{icon:"📝", title:"PIA screen UC-2026-0148", status:"ESCALATED", lines:["8 screening questions · all rule-answered","Escalation grounds: special category + scale","Next: full DPIA (stage 8)"]}],
  people:[{name:"System", role:"Automated PIA screen", action:"completed screening"}],
  systems:[{name:"Assessment Engine", action:"run(pia.screen.v3)", status:"OK"}]
},
{
  id:"dpia", n:8, title:"Data privacy impact analysis",
  chips:["Request DPO validation"],
  expected:["dpo","validate","request","approve","yes"],
  chat:[
    {who:"bot", text:"Building the full data privacy impact analysis: necessity, proportionality, residual risk and mitigations. This is the deepest assessment in the pipeline."},
    {who:"bot", text:"Draft complete. Residual risk after mitigations: LOW-MEDIUM. Routed to Marta (DPO) for validation — she appears in the People tab."}
  ],
  trace:[
    {label:"Necessity test", detail:"objectives justify processing", cite:"gdpr.art.35"},
    {label:"Proportionality", detail:"data minimised: salary band (not full salary), health choice (not full record)", cite:"gdpr.art.35(7)(b)"},
    {label:"Mitigations proposed", detail:"pseudonymised IDs · field-level access · 24m retention", cite:"control.catalog.11/19/24"},
    {label:"Residual risk", detail:"LOW-MEDIUM · DPO validation required", cite:"dpia.signoff.policy"}
  ],
  artifacts:[{icon:"📊", title:"DPIA UC-2026-0148", status:"AWAITING DPO", lines:["Necessity: justified (no less-intrusive alternative)","Proportionality: salary band, not salary; plan choice, not records","Mitigations: pseudonymisation · RBAC · retention 24m","Residual risk: LOW-MEDIUM"]}],
  people:[
    {name:"Marta Keller", role:"DPO", action:"assigned for validation"},
    {name:"Marta Keller", role:"DPO", action:"validated DPIA ✓ — “mitigations adequate, proceed with SCCs”"}
  ],
  systems:[{name:"Assessment Engine", action:"compile(dpia.template.v2)", status:"OK"}]
},
{
  id:"transfer", n:9, title:"Transfer analysis + TIA",
  chips:["Continue"],
  expected:["continue","next","ok","yes","tia"],
  chat:[
    {who:"bot", text:"Now the cross-border layer. Enrichment flagged it early: EEA → US, vendor DPA signed but no transfer mechanism on file."},
    {who:"bot", text:"Rule outcome: SCCs required + a transfer impact assessment before any data leaves the EEA. TIA drafted: vendor cloud region, government-access laws, supplementary encryption."}
  ],
  trace:[
    {label:"Transfer detected", detail:"EEA → US (Northgate)", cite:"transfer.detect.01"},
    {label:"Mechanism check", detail:"DPA ✓ · SCCs ✗ → GAP", cite:"gdpr.art.46"},
    {label:"Rule outcome", detail:"SCC execution required + TIA mandatory", cite:"transfer.rule.scc-tia"},
    {label:"TIA drafted", detail:"supplementary measures: AES-256 at rest, pseudonymised IDs", cite:"tia.template.v3"}
  ],
  artifacts:[{icon:"🌍", title:"TIA — EEA→US (Northgate)", status:"DRAFT", lines:["Mechanism: EU SCCs (to be executed)","Local law risk: medium (US CLOUD Act considered)","Supplementary measures: encryption at rest · pseudonymised IDs · access logging"]}],
  people:[{name:"System", role:"Automated transfer analysis", action:"drafted TIA"}],
  systems:[{name:"Transfer Rules Engine", action:"evaluate(corridor EEA→US)", status:"OK"}]
},
{
  id:"sharing", n:10, title:"Data sharing rules",
  chips:["Continue"],
  expected:["continue","next","ok","sharing","yes"],
  chat:[
    {who:"bot", text:"Sharing rules check — what may move, to whom, under what agreement. Two outbound flows: portal→vendor (processor, DPA+SCCs) and vendor→insurers (independent controllers, separate legal basis needed)."},
    {who:"bot", text:"The vendor→insurer flow is outside this case's current authority. I've flagged it as a condition: it requires its own intake. I don't approve it silently."}
  ],
  trace:[
    {label:"Flow 1: portal → Northgate", detail:"processor relationship · DPA + SCCs (pending execution)", cite:"share.rule.processor"},
    {label:"Flow 2: Northgate → insurers", detail:"independent controllers → separate basis required", cite:"share.rule.independent"},
    {label:"Boundary set", detail:"Flow 2 out of scope here → flagged, not approved", cite:"share.rule.no-silent-approval"}
  ],
  artifacts:[{icon:"🔗", title:"Sharing matrix", status:"1 FLAG", lines:["In: HRIS → portal (internal, RBAC)","Out: portal → Northgate (processor · DPA+SCC)","Out: Northgate → insurers — ⚠ own case required"]}],
  people:[{name:"System", role:"Automated sharing analysis", action:"mapped data flows"}],
  systems:[{name:"Sharing Rules Engine", action:"evaluate(2 flows)", status:"OK"}]
},
{
  id:"controls", n:11, title:"Controls recommendation",
  chips:["Accept controls"],
  expected:["accept","controls","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Based on everything upstream — risk, DPIA, TIA, sharing — here is the control set. Each control cites the finding that requires it."},
    {who:"bot", text:"6 controls recommended. Four can be applied automatically; two need human attestation first."}
  ],
  trace:[
    {label:"Control mapping", detail:"6 controls mapped from 9 findings", cite:"control.mapper.v2"},
    {label:"Automatable", detail:"4 of 6 (config-as-code available)", cite:"control.catalog.11/19/24/31"},
    {label:"Human-required", detail:"2 of 6 (organisational: training, vendor SCC execution)", cite:"control.catalog.44/45"}
  ],
  artifacts:[{icon:"🛡️", title:"Control set UC-2026-0148", status:"6 CONTROLS", lines:["C-11 pseudonymised employee IDs (auto)","C-19 field-level RBAC: health data (auto)","C-24 retention 24m post-employment (auto)","C-31 encryption at rest AES-256 (auto)","C-44 vendor privacy training (attest)","C-45 execute SCCs with Northgate (attest)"]}],
  people:[{name:"System", role:"Automated control mapper", action:"generated control set"}],
  systems:[{name:"Control Catalog", action:"match(findings)", status:"OK"}]
},
{
  id:"attest", n:12, title:"User control attestation",
  chips:["I attest"],
  expected:["attest","i attest","agree","yes","confirm"],
  chat:[
    {who:"bot", text:"Two controls need a human on record: C-44 (vendor training) and C-45 (SCC execution with Northgate). Attesting means you accept ownership and the audit log captures it."},
    {who:"bot", text:"Your attestation is a logged decision with your name and timestamp — it's evidence, not a formality."}
  ],
  trace:[
    {label:"Attestation request", detail:"C-44, C-45 → requester Priya Sharma", cite:"attest.policy.v1"},
    {label:"Identity anchor", detail:"SSO: p.sharma@dcba (MFA ✓)", cite:"authn.sso"},
    {label:"Attestation recorded", detail:"C-44, C-45 attested 09-24T14:12Z", cite:"attest.record"}
  ],
  artifacts:[{icon:"✍️", title:"Attestation record AT-0334", status:"SIGNED", lines:["Attested by: Priya Sharma (SSO MFA)","Controls: C-44 vendor training · C-45 SCC execution","Timestamp: 2026-09-24T14:12:07Z","Stored: immutable case file"]}],
  people:[{name:"Priya Sharma", role:"Business requester", action:"attested C-44 + C-45 ✓"}],
  systems:[{name:"Attestation Service", action:"record(AT-0334)", status:"OK"}]
},
{
  id:"apply", n:13, title:"Automated controls",
  chips:["Continue"],
  expected:["continue","next","ok","apply","yes"],
  chat:[
    {who:"bot", text:"Applying the four automatable controls now — config-as-code, no tickets, no drift. You can watch each one land in the Systems tab."},
    {who:"bot", text:"All four applied and verified. The two attested controls are tracked as obligations with owners and due dates."}
  ],
  trace:[
    {label:"C-11 applied", detail:"pseudonymisation on employee_id pipe", cite:"control.11.exec"},
    {label:"C-19 applied", detail:"RBAC policy: health fields → Benefits role only", cite:"control.19.exec"},
    {label:"C-24 applied", detail:"retention 24m post-employment job created", cite:"control.24.exec"},
    {label:"C-31 applied", detail:"AES-256 at rest on portal storage", cite:"control.31.exec"},
    {label:"Verification", detail:"4/4 verified by post-config probe", cite:"control.verify.v1"}
  ],
  artifacts:[{icon:"⚙️", title:"Control application log", status:"4/4 APPLIED", lines:["C-11 pseudonymisation ✓ verified","C-19 RBAC health fields ✓ verified","C-24 retention job ✓ verified","C-31 encryption at rest ✓ verified","Obligations open: C-44 (Priya), C-45 (Legal)"]}],
  people:[{name:"System", role:"Automation runtime", action:"applied 4 controls"}],
  systems:[
    {name:"Portal Config API", action:"PATCH /privacy/pseudonymise", status:"✓ APPLIED"},
    {name:"IAM Service", action:"PUT /rbac/health-fields", status:"✓ APPLIED"},
    {name:"Retention Service", action:"POST /jobs/retention-24m", status:"✓ APPLIED"},
    {name:"Storage Service", action:"POST /encrypt/aes256", status:"✓ APPLIED"}
  ]
},
{
  id:"log", n:14, title:"Record logging",
  chips:["Restart demo"],
  expected:["restart","again","replay","done","log"],
  chat:[
    {who:"bot", text:"Case closed. The full journey — intake to controls — is sealed into the immutable audit log. Hash-chained, append-only: every verdict, every citation, every human action is reconstructable."},
    {who:"bot", text:"UC-2026-0148 · outcome: PROCEED WITH CONTROLS · 14 stages · 23 rule citations · 2 human attestations · 1 DPO validation. Ask me for the log any time — it's the point of all this."}
  ],
  trace:[
    {label:"Case seal", detail:"UC-2026-0148 → audit chain", cite:"log.seal.v1"},
    {label:"Chain hash", detail:"0x7f3a…c91d (links prior block)", cite:"log.hashchain"},
    {label:"Retention of record", detail:"case file kept 6 years", cite:"policy.record-retention"}
  ],
  artifacts:[{icon:"🔒", title:"Audit record UC-2026-0148", status:"SEALED", lines:["Stages: 14/14 linear · verdicts: 11 · citations: 23","Humans: 2 attestations · 1 DPO validation","Automated: 4 controls applied, 3 golden sources, 2,317 cases scanned","Hash: 0x7f3a…c91d · append-only"]}],
  people:[{name:"System", role:"Audit logger", action:"sealed case record"}],
  systems:[{name:"Audit Chain", action:"append(block 48,113)", status:"✓ SEALED"}]
}
];
