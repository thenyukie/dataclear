/* DataClear demo v0.3 — branch-aware node graph. Longest path (high-risk DPIA + UK/EU TIA).
   Engine walks nodes via chip goto; FLOW.path is the default linear tour.
   alt:true trace rows = branches NOT taken (shown for explainability). */
const FLOW = {
  path: ["intake","enrich","match","notice","risk","dpia","dpo","transfer","tia","sharing","controls","attest","apply","log"],
  nodes: {
intake: {
  title:"Intake", actor:"Requester",
  chips:[{text:"Submit for evaluation", goto:"enrich"}],
  expected:["submit","evaluation","send","go","yes"],
  chat:[
    {who:"user", name:"Priya (HR Ops)", text:"Hi — we need a new employee benefits portal for our UK entity. Health-plan enrollment, salary bands, dependents; administered by our existing US vendor Northgate."},
    {who:"bot", text:"Thanks Priya. I've structured your submission into case UC-2026-0155. Nothing is decided yet — I'll evaluate stage by stage, and every verdict will cite the encoded rule that produced it."},
    {who:"bot", text:"Summary → purpose: benefits administration · data: employee ID, salary band, dependents, health enrollment · vendor: Northgate (US) · scope: ~1,180 UK employees. Submitting for evaluation."}
  ],
  trace:[
    {label:"Parse submission", detail:"free text → structured use case (8 fields)", cite:"intake.schema.v2"},
    {label:"Classify purpose", detail:"purpose = BENEFITS_ADMIN · entity = DCBA Ltd (UK)", cite:"taxonomy.purpose.07"},
    {label:"Extract data categories", detail:"[employee_id, salary_band, dependents, health_enrollment]", cite:"taxonomy.data.03/11"},
    {label:"Detect cross-border element", detail:"vendor region = US → transfer flag SET", cite:"transfer.detect.01"}
  ],
  artifacts:[{icon:"📋", title:"Intake form UC-2026-0155", status:"SUBMITTED", lines:["Requester: Priya (HR Operations)","Purpose: benefits administration (UK)","Data: employee ID · salary band · dependents · health enrollment","Vendor: Northgate Benefits Inc. (US)","Employees in scope: ~1,180 (DCBA Ltd, UK)"]}],
  people:[{name:"Priya", role:"Requester · HR Ops", action:"submitted the use case"}],
  systems:[{name:"Intake API", action:"POST /cases (UC-2026-0155)", status:"OK"}]
},
enrich: {
  title:"Enrichment", actor:"AI agent",
  chips:[{text:"Confirm enriched data", goto:"match"}],
  expected:["confirm","enrich","ok","yes","looks good"],
  chat:[
    {who:"bot", text:"Enriching your case from golden sources — I pull authoritative records rather than ask you to re-type them."},
    {who:"bot", text:"Found: DCBA Ltd (UK) · 1,180 employees in HRIS · Northgate in Supplier Registry with DPA signed 2025-03-11 and EEA SCCs on file. A closed case UC-2025-0061 (EEA benefits portal, same vendor) looks relevant — flagging it for matching."}
  ],
  trace:[
    {label:"Entity lookup", detail:"DCBA Holdings Plc → DCBA Ltd (UK) resolved", cite:"golden.entity-register"},
    {label:"Population check", detail:"HRIS → 1,180 active UK employees", cite:"golden.hris"},
    {label:"Vendor registry", detail:"Northgate Benefits Inc. · DPA signed 2025-03-11 · EEA SCCs on file", cite:"golden.supplier-registry"},
    {label:"Prior case signalled", detail:"UC-2025-0061 (EEA benefits portal, closed) → candidate for matching", cite:"case.signal.v1"}
  ],
  artifacts:[{icon:"🔎", title:"Enrichment report", status:"COMPLETE", lines:["Entity: DCBA Ltd (UK) under DCBA Holdings Plc","Employees: 1,180 (golden HRIS, synced 06:00 UTC)","Vendor: Northgate — DPA ✓ · EEA SCCs ✓ · UK addendum ✗","Related closed case: UC-2025-0061 (EEA, 2025)"]}],
  people:[{name:"DataClear", role:"AI agent", action:"queried 3 golden sources + case DB"}],
  systems:[
    {name:"Entity Register", action:"GET /entities?q=DCBA", status:"OK"},
    {name:"HRIS", action:"GET /headcount?entity=UK", status:"OK"},
    {name:"Supplier Registry", action:"GET /vendors/northgate", status:"OK"}
  ]
},
match: {
  title:"Case matching", actor:"AI agent",
  chips:[{text:"Proceed as new linked case", goto:"notice"}],
  expected:["proceed","new case","continue","yes","ok","linked"],
  chat:[
    {who:"bot", text:"Scanning 2,891 prior cases for overlap — not a yes/no match, but degree of similarity across vendor, data categories and purpose."},
    {who:"bot", text:"Best candidate: UC-2025-0061 (EEA benefits portal, closed 2025-09). Overlap 82% — same vendor, same data categories, different jurisdiction (EEA → UK). Rule M-04: ≥75% overlap = candidate; jurisdiction differs = no merge. Outcome: new case created and linked, inheriting the prior case's vendor profile, DPA and TIA as reference material."}
  ],
  trace:[
    {label:"Similarity scan", detail:"2,891 cases · embedding + rule filter", cite:"match.engine.v3"},
    {label:"Candidate found", detail:"UC-2025-0061 · overlap 82% (threshold ≥75% = candidate)", cite:"match.threshold.75"},
    {label:"Verdict", detail:"OVERLAP · NO_MERGE (jurisdiction delta UK ≠ EEA) → new case, linked", cite:"match.rule.M-04"},
    {label:"Inherited assets", detail:"vendor risk profile · DPA · EEA TIA (as reference)", cite:"match.inheritance.v1"},
    {label:"ALT · 100% match", detail:"identical prior case → reuse entire prior approval, route straight to attestation + controls for the new submitter", alt:true}
  ],
  artifacts:[{icon:"🧬", title:"Match report UC-2026-0155", status:"82% OVERLAP", lines:["Scanned: 2,891 closed/open cases","Matched: UC-2025-0061 (EEA benefits portal) · overlap 82%","Same vendor, same data categories, different jurisdiction","Action: new case UC-2026-0155, linked to prior · inherits vendor profile, DPA, TIA reference"]}],
  people:[{name:"DataClear", role:"AI agent", action:"matched & linked prior case, inherited assets"}],
  systems:[
    {name:"Case Store", action:"similarity scan (2,891)", status:"OK"},
    {name:"Linkage API", action:"LINK UC-2026-0155 ↔ UC-2025-0061", status:"OK"}
  ]
},
notice: {
  title:"Privacy notice check", actor:"AI agent",
  chips:[{text:"Accept validated notice", goto:"risk"}],
  expected:["accept","validated","notice","yes","ok"],
  chat:[
    {who:"bot", text:"Checking the UK employee privacy notice (v12.1, updated 2026-03) against what this use case actually does."},
    {who:"bot", text:"Result: health-plan enrollment, salary bands, dependents and UK→US transfers for benefits administration are all already enumerated. No gap — the notice is validated as correct, no remediation needed. (Had a gap existed, a remediation sub-flow would draft, assure and publish an amendment.)"}
  ],
  trace:[
    {label:"Notice coverage check", detail:"notice v12.1 (UK) vs use-case data map", cite:"notice.check.v2"},
    {label:"Categories covered", detail:"health enrollment · salary band · dependents — all enumerated §3.2–3.4", cite:"gdpr.art.13.1.d"},
    {label:"Transfers covered", detail:"UK→US described with mechanism reference (§7.1)", cite:"gdpr.art.13.1.f"},
    {label:"Outcome", detail:"NO GAP → notice validated as correct", cite:"notice.rule.N-01"},
    {label:"ALT · gap found", detail:"→ AI drafts amendment → repository assurance check → Ops reviewer publishes (remediation loop 4a–4c)", alt:true}
  ],
  artifacts:[{icon:"✅", title:"Notice validation UC-2026-0155", status:"PASS · NO GAP", lines:["Notice reviewed: Employee Privacy Notice v12.1 (UK)","All data categories covered ✓","UK→US transfers referenced with mechanism ✓","No amendment required · no remediation loop"]}],
  people:[{name:"DataClear", role:"AI agent", action:"validated notice coverage"}],
  systems:[{name:"Notice Library", action:"GET /notices/employee/UK/v12.1", status:"OK"}]
},
risk: {
  title:"Risk scoring", actor:"AI agent",
  chips:[{text:"Accept HIGH risk routing", goto:"dpia"}],
  expected:["accept","risk","ok","yes","continue","high"],
  chat:[
    {who:"bot", text:"Scoring risk to set assessment depth. Drivers: health data (special category), all-employee scale, external processor, cross-border transfer."},
    {who:"bot", text:"Score: 16/25 → HIGH. Rule R-11: ≥14 routes to a full data privacy impact analysis (DPIA) with DPO review. A score under 14 would route to the lighter PIA path instead."}
  ],
  trace:[
    {label:"Factor · special category", detail:"health enrollment → +6", cite:"risk.factor.special"},
    {label:"Factor · scale", detail:"all 1,180 UK employees → +4", cite:"risk.factor.scale"},
    {label:"Factor · external processor", detail:"Northgate (US) → +3", cite:"risk.factor.processor"},
    {label:"Factor · transfer", detail:"UK→US → +3", cite:"risk.factor.transfer"},
    {label:"Aggregate", detail:"16/25 → HIGH → DPIA route (R-11: ≥14)", cite:"risk.matrix.v5"},
    {label:"ALT · score <14", detail:"→ light-touch PIA path, no DPO review required", alt:true}
  ],
  artifacts:[{icon:"🌡️", title:"Risk scorecard UC-2026-0155", status:"HIGH · 16/25", lines:["Special category: 6/8","Scale: 4/6","External processor: 3/5","Transfer: 3/6","Routing: HIGH → full DPIA with DPO review"]}],
  people:[{name:"DataClear", role:"AI agent", action:"scored case → HIGH"}],
  systems:[{name:"Risk Engine", action:"evaluate(matrix.v5)", status:"OK"}]
},
dpia: {
  title:"DPIA preparation", actor:"AI agent",
  chips:[{text:"Route to DPO review", goto:"dpo"}],
  expected:["route","dpo","review","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Score HIGH → full data privacy impact analysis instead of a light-touch PIA. Building it now: necessity, proportionality, mitigations and residual risk — using the inherited UC-2025-0061 DPIA as baseline, adapted UK-first."},
    {who:"bot", text:"Draft complete. Residual risk after mitigations: LOW-MEDIUM. Routing to Marta (DPO) for review — a human gate the AI cannot pass itself."}
  ],
  trace:[
    {label:"Route decision", detail:"DPIA replaces PIA on HIGH score (R-11 ≥14)", cite:"risk.route.R-11"},
    {label:"Baseline inheritance", detail:"prior EEA DPIA (UC-2025-0061) adapted for UK jurisdiction", cite:"dpia.baseline.v1"},
    {label:"Necessity test", detail:"objectives justify processing of health + salary data", cite:"gdpr.art.35"},
    {label:"Proportionality", detail:"salary band (not full salary) · plan choice (not full record)", cite:"gdpr.art.35.7.b"},
    {label:"Residual risk", detail:"LOW-MEDIUM after proposed mitigations", cite:"dpia.residual.v1"}
  ],
  artifacts:[{icon:"📊", title:"DPIA UC-2026-0155 (draft)", status:"AWAITING DPO", lines:["Necessity: justified — no less-intrusive alternative","Proportionality: salary band, not salary · plan choice, not records","Mitigations proposed: pseudonymised IDs · field-level RBAC · 24m retention · AES-256","Residual risk: LOW-MEDIUM","Baseline: inherited from UC-2025-0061 (adapted)"]}],
  people:[
    {name:"DataClear", role:"AI agent", action:"drafted DPIA on inherited baseline"},
    {name:"Marta Keller", role:"DPO", action:"assigned for review"}
  ],
  systems:[{name:"Assessment Engine", action:"compile(dpia.template.v3)", status:"OK"}]
},
dpo: {
  title:"DPO review & approval", actor:"DPO",
  chips:[{text:"DPO approves — continue", goto:"transfer"}],
  expected:["approve","dpo","continue","yes","ok","approved"],
  chat:[
    {who:"bot", text:"DPIA with Marta Keller (DPO) for review — checklist covers necessity, proportionality, mitigations, transfer references and residual risk."},
    {who:"bot", text:"Marta approved with one condition: dependents' data retention capped at 24 months (down from the proposed 36). Condition recorded as an obligation and passed to controls. (A rejection would loop the DPIA back for revision — supported, not shown in this run.)"}
  ],
  trace:[
    {label:"Reviewer", detail:"Marta Keller · DPO · 8-item checklist", cite:"dpo.assign.v1"},
    {label:"Checklist result", detail:"necessity ✓ proportionality ✓ mitigations ✓ transfer refs ✓ residual ✓ (8/8)", cite:"dpo.checklist.v2"},
    {label:"Decision", detail:"APPROVED with condition: dependents retention ≤ 24 months", cite:"dpo.rule.approved-with-conditions"},
    {label:"Condition → obligation", detail:"retention override recorded as control obligation", cite:"dpo.condition.v1"},
    {label:"ALT · rejection", detail:"→ DPIA returns to AI with comments for revision; resubmission required before proceeding", alt:true}
  ],
  artifacts:[{icon:"🖊️", title:"DPIA approval record", status:"DPO SIGNED", lines:["Approved by: Marta Keller · DPO","Condition: dependents retention ≤ 24 months","Checklist: 8/8 items passed","Signature timestamp: 2026-09-26T10:22Z"]}],
  people:[
    {name:"Marta Keller", role:"DPO", action:"reviewed DPIA (8-item checklist)"},
    {name:"Marta Keller", role:"DPO", action:"approved with condition ✓"}
  ],
  systems:[{name:"Approval Service", action:"PUT /cases/2026-0155/dpia/approve", status:"OK"}]
},
transfer: {
  title:"Transfer rule analysis", actor:"AI agent",
  chips:[{text:"Confirm TIA required", goto:"tia"}],
  expected:["confirm","tia","required","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Now the cross-border layer. This case moves UK employee data to Northgate's US hosting — a UK/EU transfer, so a transfer impact assessment is mandatory."},
    {who:"bot", text:"Corridor found: UK→US. DPA ✓, EEA SCCs on file, but the UK International Data Addendum isn't executed yet — a gap. Rule T-02: UK/EU corridor → TIA required. (No UK/EU transfer would have bypassed this entirely.)"}
  ],
  trace:[
    {label:"Transfer detected", detail:"UK→US (Northgate hosting, us-east-1)", cite:"transfer.detect.01"},
    {label:"Mechanism check", detail:"DPA ✓ · EEA SCCs ✓ · UK IDA ✗ (not executed)", cite:"transfer.mechanism.v2"},
    {label:"Rule outcome", detail:"UK/EU corridor → TIA mandatory (rule T-02)", cite:"transfer.rule.T-02"},
    {label:"ALT · no UK/EU transfer", detail:"→ bypass TIA entirely; proceed to sharing analysis", alt:true}
  ],
  artifacts:[{icon:"🌍", title:"Transfer analysis memo", status:"TIA REQUIRED", lines:["Route: UK→US (Northgate, us-east-1)","Mechanisms: DPA ✓ · EEA SCCs ✓ · UK IDA pending","Gap: UK International Data Addendum not executed","Decision: TIA required per rule T-02"]}],
  people:[{name:"DataClear", role:"AI agent", action:"detected corridor, ruled TIA mandatory"}],
  systems:[{name:"Transfer Rules Engine", action:"evaluate(corridor UK→US)", status:"OK"}]
},
tia: {
  title:"TIA preparation", actor:"AI agent",
  chips:[{text:"Accept TIA pack", goto:"sharing"}],
  expected:["accept","tia","pack","yes","ok"],
  chat:[
    {who:"bot", text:"Preparing the transfer impact assessment — destination-law review, vendor access model, supplementary measures. The inherited EEA→US TIA from the matched case gives a validated baseline; adapting for UK addendum context."},
    {who:"bot", text:"TIA complete: encryption at rest, pseudonymised IDs, access logging, government-request notification procedure. Output pack assembled and attached to the case."}
  ],
  trace:[
    {label:"Baseline", detail:"adapted from inherited EEA→US TIA (UC-2025-0061)", cite:"tia.baseline.v1"},
    {label:"Destination law review", detail:"US CLOUD Act · FISA 702 considered", cite:"tia.destination.v1"},
    {label:"Supplementary measures", detail:"AES-256 at rest · pseudonymised IDs · access logging · gov-request procedure", cite:"tia.measures.v1"},
    {label:"Output pack", detail:"TIA pack assembled: treatment plan + residual-risk template", cite:"tia.output.v1"}
  ],
  artifacts:[{icon:"📘", title:"TIA UK→US (Northgate)", status:"COMPLETE", lines:["Corridor: UK→US (us-east-1)","Destination-law risk: medium — CLOUD Act/FISA 702 considered","Supplementary measures: AES-256 · pseudonymised IDs · access logging · notification procedure","Baseline: adapted from matched-case EEA TIA","Pack: treatment plan + residual-risk template attached"]}],
  people:[{name:"DataClear", role:"AI agent", action:"prepared TIA on inherited baseline"}],
  systems:[
    {name:"Transfer Engine", action:"compile(tia.template.v3)", status:"OK"},
    {name:"Schemas Engine", action:"attach pack → case", status:"OK"}
  ]
},
sharing: {
  title:"Data sharing rules", actor:"AI agent",
  chips:[{text:"Accept sharing map", goto:"controls"}],
  expected:["accept","sharing","map","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Mapping every data flow this use case creates — internal, outbound to processor, and onward sharing."},
    {who:"bot", text:"Three flows found. Two are covered (internal RBAC; Northgate as processor under DPA + IDA once executed). The third — Northgate onward to insurers — is controller-to-controller: outside this case's authority, flagged for its own submission. I don't approve silently what I haven't evaluated."}
  ],
  trace:[
    {label:"Flow 1 · HRIS → portal", detail:"internal · RBAC-protected", cite:"share.rule.S-01"},
    {label:"Flow 2 · portal → Northgate", detail:"processor relationship · DPA + UK IDA (pending execution)", cite:"share.rule.S-02"},
    {label:"Flow 3 · Northgate → insurers", detail:"independent controllers → separate basis + own submission required", cite:"share.rule.S-03"},
    {label:"Boundary", detail:"Flow 3 NOT approved here — flagged for separate intake", cite:"share.rule.no-silent-approval"}
  ],
  artifacts:[{icon:"🔗", title:"Sharing matrix UC-2026-0155", status:"1 FLAG", lines:["In: HRIS → portal (internal, RBAC)","Out: portal → Northgate (processor · DPA + UK IDA)","Out: Northgate → insurers — ⚠ controller-to-controller · own submission required","Not approved in this case: onward sharing"]}],
  people:[{name:"DataClear", role:"AI agent", action:"mapped 3 flows, flagged 1"}],
  systems:[{name:"Sharing Rules Engine", action:"evaluate(3 flows)", status:"OK"}]
},
controls: {
  title:"Controls recommendation", actor:"AI agent",
  chips:[{text:"Review control set", goto:"attest"}],
  expected:["review","control","set","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Everything upstream — risk, DPIA, TIA, sharing — now condenses into one control set. Each control cites the finding that requires it: no orphans."},
    {who:"bot", text:"Six controls recommended. Four are automatable (I'll apply them directly at the apply step). Two are manual and need your attestation first: vendor privacy training (C-44) and executing the UK IDA with Northgate (C-45)."}
  ],
  trace:[
    {label:"Control mapping", detail:"6 controls mapped from 9 findings · each control cites its finding", cite:"control.mapper.v2"},
    {label:"Automatable", detail:"C-11 pseudonymisation · C-19 RBAC · C-24 retention · C-31 encryption", cite:"control.catalog.auto"},
    {label:"Manual (attest)", detail:"C-44 vendor training · C-45 UK IDA execution with Northgate", cite:"control.catalog.manual"},
    {label:"Inherited", detail:"DPO condition folded in: dependents retention ≤ 24m (C-24 param)", cite:"control.catalog.inherited"}
  ],
  artifacts:[{icon:"🛡️", title:"Control set UC-2026-0155", status:"6 CONTROLS", lines:["C-11 pseudonymised employee IDs (auto)","C-19 field-level RBAC: health data (auto)","C-24 retention 24m post-employment, dependents ≤24m per DPO (auto)","C-31 encryption at rest AES-256 (auto)","C-44 vendor privacy training (manual · attest)","C-45 execute UK IDA with Northgate (manual · attest)"]}],
  people:[{name:"DataClear", role:"AI agent", action:"generated control set from findings"}],
  systems:[{name:"Control Catalog", action:"match(9 findings)", status:"OK"}]
},
attest: {
  title:"User control attestation", actor:"Requester",
  chips:[{text:"I attest to C-44 and C-45", goto:"apply"}],
  expected:["attest","i attest","agree","yes","confirm","c-44"],
  chat:[
    {who:"bot", text:"Two controls need a human on record before I can apply anything: C-44 (vendor privacy training) and C-45 (executing the UK IDA with Northgate). Attesting means you own the obligation and its deadline — it's logged evidence, not a checkbox."},
    {who:"bot", text:"Attested ✓ — recorded against your SSO identity (MFA verified). Both obligations now have owners and due dates. (Incomplete attestation would block the case here — supported, not shown.)"}
  ],
  trace:[
    {label:"Attestation request", detail:"C-44 · C-45 → Priya (requester)", cite:"attest.policy.v2"},
    {label:"Identity anchor", detail:"SSO: priya@dcba · MFA ✓", cite:"authn.sso.v1"},
    {label:"Gate evaluation", detail:"all required conditions attested → PASS", cite:"attest.gate.v1"},
    {label:"ALT · incomplete attestation", detail:"→ case blocked at this gate, returned to requester with gaps listed", alt:true}
  ],
  artifacts:[{icon:"✍️", title:"Attestation record AT-0512", status:"SIGNED", lines:["Attested by: Priya (SSO, MFA ✓)","Controls: C-44 vendor training · C-45 UK IDA execution","Timestamp: 2026-09-26T11:05Z","Obligations due: C-44 +30d · C-45 +60d","Stored: immutable case file"]}],
  people:[{name:"Priya", role:"Requester · HR Ops", action:"attested C-44 + C-45 ✓"}],
  systems:[{name:"Attestation Service", action:"record(AT-0512)", status:"OK"}]
},
apply: {
  title:"Automated controls application", actor:"System",
  chips:[{text:"Run automated controls", goto:"log"}],
  expected:["run","apply","controls","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Attestation complete — applying the four automatable controls now. Config-as-code straight to the target systems: no tickets, no drift. Watch the Systems tab."},
    {who:"bot", text:"All four applied and verified by post-config probe. The two attested obligations remain tracked with owners and due dates. Case is ready to close."}
  ],
  trace:[
    {label:"C-11 applied", detail:"pseudonymisation on employee_id (UK portal pipe)", cite:"control.11.exec"},
    {label:"C-19 applied", detail:"RBAC: health fields → Benefits admin role only", cite:"control.19.exec"},
    {label:"C-24 applied", detail:"retention 24m post-employment · dependents ≤24m (DPO condition)", cite:"control.24.exec"},
    {label:"C-31 applied", detail:"AES-256 at rest on portal storage", cite:"control.31.exec"},
    {label:"Verification", detail:"4/4 verified by post-config probe", cite:"control.verify.v2"}
  ],
  artifacts:[{icon:"⚙️", title:"Control application log", status:"4/4 APPLIED", lines:["C-11 pseudonymised employee IDs ✓ verified","C-19 RBAC health fields ✓ verified","C-24 retention 24m ✓ verified","C-31 AES-256 at rest ✓ verified","Obligations open: C-44 (Priya, +30d) · C-45 (Legal, +60d)"]}],
  people:[{name:"DataClear", role:"AI agent", action:"applied 4 controls automatically"}],
  systems:[
    {name:"Portal Config API", action:"PATCH /privacy/pseudonymise", status:"✓ APPLIED"},
    {name:"IAM Service", action:"PUT /rbac/health-fields", status:"✓ APPLIED"},
    {name:"Retention Service", action:"POST /jobs/retention-24m", status:"✓ APPLIED"},
    {name:"Storage Service", action:"POST /encrypt/aes256", status:"✓ APPLIED"}
  ]
},
log: {
  title:"Record logging", actor:"System",
  chips:[{text:"Replay demo", goto:"__restart"}],
  expected:["replay","restart","again","done","log"],
  chat:[
    {who:"bot", text:"Case UC-2026-0155 sealed. The entire journey — intake through controls — is written to the immutable audit chain: every verdict, every rule citation, every human action, reconstructable end to end."},
    {who:"bot", text:"14 events · 27 rule citations · 1 DPO approval · 2 attestations · 4 automated controls · 1 inherited 82% match. Output pack delivered to the requester. This log is the point of the whole system."}
  ],
  trace:[
    {label:"Case seal", detail:"UC-2026-0155 → audit chain", cite:"log.seal.v2"},
    {label:"Chain hash", detail:"0x9dc1…c68a (links block #48,113)", cite:"log.hashchain"},
    {label:"Output pack", detail:"aggregated record: source submission · decisions · recommendations · controls · artifacts", cite:"case.output.v1"},
    {label:"Record retention", detail:"case file retained 6 years", cite:"policy.record-retention"}
  ],
  artifacts:[
    {icon:"🔒", title:"Audit record UC-2026-0155", status:"SEALED", lines:["Events: 14/14 · rule citations: 27","Humans: 1 DPO approval · 1 attestation (2 controls)","Automated: 4 controls applied · 2,891 cases scanned · 3 golden sources","Matched: 82% link to UC-2025-0061","Hash: 0x9dc1…c68a · append-only"]},
    {icon:"📦", title:"Final output pack (aggregated record)", status:"DELIVERED", lines:["Source submission: UC-2026-0155 intake","Decisions: risk 16/25 HIGH · DPIA approved (1 condition) · TIA complete · sharing 1 flag","Controls: 6 (4 auto-applied · 2 attested with due dates)","Artifacts: DPIA · TIA pack · sharing matrix · notice validation · match report","Linked case: UC-2025-0061 (82% inheritance)"]}
  ],
  people:[{name:"DataClear", role:"System", action:"sealed case record, delivered output pack"}],
  systems:[
    {name:"Audit Chain", action:"append(block 48,114)", status:"✓ SEALED"},
    {name:"Case Store", action:"PUT /cases/2026-0155/final", status:"✓ RECORDED"}
  ]
}
  }
};
