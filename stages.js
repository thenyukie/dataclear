/* DataClear demo v0.4 — case UC26 (Legal AI productivity tool, International Company ABC).
   Same branch-aware engine (demo.js). Longest path: DPIA route + US/India TIAs.
   alt:true trace rows = branches NOT taken (shown for explainability). */
const FLOW = {
  meta: {
    caseId: "UC26",
    requester: "John Smith (Requester · Head of AI, Legal COO)",
    caseName: "Legal AI productivity tool — International Company ABC (UK launch)"
  },
  path: ["intake","enrich","match","notice","risk","dpia","dpo","transfer","tia","sharing","controls","attest","apply","log"],
  nodes: {
intake: {
  title:"Intake", actor:"Requester",
  chips:[{text:"Submit for evaluation", goto:"enrich"}],
  expected:["submit","evaluation","send","go","yes"],
  chat:[
    {who:"user", name:"John Smith (Requester)", text:"Hi — International Company ABC's legal function wants to deploy a generative AI productivity tool for our internal lawyers: research, document review, drafting, compliance and risk case analysis, custom workflows, knowledge management. Go-live 1 Nov 2026, UK only for now."},
    {who:"bot", text:"Thanks John. I've structured your submission into case UC26. Nothing is decided yet — I'll evaluate stage by stage, and every verdict will cite the encoded rule that produced it."},
    {who:"bot", text:"Summary → purpose: legal AI productivity tool (internal legal function) · users: ~300 UK lawyers · inputs: prompts + uploaded documents, may contain personal data · storage: EEA, logically separated tenant · encryption at rest and in transit · model layer: range of LLMs, auto-selected · go-live 2026-11-01. Later launches (US, HK, SG, Dubai, Mexico) are out of scope for this case. Submitting for evaluation."}
  ],
  trace:[
    {label:"Parse submission", detail:"free text → structured use case (UC26)", cite:"intake.schema.v2"},
    {label:"Classify purpose", detail:"purpose = LEGAL_AI_PRODUCTIVITY · controller = International Company ABC (UK)", cite:"taxonomy.purpose.07"},
    {label:"Resolve applicable law", detail:"UK controllers → UK GDPR + DPA 2018 (incl. DUAA 2025 amendments) apply as encoded rule set", cite:"law.jurisdiction.v1"},
    {label:"Extract data categories", detail:"[staff_id, name, work_email (onboarding) · prompts + document contents (unstructured) · possible criminal offence data → Art 10 flag SET]", cite:"taxonomy.data.03/11"},
    {label:"Detect cross-border element", detail:"model provider (US) + ABC India IT support access → transfer flag SET", cite:"transfer.detect.01"}
  ],
  artifacts:[{icon:"📋", title:"Intake form UC26", status:"SUBMITTED", lines:[
    "Requester: John Smith · Head of AI, Legal COO department",
    "Purpose: legal research, drafting, review, case analysis, knowledge management (internal lawyers only)",
    "Data: prompts + uploaded documents (may contain personal data incl. criminal offence data)",
    "Onboarding data: staff ID · name · work email",
    "Infrastructure: cloud · EEA storage (separated tenant) · AES encryption at rest + in transit",
    "Scope: ~300 UK users · go-live 2026-11-01 · later jurisdictions excluded"]}],
  people:[{name:"John Smith", role:"Requester · Head of AI, Legal COO", action:"submitted the use case"}],
  systems:[{name:"Intake API", action:"POST /cases (UC26)", status:"OK"}]
},
enrich: {
  title:"Enrichment", actor:"AI agent",
  chips:[{text:"Confirm enriched data", goto:"match"}],
  expected:["confirm","enrich","ok","yes","looks good"],
  chat:[
    {who:"bot", text:"Enriching your case from golden sources — I pull authoritative records rather than ask you to re-type them."},
    {who:"bot", text:"Found: International Company ABC, UK controller · 300 licensed users in SSO · vendor contract in Supplier Registry with Art 28 processor terms and sub-processor approval/audit rights confirmed · sub-processors on file: Cloud Provider A (EEA) · AI Model Provider B (US) · Cloud Providers C & D (EU) · legal AI sub-processor E (US, DPF UK Extension) · intra-group agreements cover internal IT/admin access (India IT desk, UK platform lead). A closed case for Harvey AI looks relevant — flagging it for matching."}
  ],
  trace:[
    {label:"Entity lookup", detail:"International Company ABC → UK controller resolved", cite:"golden.entity-register"},
    {label:"User population", detail:"SSO → 300 UK users · thousands of data subjects via document content", cite:"golden.sso"},
    {label:"Vendor registry", detail:"processor contract · Art 28 terms ✓ · sub-processor approvals + audit rights ✓", cite:"golden.supplier-registry"},
    {label:"Sub-processor map", detail:"Cloud A (EEA) · Model Provider B (US) · Clouds C & D (EU) · legal-AI sub-processor E (US · DPF UK Extension)", cite:"golden.subprocessors"},
    {label:"Internal access map", detail:"ABC India IT support desk · UK platform lead · scenario-triggered risk/IT access · intra-group agreements on file", cite:"golden.intragroup"},
    {label:"Prior case signalled", detail:"Harvey AI case (closed) → candidate for matching", cite:"case.signal.v1"}
  ],
  artifacts:[{icon:"🔎", title:"Enrichment report UC26", status:"COMPLETE", lines:[
    "Entity: International Company ABC (UK controller)",
    "Users: 300 UK (SSO) · go-live 2026-11-01",
    "Vendor: processor, no functional access to uploaded data · Art 28 terms ✓",
    "Sub-processors: A (EEA) · B (US) · C & D (EU) · E (US, DPF)",
    "Keys: held by ABC · transfers constant · no onward transfers · no known government access",
    "Related closed case: Harvey AI"]}],
  people:[{name:"DataClear", role:"AI agent", action:"queried golden sources + case DB"}],
  systems:[
    {name:"Entity Register", action:"GET /entities?q=ABC", status:"OK"},
    {name:"SSO Directory", action:"GET /licenses?entity=UK", status:"OK"},
    {name:"Supplier Registry", action:"GET /vendors/legal-ai-vendor", status:"OK"}
  ]
},
match: {
  title:"Case matching", actor:"AI agent",
  chips:[{text:"Proceed as new linked case", goto:"notice"}],
  expected:["proceed","new case","continue","yes","ok","linked"],
  chat:[
    {who:"bot", text:"Scanning prior cases for overlap — not a yes/no match, but degree of similarity across vendor, data categories and purpose."},
    {who:"bot", text:"Best candidate: the Harvey AI case (closed). Overlap 82% — same vendor, same data categories, different jurisdiction/scope at the time it was assessed. Rule M-04: ≥75% overlap = candidate; jurisdiction differs = no merge. Outcome: new case UC26 created and linked, inheriting the Harvey AI vendor profile, Art 28 contract terms and prior TIA as reference material — not its approval. This new assessment stands on its own."}
  ],
  trace:[
    {label:"Similarity scan", detail:"prior case DB · embedding + rule filter", cite:"match.engine.v3"},
    {label:"Candidate found", detail:"Harvey AI case · overlap 82% (threshold ≥75% = candidate)", cite:"match.threshold.75"},
    {label:"Verdict", detail:"OVERLAP · NO_MERGE (jurisdiction delta) → new case UC26, linked", cite:"match.rule.M-04"},
    {label:"Inherited assets", detail:"vendor risk profile · Art 28 terms · prior TIA (as reference only)", cite:"match.inheritance.v1"},
    {label:"ALT · 100% match", detail:"identical prior case → reuse entire prior approval, route straight to attestation + controls for the new submitter", alt:true}
  ],
  artifacts:[{icon:"🧬", title:"Match report UC26", status:"82% OVERLAP", lines:[
    "Matched: Harvey AI case (closed) · overlap 82%",
    "Same vendor, same data categories, different jurisdiction/scope",
    "Action: new case UC26, linked to prior",
    "Inherits: vendor profile, Art 28 terms, prior TIA as reference — not approval"]}],
  people:[{name:"DataClear", role:"AI agent", action:"matched & linked prior case, inherited assets"}],
  systems:[
    {name:"Case Store", action:"similarity scan", status:"OK"},
    {name:"Linkage API", action:"LINK UC26 ↔ HARVEY-AI", status:"OK"}
  ]
},
notice: {
  title:"Privacy notice check", actor:"AI agent",
  chips:[{text:"Accept validated notice", goto:"risk"}],
  expected:["accept","validated","notice","yes","ok"],
  chat:[
    {who:"bot", text:"Checking ABC's internal privacy notices and policies against what this tool actually does. ABC's internal data privacy policies are aligned with UK GDPR, and the user-facing pop-up notice is part of the product itself."},
    {who:"bot", text:"Result: staff ID, name and work email (onboarding), prompts and uploaded documents, and the possibility of criminal offence data are all covered by the existing notices. No gap — the notice is validated as correct, no remediation needed. (Had a gap existed, a remediation sub-flow would draft, assure and publish an amendment.)"}
  ],
  trace:[
    {label:"Notice coverage check", detail:"ABC internal privacy notices vs UC26 data map", cite:"notice.check.v2"},
    {label:"Categories covered", detail:"onboarding data · prompts/documents · criminal offence data — all enumerated", cite:"gdpr.art.13.1.d"},
    {label:"Purposes + transfers covered", detail:"legal AI processing · EEA/US/India flows referenced with mechanisms", cite:"gdpr.art.13.1.f"},
    {label:"Outcome", detail:"NO GAP → notice validated as correct", cite:"notice.rule.N-01"},
    {label:"ALT · gap found", detail:"→ AI drafts amendment → repository assurance check → Ops reviewer publishes (remediation loop 4a–4c)", alt:true}
  ],
  artifacts:[{icon:"✅", title:"Notice validation UC26", status:"PASS · NO GAP", lines:[
    "Notices reviewed: ABC internal privacy notices + in-tool pop-up notice",
    "All data categories covered ✓ (incl. criminal offence data handling)",
    "All transfer corridors referenced with mechanisms ✓",
    "No amendment required · no remediation loop"]}],
  people:[{name:"DataClear", role:"AI agent", action:"validated notice coverage"}],
  systems:[{name:"Notice Library", action:"GET /notices/internal/ABC", status:"OK"}]
},
risk: {
  title:"Risk scoring", actor:"AI agent",
  chips:[{text:"Accept HIGH risk routing", goto:"dpia"}],
  expected:["accept","risk","ok","yes","continue","high"],
  chat:[
    {who:"bot", text:"Scoring risk to set assessment depth. Drivers: criminal offence data possibly inside uploaded documents (Art 10 territory), thousands of data subjects via document content, innovative technology (generative AI), external processors, and cross-border flows to the US and India."},
    {who:"bot", text:"Score: 7/10 → HIGH. Rule R-02: a score of 5 or above routes to a full data privacy impact analysis (DPIA) with DPO review. A score under 5 would route to the lighter PIA path instead."}
  ],
  trace:[
    {label:"Factor · criminal offence data", detail:"possible Art 10 data in document uploads → +2.5", cite:"risk.factor.art10"},
    {label:"Factor · scale", detail:"thousands of data subjects via document content → +1.5", cite:"risk.factor.scale"},
    {label:"Factor · innovative tech", detail:"generative AI · multi-model auto-selection → +1.5 (Art 35(3)(a) signal)", cite:"risk.factor.innovative"},
    {label:"Factor · processors + transfers", detail:"external processor chain · US + India corridors → +1.5", cite:"risk.factor.transfer"},
    {label:"Aggregate", detail:"7/10 → HIGH → DPIA route (R-02: ≥5)", cite:"risk.matrix.v6"},
    {label:"ALT · score <5", detail:"→ light-touch PIA path, no DPO review required", alt:true}
  ],
  artifacts:[{icon:"🌡️", title:"Risk scorecard UC26", status:"HIGH · 7/10", lines:[
    "Criminal offence data (Art 10): 2.5/3",
    "Scale (thousands of data subjects): 1.5/2",
    "Innovative tech (gen-AI): 1.5/2",
    "Processor chain + US/India transfers: 1.5/3",
    "Routing: HIGH → full DPIA with DPO review"]}],
  people:[{name:"DataClear", role:"AI agent", action:"scored case → HIGH"}],
  systems:[{name:"Risk Engine", action:"evaluate(matrix.v6)", status:"OK"}]
},
dpia: {
  title:"DPIA preparation", actor:"AI agent",
  chips:[{text:"Route to DPO review", goto:"dpo"}],
  expected:["route","dpo","review","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Score HIGH → full data privacy impact analysis instead of a light-touch PIA. Building it now: necessity, proportionality, mitigations and residual risk — using the Harvey AI DPIA as baseline, adapted for this UK-first launch."},
    {who:"bot", text:"Draft complete. Triggers recorded: innovative technology and large-scale processing (Art 35(3)). Necessity rests on legitimate interests for the legal function plus the legal-claims condition for personal data in documents. Residual risk after mitigations: LOW-MEDIUM. Routing to the DPO for review — a human gate the AI cannot pass itself."}
  ],
  trace:[
    {label:"Route decision", detail:"DPIA replaces PIA on HIGH score (R-02 ≥5)", cite:"risk.route.R-02"},
    {label:"Statutory triggers", detail:"Art 35(3)(a) innovative tech · large-scale processing · Art 10 data in scope", cite:"gdpr.art.35.3"},
    {label:"Baseline inheritance", detail:"Harvey AI DPIA adapted for UK launch", cite:"dpia.baseline.v1"},
    {label:"Lawful basis analysis", detail:"Art 6(1)(f) legitimate interests · Art 9(2)(f) legal claims · Art 10 + DPA 2018 condition for criminal offence data", cite:"basis.map.v2"},
    {label:"Proportionality", detail:"30-day query retention · pop-up notice enforces data minimisation · tenant separation", cite:"gdpr.art.35.7.b"},
    {label:"Residual risk", detail:"LOW-MEDIUM after proposed mitigations", cite:"dpia.residual.v1"}
  ],
  artifacts:[{icon:"📊", title:"DPIA UC26 (draft)", status:"AWAITING DPO", lines:[
    "Governing law: UK GDPR + DPA 2018 (DUAA 2025 amendments) · UK controllers",
    "Triggers: Art 35(3)(a) innovative tech · large scale · Art 10 data",
    "Necessity: justified — efficiency/accuracy/timescales; no less-intrusive alternative",
    "Bases: 6(1)(f) LI · 9(2)(f) legal claims · DPA 2018 condition (criminal offence)",
    "Mitigations proposed: ABC-held keys · tenant separation · 30d retention · pop-up notice · logging",
    "Residual risk: LOW-MEDIUM · baseline: Harvey AI DPIA (adapted)"]}],
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
    {who:"bot", text:"DPIA with Marta Keller (DPO) for review — checklist covers necessity, proportionality, bases (incl. Art 10/DPA 2018), mitigations, transfer references and residual risk."},
    {who:"bot", text:"Marta approved the DPIA. The proposed mitigations — ABC-held encryption keys, 30-day retention, the in-tool data-minimisation notice, interaction logging and access controls — are recorded as obligations carried into the controls stage. (A rejection would loop the DPIA back for revision — supported, not shown in this run.)"}
  ],
  trace:[
    {label:"Reviewer", detail:"Marta Keller · DPO · manual review", cite:"dpo.assign.v1"},
    {label:"Checklist result", detail:"necessity ✓ proportionality ✓ bases ✓ (6(1)(f), 9(2)(f), Art 10/DPA 2018) ✓ mitigations ✓ transfer refs ✓ residual ✓", cite:"dpo.checklist.v2"},
    {label:"Decision", detail:"APPROVED — mitigations confirmed as obligations", cite:"dpo.rule.approved"},
    {label:"Obligations carried", detail:"keys (ABC) · retention 30d · pop-up notice · logging · access controls → controls stage", cite:"dpo.condition.v1"},
    {label:"ALT · rejection", detail:"→ DPIA returns to AI with comments for revision; resubmission required before proceeding", alt:true}
  ],
  artifacts:[{icon:"🖊️", title:"DPIA approval record", status:"DPO SIGNED", lines:[
    "Approved by: Marta Keller · DPO",
    "Checklist: necessity · proportionality · bases · mitigations · transfers · residual — all passed",
    "Mitigations recorded as obligations for the controls stage",
    "Signature timestamp: demo run"]}],
  people:[
    {name:"Marta Keller", role:"DPO", action:"reviewed & approved DPIA ✓"}
  ],
  systems:[{name:"Approval Service", action:"PUT /cases/UC26/dpia/approve", status:"OK"}]
},
transfer: {
  title:"Transfer rule analysis", actor:"AI agent",
  chips:[{text:"Confirm TIA required", goto:"tia"}],
  expected:["confirm","tia","required","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Now the cross-border layer. Four corridors leave the UK: storage and Cloud Providers A, C & D in the EEA; AI Model Provider B in the US; sub-processor E in the US under the DPF UK Extension; and ABC's IT support desk in India."},
    {who:"bot", text:"EEA corridors: adequacy — no TIA needed. US corridors: DPF UK Extension covers sub-processor E; Model Provider B relies on the vendor's Art 28 chain — but rule T-02 still requires a TIA for any restricted transfer. India: no adequacy decision → UK Addendum/IDTA plus TIA. Outcome: two TIAs, US and India. (A UK-only deployment would have bypassed this entirely.)"}
  ],
  trace:[
    {label:"Corridor · EEA", detail:"storage + Cloud A + Clouds C & D → adequacy → no TIA", cite:"transfer.adequacy.eea"},
    {label:"Corridor · US", detail:"Model Provider B (inference) + sub-processor E (DPF UK Extension) → restricted → TIA required (T-02)", cite:"transfer.rule.T-02"},
    {label:"Corridor · India", detail:"ABC IT support desk + scenario-triggered risk/IT access → no adequacy → UK Addendum/IDTA + TIA (T-03)", cite:"transfer.rule.T-03"},
    {label:"Mechanism check", detail:"Art 28 processor terms ✓ · DPF UK Extension ✓ · intra-group SCCs ✓ · UK Addendum (India) required", cite:"transfer.mechanism.v2"},
    {label:"Rule outcome", detail:"2 TIAs required: US + India", cite:"transfer.rule.T-02/T-03"},
    {label:"ALT · UK-only corridor", detail:"→ no restricted transfers → bypass TIA entirely; proceed to sharing analysis", alt:true}
  ],
  artifacts:[{icon:"🌍", title:"Transfer analysis memo", status:"2 TIAs REQUIRED", lines:[
    "EEA (storage, A, C & D): adequacy ✓ · no TIA",
    "US (Model Provider B inference; sub-processor E): DPF UK Extension + Art 28 chain · TIA required",
    "India (ABC IT desk, scenario-triggered access): no adequacy · UK Addendum/IDTA · TIA required",
    "Profile: constant transfers · ABC-held keys · no onward transfers · no known government access"]}],
  people:[{name:"DataClear", role:"AI agent", action:"mapped 3 corridors, ruled 2 TIAs mandatory"}],
  systems:[{name:"Transfer Rules Engine", action:"evaluate(corridors EEA/US/IN)", status:"OK"}]
},
tia: {
  title:"TIA preparation", actor:"AI agent",
  chips:[{text:"Accept TIA pack", goto:"sharing"}],
  expected:["accept","tia","pack","yes","ok"],
  chat:[
    {who:"bot", text:"Preparing both TIAs — destination-law review, recipient access model, supplementary measures. The Harvey AI TIA gives a validated baseline; adapting for the DPF and India contexts."},
    {who:"bot", text:"Both complete and scored MEDIUM. Mitigating facts: ABC holds the encryption keys, the vendor has no functional access to uploaded data, sub-processors cannot retain or human-review content, India access is scenario-triggered and recorded, there are no onward transfers, and no known government access anywhere. Both packs attached to the case."}
  ],
  trace:[
    {label:"Baseline", detail:"adapted from Harvey AI TIA (reference)", cite:"tia.baseline.v1"},
    {label:"TIA · US", detail:"CLOUD Act / FISA 702 considered · DPF UK Extension + Art 28 chain · score MEDIUM", cite:"tia.us.v1"},
    {label:"TIA · India", detail:"DPDP Act 2023 + government-access landscape reviewed · scenario-triggered, logged access · score MEDIUM", cite:"tia.india.v1"},
    {label:"Supplementary measures", detail:"ABC-held encryption keys · no functional vendor access · no sub-processor retention/review · no onward transfers · access logging", cite:"tia.measures.v1"},
    {label:"Output pack", detail:"2 TIA packs assembled: scores + treatment plans attached to UC26", cite:"tia.output.v1"}
  ],
  artifacts:[{icon:"📘", title:"TIA pack US + India", status:"MEDIUM · COMPLETE", lines:[
    "TIA US: DPF UK Extension · CLOUD Act/FISA 702 considered · score MEDIUM",
    "TIA India: UK Addendum/IDTA · DPDP Act 2023 reviewed · scenario-triggered access · score MEDIUM",
    "Mitigations (both): ABC-held keys · no functional vendor access · no sub-processor retention/review",
    "No onward transfers · no known government access · baseline: Harvey AI TIA"]}],
  people:[{name:"DataClear", role:"AI agent", action:"prepared both TIAs on inherited baseline"}],
  systems:[
    {name:"Transfer Engine", action:"compile(tia.template.v3 ×2)", status:"OK"},
    {name:"Schemas Engine", action:"attach packs → UC26", status:"OK"}
  ]
},
sharing: {
  title:"Data sharing rules", actor:"AI agent",
  chips:[{text:"Accept sharing map", goto:"controls"}],
  expected:["accept","sharing","map","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Mapping every data flow this use case creates — internal, outbound to processors, and any onward sharing."},
    {who:"bot", text:"Flows found: internal access (users, matter teams, UK line managers) covered by ABC's access controls and information barriers; administrative access (ABC India IT desk, UK platform lead, scenario-triggered risk/IT) covered by intra-group agreements; outbound to the vendor as processor under Art 28. No controller-to-controller sharing, no onward transfers beyond the processor chain — everything is within this case's authority. Verdict: no external sharing; nothing flagged."}
  ],
  trace:[
    {label:"Flow 1 · internal use", detail:"users · matter teams · UK line managers · RBAC + info barriers", cite:"share.rule.S-01"},
    {label:"Flow 2 · admin access", detail:"India IT desk · UK platform lead · scenario-triggered risk/IT · intra-group agreements", cite:"share.rule.S-02"},
    {label:"Flow 3 · processor chain", detail:"vendor → sub-processors under Art 28 with approval + audit rights", cite:"share.rule.S-03"},
    {label:"Onward sharing check", detail:"none confirmed — no controller-to-controller flows", cite:"share.rule.S-04"},
    {label:"Verdict", detail:"NO EXTERNAL SHARING · all flows within case authority", cite:"share.rule.verdict"}
  ],
  artifacts:[{icon:"🔗", title:"Sharing matrix UC26", status:"NO FLAGS", lines:[
    "Internal: users/matter teams/line managers (RBAC + information barriers)",
    "Admin: India IT desk + UK platform lead + scenario-triggered risk/IT (intra-group agreements)",
    "Processor chain: vendor → A/B/C/D/E under Art 28 (approvals + audit rights ✓)",
    "External sharing: none · onward transfers: none"]}],
  people:[{name:"DataClear", role:"AI agent", action:"mapped 3 flow classes, 0 flags"}],
  systems:[{name:"Sharing Rules Engine", action:"evaluate(3 flow classes)", status:"OK"}]
},
controls: {
  title:"Controls recommendation", actor:"AI agent",
  chips:[{text:"Review control set", goto:"attest"}],
  expected:["review","control","set","yes","ok","continue"],
  chat:[
    {who:"bot", text:"Everything upstream — risk, DPIA, TIAs, sharing — now condenses into one control set. Each control cites the finding that requires it: no orphans."},
    {who:"bot", text:"Six controls recommended. Four are automatable (I'll apply them directly at the apply step). Two are manual and need your attestation first: staff privacy training (C-44) and confirming Art 28 sub-processor approvals + audit rights with the vendor (C-45)."}
  ],
  trace:[
    {label:"Control mapping", detail:"6 controls mapped from DPIA obligations + TIA measures · each control cites its finding", cite:"control.mapper.v2"},
    {label:"Automatable", detail:"C-19 access controls · C-24 30-day retention · C-31 encryption verification · C-36 in-tool pop-up notice", cite:"control.catalog.auto"},
    {label:"Manual (attest)", detail:"C-44 staff privacy training · C-45 Art 28 sub-processor approvals/audit rights confirmation", cite:"control.catalog.manual"},
    {label:"Inherited", detail:"DPO-approved mitigations folded in as control parameters", cite:"control.catalog.inherited"}
  ],
  artifacts:[{icon:"🛡️", title:"Control set UC26", status:"6 CONTROLS", lines:[
    "C-19 access controls + information-barrier scoping (auto)",
    "C-24 retention: queries 30d · deletion within 30d after use ends (auto)",
    "C-31 encryption at rest + in transit — config verified (auto)",
    "C-36 in-tool pop-up notice: data minimisation + internal policies (auto)",
    "C-44 staff privacy training (manual · attest)",
    "C-45 Art 28 sub-processor approvals + audit rights confirmation (manual · attest)"]}],
  people:[{name:"DataClear", role:"AI agent", action:"generated control set from findings"}],
  systems:[{name:"Control Catalog", action:"match(findings)", status:"OK"}]
},
attest: {
  title:"User control attestation", actor:"Requester",
  chips:[{text:"I attest to C-44 and C-45", goto:"apply"}],
  expected:["attest","i attest","agree","yes","confirm","c-44"],
  chat:[
    {who:"bot", text:"Two controls need a human on record before I can apply anything: C-44 (staff privacy training) and C-45 (Art 28 sub-processor approvals + audit rights). Attesting means you own the obligation and its deadline — it's logged evidence, not a checkbox."},
    {who:"bot", text:"Attested ✓ — recorded against your SSO identity (MFA verified). Both obligations now have owners and due dates. (Incomplete attestation would block the case here — supported, not shown.)"}
  ],
  trace:[
    {label:"Attestation request", detail:"C-44 · C-45 → John Smith (requester)", cite:"attest.policy.v2"},
    {label:"Identity anchor", detail:"SSO: j.smith@abc-legal · MFA ✓", cite:"authn.sso.v1"},
    {label:"Gate evaluation", detail:"all required conditions attested → PASS", cite:"attest.gate.v1"},
    {label:"ALT · incomplete attestation", detail:"→ case blocked at this gate, returned to requester with gaps listed", alt:true}
  ],
  artifacts:[{icon:"✍️", title:"Attestation record AT-0601", status:"SIGNED", lines:[
    "Attested by: John Smith (SSO, MFA ✓)",
    "Controls: C-44 staff training · C-45 Art 28 sub-processor confirmations",
    "Obligations due: C-44 +30d · C-45 +60d",
    "Stored: immutable case file"]}],
  people:[{name:"John Smith", role:"Requester · Head of AI, Legal COO", action:"attested C-44 + C-45 ✓"}],
  systems:[{name:"Attestation Service", action:"record(AT-0601)", status:"OK"}]
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
    {label:"C-19 applied", detail:"access controls + matter-team scoping on tool tenancy", cite:"control.19.exec"},
    {label:"C-24 applied", detail:"retention: queries 30d · deletion within 30d after use ends", cite:"control.24.exec"},
    {label:"C-31 applied", detail:"encryption at rest + in transit verified (ABC-held keys)", cite:"control.31.exec"},
    {label:"C-36 applied", detail:"pop-up notice: data minimisation + internal policy reminder on every session", cite:"control.36.exec"},
    {label:"Verification", detail:"4/4 verified by post-config probe", cite:"control.verify.v2"}
  ],
  artifacts:[{icon:"⚙️", title:"Control application log", status:"4/4 APPLIED", lines:[
    "C-19 access controls ✓ verified",
    "C-24 retention 30d ✓ verified",
    "C-31 encryption (ABC-held keys) ✓ verified",
    "C-36 pop-up notice ✓ verified",
    "Obligations open: C-44 (John Smith, +30d) · C-45 (Legal, +60d)"]}],
  people:[{name:"DataClear", role:"AI agent", action:"applied 4 controls automatically"}],
  systems:[
    {name:"IAM Service", action:"PUT /rbac/tenancy-scoping", status:"✓ APPLIED"},
    {name:"Retention Service", action:"POST /jobs/retention-30d", status:"✓ APPLIED"},
    {name:"Storage Service", action:"POST /encrypt/verify-abc-keys", status:"✓ APPLIED"},
    {name:"Tool Config API", action:"POST /notice/popup-enabled", status:"✓ APPLIED"}
  ]
},
log: {
  title:"Record logging", actor:"System",
  chips:[{text:"Replay demo", goto:"__restart"}],
  expected:["replay","restart","again","done","log"],
  chat:[
    {who:"bot", text:"Case UC26 sealed. The entire journey — intake through controls — is written to the immutable audit chain: every verdict, every rule citation, every human action, reconstructable end to end."},
    {who:"bot", text:"14 events · 1 DPO approval · 2 attestations · 4 automated controls · 1 inherited 82% link to the Harvey AI case. And the record of processing is updated by this workflow as part of closure — the RoPA entry now reflects UC26's bases, recipients, corridors and retention. Output pack delivered to the requester. This log is the point of the whole system."}
  ],
  trace:[
    {label:"Case seal", detail:"UC26 → audit chain", cite:"log.seal.v2"},
    {label:"RoPA update", detail:"processing activity recorded: bases (6(1)(f), 9(2)(f), Art 10/DPA 2018) · recipients (vendor + sub-processors) · corridors (EEA/US/IN) · retention 30d", cite:"ropa.update.v1"},
    {label:"Chain hash", detail:"0x4e77…b2c9 (append-only)", cite:"log.hashchain"},
    {label:"Output pack", detail:"aggregated record: submission source data · decisions · recommendations · controls · process history", cite:"case.output.v1"},
    {label:"Record retention", detail:"case file retained 6 years", cite:"policy.record-retention"}
  ],
  artifacts:[
    {icon:"🔒", title:"Audit record UC26", status:"SEALED", lines:[
      "Events: 14/14 · every verdict rule-cited",
      "Humans: 1 DPO approval · 1 attestation (2 controls)",
      "Automated: 4 controls applied · 2 TIAs (MEDIUM) · 3 corridors mapped",
      "Matched: 82% link to Harvey AI case",
      "Hash: 0x4e77…b2c9 · append-only"]},
    {icon:"📦", title:"Final output pack (aggregated record)", status:"DELIVERED", lines:[
      "Source submission: UC26 intake (John Smith, Legal COO)",
      "Decisions: risk 7/10 HIGH · DPIA approved · 2 TIAs MEDIUM · sharing 0 flags · notice no-gap",
      "Controls: 6 (4 auto-applied · 2 attested with due dates)",
      "RoPA: updated by this workflow — bases, recipients, corridors, retention recorded",
      "Linked case: Harvey AI (82% inheritance, reference only)"]}
  ],
  people:[{name:"DataClear", role:"System", action:"sealed case record, updated RoPA, delivered output pack"}],
  systems:[
    {name:"Audit Chain", action:"append(block)", status:"✓ SEALED"},
    {name:"RoPA Service", action:"PUT /ropa/UC26", status:"✓ UPDATED"},
    {name:"Case Store", action:"PUT /cases/UC26/final", status:"✓ RECORDED"}
  ]
}
  }
};
