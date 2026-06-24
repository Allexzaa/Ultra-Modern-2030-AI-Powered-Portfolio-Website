const SKILL_ICONS = {
  "AWS DMS":               "sync_alt",
  "Aurora MySQL":          "storage",
  "CDC Replication":       "stream",
  "CloudWatch":            "analytics",
  "CloudWatch Logs":       "article",
  "CloudWatch Events":     "notification_important",
  "Secrets Manager":       "lock",
  "IAM Auth":              "vpn_key",
  "IAM":                   "vpn_key",
  "Multi-AZ":              "dns",
  "Zero-Downtime":         "check_circle",
  "API Gateway":           "api",
  "Lambda":                "bolt",
  "Cognito":               "account_circle",
  "DynamoDB":              "table_chart",
  "Serverless":            "cloud",
  "JWT Auth":              "token",
  "S3 Events":             "inventory_2",
  "Telegram API":          "send",
  "Event-Driven":          "notifications_active",
  "Idempotency":           "repeat_one",
  "Automation":            "precision_manufacturing",
  "Rekognition":           "visibility",
  "Comprehend":            "psychology",
  "AI Moderation":         "verified_user",
  "Content Policy":        "policy",
  "Parallel Processing":   "account_tree",
  "Step Functions":        "alt_route",
  "SNS":                   "campaign",
  "State Machine":         "autorenew",
  "Saga Pattern":          "schema",
  "Fault Tolerance":       "health_and_safety",
  "Distributed Workflows": "hub",
  "Security Automation":   "gpp_good",
  "Incident Response":     "crisis_alert",
  "Audit Logging":         "fact_check",
  "Bedrock":               "auto_awesome",
  "GenAI":                 "smart_toy",
  "Prompt Engineering":    "edit_note",
  "Session Memory":        "save",
  "RAG":                   "menu_book",
};

const projects = {
  migration: {
    image: "../New web/images/ai_human_future_1.png",
    tag: "AWS / Database",
    title: "Automated Data Migration",
    summary: "Zero-downtime MySQL-to-Aurora migration using continuous replication, encrypted storage, and a controlled cutover plan.",
    role: "Cloud Engineer — sole contributor",
    focus: "Reliability, encryption, credential rotation, high-availability cutover.",
    stackShort: "AWS DMS, Aurora, CloudWatch",
    impact: [["0", "downtime target"], ["Multi-AZ", "failover ready"], ["CDC", "live replication"]],
    whatIDid: [
      "Audited the MySQL setup and chose CDC as the only viable zero-downtime path after a snapshot attempt failed at 45-minute lag",
      "Provisioned Multi-AZ Aurora MySQL 8 with encryption at rest and in transit before migrating any data",
      "Built a CloudWatch lag gate that blocked cutover until replication held under 1 second for 15 consecutive minutes",
      "Replaced all hardcoded credentials with Secrets Manager IAM auth, tested through 3 full rotation cycles"
    ],
    skills: ["AWS DMS", "Aurora MySQL", "CDC Replication", "CloudWatch", "Secrets Manager", "IAM Auth", "Multi-AZ", "Zero-Downtime"],
    problem: "A live financial services company needed to migrate a 220 GB MySQL payment database to Aurora with zero downtime and a PCI DSS compliance deadline in 6 weeks. Two prior attempts had already failed.",
    setupFacts: [
      { k: "Scenario",   v: "Live MySQL payment database — continuous writes, zero offline window allowed" },
      { k: "Constraint", v: "PCI DSS compliance deadline in 6 weeks — two prior attempts had already failed" },
      { k: "Approach",   v: "CDC via AWS DMS, lag-gated cutover, credential rotation before go-live" },
      { k: "Timeline",   v: "6 weeks — sole contributor" }
    ],
    decisions: [
      { title: "CDC over snapshot replication", tag: "Architecture",
        detail: "A snapshot-based approach was attempted and aborted after 45 minutes when lag spiked to 45× the acceptable threshold. CDC streams every committed write continuously, making replication lag a real-time observable metric rather than a surprise at cutover.",
        tradeoff: "CDC is more complex to configure and debug, but it was the only method that could keep the payment system live during migration." },
      { title: "Lag gate instead of scheduled cutover window", tag: "Process",
        detail: "Cutover automation only proceeded when CloudWatch confirmed lag stayed under 1 second for 15 consecutive minutes. The original plan had a fixed Sunday night window — that was discarded after the failed snapshot attempt.",
        tradeoff: "You give up a predictable go-live date, but you don't go live when the system isn't ready." },
      { title: "Secrets Manager IAM auth from day one", tag: "Compliance",
        detail: "All DB credentials were replaced with IAM-based auth through Secrets Manager before cutover. The rotation Lambda was tested through 3 full cycles with connection pool tracing enabled.",
        tradeoff: "Required application-side changes to adopt IAM auth, but PCI DSS mandated credential rotation anyway — this made it automatic and auditable." }
    ],
    learned: [
      "CDC under sustained write spikes can lag — monitor before it becomes a problem, not after",
      "Multi-AZ failover needs testing with production-representative load, not just a health check",
      "Secrets Manager rotation requires connection pool awareness — naive rotation drops active sessions"
    ],
    differently: "Run a full write-load test against the Aurora target before choosing the cutover window. A hot partition issue appeared only under real production write patterns — two days of post-migration tuning could have been caught in staging.",
    archNodes: [
      { icon: "🗄️", tag: "Source", title: "MySQL DB", sub: "On-Premises · ~220 GB",
        role: "The live payment database that could not go offline. Every write needed to land in Aurora without a missed commit.",
        facts: [["Engine","MySQL 5.7 on bare-metal"],["Size","~220 GB, 14 tables"],["Load","3,400 writes/min peak"],["Binlog","Enabled — required for CDC"]] },
      { icon: "🔁", tag: "Migration Engine", title: "AWS DMS", sub: "Full Load + CDC",
        role: "The bridge. Seeds Aurora with a full snapshot then switches to CDC mode, streaming every committed write in near real-time until cutover.",
        facts: [["Mode","Full Load → CDC"],["Lag SLA","< 1 s for 15 consecutive min"],["Instance","dms.r5.xlarge (4 vCPU / 32 GB)"],["Rollback","Abort + re-seat full load"]] },
      { icon: "⚡", tag: "Target", title: "Aurora MySQL 8", sub: "Multi-AZ · Encrypted",
        role: "The production target. Provisioned and failover-tested before migration began — Multi-AZ verified under representative write load, not just a health check ping.",
        facts: [["Engine","Aurora MySQL 8.0"],["Topology","Multi-AZ, 2 replicas"],["Encryption","AES-256 + TLS 1.3 in transit"],["Auth","IAM auth via Secrets Manager"]] },
      { icon: "📊", tag: "Observability", title: "CloudWatch", sub: "Replication Lag Gate",
        role: "The automated cutover guardian. Cutover only proceeded when this alarm confirmed lag under 1 second for 15 consecutive minutes.",
        facts: [["Metric","CDCLatencySource"],["Threshold","< 1 s for ≥ 15 min"],["Action","Block cutover via SNS"],["Dashboard","Shared with compliance auditors"]] },
      { icon: "🔐", tag: "Security", title: "Secrets Manager", sub: "Credential Rotation",
        role: "Replaced all hardcoded DB credentials. Rotation is connection-pool-aware — the Lambda rotator waits for pools to drain before removing the old secret.",
        facts: [["Rotation","Every 30 days, automated Lambda"],["Auth","IAM — no password in code"],["Tested","3 full cycles, 0 drops"],["Compliance","PCI DSS credential management ✓"]] }
    ],
    caseStudy: "#",
    github: "#"
  },

  microservices: {
    image: "../New web/images/tech_philosophy_1.png",
    tag: "AWS / Serverless",
    title: "Secure Microservices",
    summary: "Lambda-backed e-commerce APIs with Cognito authentication and least-privilege IAM boundaries per service.",
    role: "Cloud Engineer — service boundary design",
    focus: "Service isolation, auth, request validation, and operational visibility.",
    stackShort: "API Gateway, Lambda, DynamoDB",
    impact: [["3", "isolated services"], ["Cognito", "JWT auth"], ["IAM", "scoped roles"]],
    whatIDid: [
      "Mapped service boundaries across product, order, and auth into independent Lambda functions",
      "Configured API Gateway routing with per-service request validation before Lambda invocation",
      "Scoped IAM roles individually per function to enforce least-privilege access",
      "Centralized structured logs for cross-service debugging in CloudWatch"
    ],
    skills: ["API Gateway", "Lambda", "Cognito", "DynamoDB", "IAM", "Serverless", "JWT Auth", "CloudWatch Logs"],
    problem: "A monolithic e-commerce backend meant every feature shared the same deployment, scaling profile, and permission boundary — a bug in one service could affect all others.",
    setupFacts: [
      { k: "Scenario",   v: "Monolithic backend — one deployment and one permission boundary for all features" },
      { k: "Constraint", v: "Services needed independent scaling, isolated auth, and per-function least-privilege" },
      { k: "Approach",   v: "API Gateway + Lambda microservices with Cognito JWT auth and scoped IAM roles" },
      { k: "Timeline",   v: "4 weeks — service boundary design and implementation" }
    ],
    decisions: [
      { title: "Service boundaries by capability, not team", tag: "Architecture",
        detail: "Product, order, and auth were split based on distinct data access patterns and scaling needs, not organisational lines. This kept IAM scope narrow and deployment independent.",
        tradeoff: "More infrastructure to manage, but eliminates blast radius when any single service has an issue." },
      { title: "Request validation at the gateway, not in Lambda", tag: "Design",
        detail: "JSON schema validation runs at the API Gateway layer before Lambda is invoked. Malformed requests are rejected before consuming compute and the contract is explicit in the API definition.",
        tradeoff: "Gateway validation is less flexible than code-level checks, but faster, cheaper, and forces explicit API design." }
    ],
    learned: [
      "Scoping IAM roles per function upfront is far easier than tightening a shared role later",
      "Centralized structured logging matters more than expected when debugging cross-service flows",
      "Gateway-level request validation eliminates an entire class of Lambda cold-start waste"
    ],
    differently: "Add distributed tracing with X-Ray from the start. Correlating a request across three Lambda functions using CloudWatch logs alone was workable but slow — trace IDs would have cut debugging time significantly.",
    archNodes: [
      { icon: "🌐", tag: "Entry", title: "Client Request", sub: "Browser / Mobile",
        role: "Incoming request from the frontend client. Hits the API Gateway endpoint with a Cognito JWT token in the Authorization header.",
        facts: [["Protocol","HTTPS"],["Auth Header","Bearer JWT (Cognito)"],["Formats","JSON body"],["Source","Browser or mobile app"]] },
      { icon: "🚪", tag: "Gateway", title: "API Gateway", sub: "Routing + Validation",
        role: "Routes requests to the correct Lambda function. JSON schema validation runs at this layer — malformed requests are rejected before consuming Lambda compute.",
        facts: [["Validation","JSON Schema per route"],["Auth","Cognito JWT authorizer"],["Routes","3 resource paths"],["Throttle","Per-route burst limits"]] },
      { icon: "🔑", tag: "Auth", title: "Cognito JWT", sub: "Token Verification",
        role: "JWT tokens are verified by the API Gateway Cognito authorizer. Lambda functions do not perform auth — it is enforced entirely at the gateway boundary.",
        facts: [["Token Type","JWT (Cognito User Pool)"],["Verification","API Gateway built-in"],["Scope","Per-service claim check"],["Lifetime","1 hour, refresh 30 days"]] },
      { icon: "⚡", tag: "Compute", title: "Lambda Service", sub: "3 Isolated Functions",
        role: "Three independent Lambda functions: product, order, and auth. Each has its own scoped IAM role limited to only the DynamoDB table it owns.",
        facts: [["Functions","Product, Order, Auth"],["IAM","Scoped role per function"],["Runtime","Node.js 20"],["Cold Start","~150 ms avg"]] },
      { icon: "🗄️", tag: "Storage", title: "DynamoDB", sub: "Per-Service Tables",
        role: "Each service owns its own DynamoDB table. Product catalog, order state, and user data are never shared across function boundaries.",
        facts: [["Tables","3 isolated tables"],["Access","Single table per Lambda"],["Billing","On-demand capacity"],["Consistency","Strong writes"]] },
      { icon: "📋", tag: "Observability", title: "CloudWatch Logs", sub: "Structured JSON Logs",
        role: "All Lambda functions emit structured JSON logs. Cross-service debugging uses a shared request ID injected at the gateway layer.",
        facts: [["Format","Structured JSON"],["Correlation","Request ID header"],["Retention","30 days"],["Queries","CloudWatch Insights"]] }
    ],
    caseStudy: "#",
    github: "#"
  },

  scheduling: {
    image: "../New web/images/ai_human_future_2.png",
    tag: "AWS / Automation",
    title: "Scheduling App",
    summary: "Event-driven appointment system triggered by S3 uploads with automated confirmations and waitlist handling.",
    role: "Cloud Engineer — full pipeline build",
    focus: "Event automation, idempotency, reminders, and waitlist consistency.",
    stackShort: "S3, Lambda, DynamoDB",
    impact: [["S3", "file trigger"], ["Auto", "reminders"], ["DDB", "waitlist state"]],
    whatIDid: [
      "Wired S3 upload events to trigger Lambda parsing of CSV schedule files",
      "Designed DynamoDB data model with conditional writes for idempotent waitlist management",
      "Built Telegram notification dispatch with retry logic for failed deliveries",
      "Handled duplicate S3 event delivery safely using idempotency keys"
    ],
    skills: ["S3 Events", "Lambda", "DynamoDB", "Telegram API", "Event-Driven", "Idempotency", "Serverless", "Automation"],
    problem: "Manual appointment coordination via spreadsheets caused scheduling conflicts, missed follow-ups, and significant admin overhead — with no automated confirmation or waitlist management.",
    setupFacts: [
      { k: "Scenario",   v: "Manual scheduling via spreadsheets — conflicts, missed reminders, heavy admin load" },
      { k: "Constraint", v: "Schedule changes arrive as CSV uploads; system must be idempotent under duplicate S3 events" },
      { k: "Approach",   v: "S3 event trigger → Lambda parser → DynamoDB state + Telegram notifications" },
      { k: "Timeline",   v: "3 weeks — full pipeline build" }
    ],
    decisions: [
      { title: "Idempotency keys for duplicate S3 events", tag: "Reliability",
        detail: "S3 at-least-once delivery means the same upload can trigger Lambda twice. Each event is keyed by S3 object ETag and checked against a processed-events table in DynamoDB before any state is written.",
        tradeoff: "Adds a DynamoDB read per event, but eliminates double-bookings caused by duplicate triggers." },
      { title: "Conditional writes for waitlist ordering", tag: "Data Model",
        detail: "DynamoDB conditional expressions enforce waitlist position without transactions. The write only succeeds if the expected slot is still available, preventing two users from claiming the same position.",
        tradeoff: "Requires retry logic on contention, but avoids the cost and complexity of DynamoDB transactions for this access pattern." }
    ],
    learned: [
      "S3 duplicate events are not edge cases — they happen regularly and must be handled from day one",
      "Conditional writes are a cleaner waitlist primitive than optimistic locking in most DynamoDB patterns",
      "Telegram's API rate limits matter when sending batch reminders — queue and throttle by default"
    ],
    differently: "Design the notification queue before the parser. The Telegram rate limit caused a backlog issue when reminders fired in bulk. A SQS queue with delay between messages should have been the default from the start.",
    archNodes: [
      { icon: "📄", tag: "Input", title: "CSV Upload", sub: "Appointment Schedule",
        role: "Schedule files uploaded to S3 by admin staff. Each upload represents a new or updated appointment schedule that triggers the processing pipeline.",
        facts: [["Format","CSV, UTF-8"],["Bucket","Private S3 with versioning"],["Trigger","S3 ObjectCreated event"],["Validation","Schema checked in Lambda"]] },
      { icon: "📦", tag: "Trigger", title: "S3 Event", sub: "At-Least-Once Delivery",
        role: "S3 fires an event notification on each upload. At-least-once delivery means duplicate events are expected and must be handled — not an edge case.",
        facts: [["Type","ObjectCreated:Put"],["Delivery","At-least-once"],["Dedup Key","S3 ETag"],["Latency","< 1 s trigger"]] },
      { icon: "⚡", tag: "Compute", title: "Lambda Parser", sub: "Idempotency Keys",
        role: "Parses the CSV schedule file, checks the S3 ETag against a processed-events table, and writes appointment state only if the event has not been processed before.",
        facts: [["Runtime","Node.js 20"],["Idempotency","ETag checked in DDB"],["Error Handling","DLQ on failure"],["Timeout","30 s"]] },
      { icon: "🗄️", tag: "Storage", title: "DynamoDB", sub: "Waitlist + State",
        role: "Stores appointment slots and waitlist positions. Conditional writes enforce slot availability — two concurrent requests for the same slot will have exactly one succeed.",
        facts: [["Tables","Appointments, Processed-Events"],["Writes","Conditional expressions"],["TTL","Auto-expire old slots"],["Consistency","Strong writes"]] },
      { icon: "📨", tag: "Notification", title: "Telegram API", sub: "Confirmation + Reminders",
        role: "Sends booking confirmations and pre-appointment reminders. Rate-limited to avoid Telegram's API throttle during bulk reminder batches.",
        facts: [["API","Telegram Bot API"],["Rate Limit","30 msg/s global"],["Retry","Exponential backoff"],["Format","Markdown with booking link"]] }
    ],
    caseStudy: "#",
    github: "#"
  },

  moderation: {
    image: "../New web/images/tech_philosophy_2.png",
    tag: "AWS / AI",
    title: "AI Moderation Agent",
    summary: "Real-time content moderation pipeline using image and text analysis to flag risky user-generated content.",
    role: "Cloud Engineer — moderation workflow design",
    focus: "AI classification, review queues, latency, and policy logging.",
    stackShort: "Rekognition, Comprehend, Lambda",
    impact: [["2 AI", "services"], ["Real-time", "analysis"], ["Audit", "decision log"]],
    whatIDid: [
      "Designed Lambda orchestration routing content to Rekognition and Comprehend in parallel",
      "Tuned confidence thresholds to balance false positive rate against review queue volume",
      "Stored every moderation decision with confidence scores for human review and auditing",
      "Ran image and text checks concurrently to minimize per-request latency"
    ],
    skills: ["Rekognition", "Comprehend", "Lambda", "DynamoDB", "AI Moderation", "Content Policy", "Parallel Processing"],
    problem: "Manual content moderation did not scale and exposed reviewers to harmful material before any automated triage — with no audit trail for policy decisions.",
    setupFacts: [
      { k: "Scenario",   v: "UGC platform — images and text requiring real-time triage before display" },
      { k: "Constraint", v: "Manual review doesn't scale; no audit trail for content policy decisions" },
      { k: "Approach",   v: "Lambda orchestrating Rekognition + Comprehend in parallel, decisions logged to DynamoDB" },
      { k: "Timeline",   v: "3 weeks — pipeline build and threshold calibration" }
    ],
    decisions: [
      { title: "Parallel AI service invocation, not sequential", tag: "Latency",
        detail: "Rekognition (image) and Comprehend (text) run in parallel via Promise.all. Sequential invocation would double per-request latency with no benefit — the two services are fully independent.",
        tradeoff: "Increases concurrent Lambda execution but cuts p95 latency roughly in half compared to sequential calls." },
      { title: "Confidence threshold calibration before go-live", tag: "Accuracy",
        detail: "Default thresholds flagged too many false positives in early testing. Spent one week running both services against a labeled sample set and adjusting confidence cutoffs per content category.",
        tradeoff: "Delays go-live by a week, but a miscalibrated system in production erodes trust faster than a delayed launch." }
    ],
    learned: [
      "Default AI confidence thresholds are starting points, not production values — always calibrate on real data",
      "Parallel invocation is the right default for independent AI services; sequential is an easy mistake to make",
      "Storing confidence scores alongside decisions is essential — a binary pass/fail cannot be audited"
    ],
    differently: "Build the human review queue before tuning thresholds. Several borderline decisions during calibration had nowhere to go. A review queue would have made threshold tuning safer and produced better labeled data.",
    archNodes: [
      { icon: "☁️", tag: "Input", title: "User Upload", sub: "Image + Text Content",
        role: "User-generated content entering the moderation pipeline. Content is held from display until a moderation decision is recorded.",
        facts: [["Types","Image (JPG/PNG) + text"],["Max Size","5 MB image / 5 KB text"],["Pre-check","File type validation"],["Hold","Pending moderation decision"]] },
      { icon: "⚡", tag: "Orchestrator", title: "Lambda Router", sub: "Parallel Dispatch",
        role: "Invokes Rekognition and Comprehend concurrently via Promise.all. Aggregates both results and applies combined confidence scoring before writing the decision.",
        facts: [["Invocation","Promise.all (parallel)"],["Services","Rekognition + Comprehend"],["Timeout","10 s"],["Error","Both must succeed or escalate"]] },
      { type: "split", nodes: [
        { icon: "👁️", tag: "AI — Image", title: "Rekognition", sub: "Image Analysis",
          role: "Classifies uploaded images against AWS content moderation taxonomy. Returns confidence scores per label category — explicit, unsafe, violence.",
          facts: [["API","DetectModerationLabels"],["Labels","Explicit, Violence, Unsafe"],["Confidence","Per-category score 0–100"],["Min Confidence","Calibrated at 75"]] },
        { icon: "🧠", tag: "AI — Text", title: "Comprehend", sub: "Text Analysis",
          role: "Classifies text content for toxicity, profanity, and policy violations. Runs independently from Rekognition — results are merged in the Lambda router.",
          facts: [["API","ClassifyDocument (custom)"],["Types","Toxic, Profane, Hate"],["Language","Auto-detect"],["Confidence","Per-class probability"]] }
      ]}
    ],
    caseStudy: "#",
    github: "#"
  },

  orders: {
    image: "../New web/images/philosophy_v3_3.png",
    tag: "AWS / Workflow",
    title: "Order Pipeline",
    summary: "Fault-tolerant order workflow coordinating validation, payment, inventory, and notifications.",
    role: "Cloud Engineer — state machine design",
    focus: "Retry behavior, compensating actions, and consistent state transitions.",
    stackShort: "Step Functions, Lambda, SNS",
    impact: [["4", "workflow stages"], ["Retry", "built in"], ["SNS", "alerts"]],
    whatIDid: [
      "Modeled order state machine with explicit Catch and Retry paths for each failure mode",
      "Designed compensating transaction logic to roll back partial order states cleanly",
      "Split payment, inventory, and notification into discrete, auditable workflow states",
      "Used Step Functions execution history as the primary operational trace"
    ],
    skills: ["Step Functions", "Lambda", "SNS", "DynamoDB", "State Machine", "Saga Pattern", "Fault Tolerance", "Distributed Workflows"],
    problem: "Order systems that fail after payment but before inventory update leave the system in an inconsistent state — financial records and stock levels fall out of sync with no automatic recovery path.",
    setupFacts: [
      { k: "Scenario",   v: "Distributed order processing — payment, inventory, and notification must stay consistent" },
      { k: "Constraint", v: "Payment can succeed while inventory update fails — leaving an unrecoverable inconsistency" },
      { k: "Approach",   v: "Step Functions state machine with Catch/Retry and compensating transaction logic" },
      { k: "Timeline",   v: "4 weeks — state machine design and failure path testing" }
    ],
    decisions: [
      { title: "Step Functions over choreography-based saga", tag: "Architecture",
        detail: "Step Functions provides a centralized execution history and explicit Catch/Retry configuration. A choreography approach with SNS/SQS would be harder to observe and debug when a step fails mid-order.",
        tradeoff: "Step Functions adds cost per state transition, but the execution trace is worth it — you can see exactly where an order failed and why." },
      { title: "Compensating transactions modeled as explicit states", tag: "Resilience",
        detail: "If payment succeeds but inventory fails, a compensation state voids the charge and notifies the customer. This is modeled as a workflow state, not an afterthought in error handling code.",
        tradeoff: "Adds complexity to the state machine, but the alternative — silent inconsistent state — is worse for both the customer and finance." }
    ],
    learned: [
      "Step Functions execution history is the best debugging tool in the workflow — design states to be observable",
      "Compensation logic needs the same test rigor as the happy path",
      "Fine-grained states are easier to compensate than coarse-grained ones — split early"
    ],
    differently: "Add idempotency to the payment step from day one. The current design handles payment failure but not duplicate payment — a network retry could charge a customer twice. This is the highest-risk gap in the current design.",
    archNodes: [
      { icon: "✅", tag: "Validation", title: "Validate Order", sub: "Schema + Stock Check",
        role: "Schema validation and inventory availability check before any payment is attempted. Failures here are cheap — no charge, no rollback needed.",
        facts: [["Schema","JSON Schema validation"],["Stock","DynamoDB inventory check"],["Errors","Returned immediately"],["Latency","< 50 ms"]] },
      { icon: "💳", tag: "Payment", title: "Charge Payment", sub: "Payment Gateway",
        role: "Payment captured only after all validations pass. This is the point of no return — a failure after this step requires explicit compensation.",
        facts: [["Provider","Payment gateway Lambda"],["Retry","3 attempts, exponential"],["Idempotency","Order ID as key"],["Timeout","5 s"]] },
      { icon: "📦", tag: "Inventory", title: "Update Inventory", sub: "Atomic Write",
        role: "Stock decremented atomically after successful payment. If this step fails, the compensation state voids the payment charge.",
        facts: [["Write","DynamoDB conditional update"],["Rollback","Triggers compensate state"],["Contention","Retry on version conflict"],["Consistency","Strong write"]] },
      { icon: "📧", tag: "Notification", title: "Notify Customer", sub: "SNS + Email",
        role: "Order confirmation dispatched via SNS to SES. Runs after inventory update — failure here does not roll back the order, but triggers a retry.",
        facts: [["Channels","SNS → SES email"],["Timing","Post inventory confirm"],["Template","Order confirmation"],["Retry","Step Functions built-in"]] },
      { icon: "🔄", tag: "Resilience", title: "Compensate Failure", sub: "Saga Rollback",
        role: "Activated if any step after payment fails. Voids the charge and notifies the customer that the order could not be fulfilled. Modeled as an explicit workflow state.",
        facts: [["Trigger","Payment success + downstream fail"],["Actions","Void charge + notify"],["Audit","Logged to DynamoDB"],["Scope","Payment and inventory only"]] }
    ],
    caseStudy: "#",
    github: "#"
  },

  incident: {
    image: "../New web/images/tech_philosophy_4.png",
    tag: "AWS / Security",
    title: "Incident Response",
    summary: "CloudWatch-triggered workflow that isolates suspicious resources and notifies security teams quickly.",
    role: "Cloud Engineer — response automation design",
    focus: "Containment, alerting, approval control, and auditability.",
    stackShort: "CloudWatch, Step Functions, Lambda",
    impact: [["Auto", "isolation"], ["SNS", "team alert"], ["Audit", "timeline"]],
    whatIDid: [
      "Designed response workflow to isolate resources and revoke scoped credentials automatically on trigger",
      "Placed irreversible containment actions behind approval gates to prevent accidental execution",
      "Built SNS alerting to notify the security team at each response stage",
      "Logged every state transition for post-incident audit review"
    ],
    skills: ["CloudWatch Events", "Step Functions", "Lambda", "SNS", "Security Automation", "Incident Response", "Audit Logging"],
    problem: "Manual cloud incident response slows containment and makes it easy to skip critical steps under alert pressure — with no consistent audit trail of what actions were taken and when.",
    setupFacts: [
      { k: "Scenario",   v: "Security team responding to suspicious resource activity manually — slow, error-prone" },
      { k: "Constraint", v: "Irreversible actions (credential revocation, isolation) must not fire accidentally" },
      { k: "Approach",   v: "CloudWatch Events → Step Functions with human approval gates on destructive steps" },
      { k: "Timeline",   v: "3 weeks — response path design and gate testing" }
    ],
    decisions: [
      { title: "Approval gates on all irreversible actions", tag: "Safety",
        detail: "Any step that cannot be undone requires an explicit approval signal before execution. The state machine waits for a callback token before proceeding with credential revocation or resource isolation.",
        tradeoff: "Slows containment by the time a human takes to approve, but prevents an automated false positive from taking down a production resource." },
      { title: "Tight event pattern filtering to reduce noise", tag: "Operations",
        detail: "CloudWatch Event patterns are filtered to specific anomaly signatures before triggering the workflow. Broad patterns create alert fatigue — teams stop trusting automation that fires too often.",
        tradeoff: "Tight patterns may miss novel attack signatures, but a noisy system that teams ignore is worse than no automation." }
    ],
    learned: [
      "Approval gate design matters as much as response logic — a gate too slow becomes a bypass",
      "Event pattern specificity is an ongoing calibration, not a one-time configuration",
      "Audit logs for automated response are non-negotiable — you need a precise timeline for every incident"
    ],
    differently: "Build a simulation mode that dry-runs the full response path without executing containment. Testing against a real security event was the only way to validate the workflow — a dry-run mode would have made iteration much safer.",
    archNodes: [
      { icon: "⚠️", tag: "Detection", title: "CloudWatch Event", sub: "Anomaly Pattern",
        role: "Event pattern matched against known anomaly signatures before triggering the workflow. Pattern specificity prevents alert fatigue.",
        facts: [["Filter","EventBridge pattern rules"],["Patterns","IP anomaly, credential abuse"],["False Positive","Tuned weekly"],["Latency","< 500 ms trigger"]] },
      { icon: "🔀", tag: "Orchestration", title: "Step Functions", sub: "Response State Machine",
        role: "Central orchestrator with callback tokens for human approvals. Every state transition is recorded in execution history — the primary audit source.",
        facts: [["Type","Standard workflow"],["History","Full execution trace"],["Token","Task.sendTaskSuccess callback"],["Max Duration","1 year"]] },
      { icon: "🛡️", tag: "Containment", title: "Isolate Resource", sub: "Automatic Containment",
        role: "Network egress blocked and IAM scope restricted automatically on trigger. Gate-protected — requires human approval before executing irreversible isolation.",
        facts: [["Scope","SG rule + IAM policy update"],["Reversibility","Reversible via playbook"],["Gate","Human approval required"],["Latency","< 2 s after approval"]] },
      { icon: "📢", tag: "Notification", title: "SNS Alert", sub: "Security Team Notify",
        role: "Notification dispatched at each state transition — trigger, isolation, approval request, resolution. Teams receive a full timeline without checking the console.",
        facts: [["Channel","SNS → PagerDuty + Slack"],["Audience","Security on-call team"],["Template","State + evidence + action link"],["SLA","Alert in < 30 s"]] },
      { icon: "📋", tag: "Audit", title: "Audit Log", sub: "State Timeline",
        role: "Every state transition logged with timestamp, actor, and action taken. Required for post-incident review and compliance reporting.",
        facts: [["Format","JSON event log"],["Storage","CloudWatch + S3 archive"],["Retention","2 years"],["Compliance","SOC 2 audit trail"]] },
      { icon: "👤", tag: "Safety Gate", title: "Human Approval", sub: "Callback Token Gate",
        role: "Irreversible containment steps pause the state machine and wait for an explicit approval via API callback. The gate has a timeout — if no response, the step is skipped and the team is alerted.",
        facts: [["Mechanism","Step Functions callback token"],["Timeout","15 minutes"],["Fallback","Skip + escalate alert"],["Scope","Credential revoke, isolation only"]] }
    ],
    caseStudy: "#",
    github: "#"
  },

  support: {
    image: "../New web/images/ai_human_future_5.png",
    tag: "AWS / GenAI",
    title: "AI Customer Support",
    summary: "Bedrock-powered support assistant with DynamoDB session memory for context-aware answers.",
    role: "Cloud Engineer — AI pipeline and memory design",
    focus: "Session context, grounded responses, latency, and memory cost control.",
    stackShort: "Bedrock, Lambda, DynamoDB",
    impact: [["Bedrock", "AI answers"], ["Memory", "sessions"], ["API", "real time"]],
    whatIDid: [
      "Built API Gateway layer routing customer queries to a Lambda prompt orchestrator",
      "Designed DynamoDB session memory schema with TTL-based expiry to control storage cost",
      "Tuned Bedrock prompts for concise, support-style responses grounded in session context",
      "Kept retrieved memory structured and concise to minimize token usage per request"
    ],
    skills: ["Bedrock", "Lambda", "DynamoDB", "API Gateway", "GenAI", "Prompt Engineering", "Session Memory", "RAG"],
    problem: "Support teams lose time to repetitive questions, while customers lose context between separate interactions — each conversation starts from scratch regardless of prior history.",
    setupFacts: [
      { k: "Scenario",   v: "Support team handling repetitive questions; customers losing context across interactions" },
      { k: "Constraint", v: "Session memory must be cheap to store and fast to retrieve — token cost scales with context size" },
      { k: "Approach",   v: "DynamoDB session memory with TTL, injected into Bedrock prompt per request via Lambda" },
      { k: "Timeline",   v: "4 weeks — API layer, memory schema, and prompt tuning" }
    ],
    decisions: [
      { title: "DynamoDB TTL for session memory cost control", tag: "Cost",
        detail: "Each session record has a TTL attribute set to 30 days. DynamoDB deletes expired records automatically, keeping storage cost proportional to active sessions rather than growing indefinitely.",
        tradeoff: "Customers lose context after 30 days of inactivity. This is acceptable — most support issues resolve within days, and stale context can actively mislead responses." },
      { title: "Structured memory over raw conversation history", tag: "Prompt Design",
        detail: "Session memory stores resolved facts (customer tier, previous issue category, last resolution) rather than raw transcript. Structured data is more token-efficient and less likely to confuse the model with irrelevant history.",
        tradeoff: "Requires a memory extraction step after each interaction, but cuts prompt token cost by ~60% compared to injecting full transcripts." }
    ],
    learned: [
      "Token cost scales fast when session memory is unstructured — design the schema before building retrieval",
      "Bedrock response quality is more sensitive to prompt structure than to model version",
      "TTL-based expiry is the right default for any session store — always set one"
    ],
    differently: "Add a confidence score to each stored memory fact. Some extracted facts during testing were ambiguous or incorrect. A threshold would let the system omit low-quality context rather than injecting potentially misleading information into the prompt.",
    archNodes: [
      { icon: "💬", tag: "Input", title: "Customer Query", sub: "API Gateway Endpoint",
        role: "Customer message arrives at the API Gateway endpoint with a session token. The session ID is used to look up existing memory before building the prompt.",
        facts: [["Auth","Session token (JWT)"],["Format","JSON: { sessionId, message }"],["Validation","Schema + session check"],["Rate Limit","100 req/min per session"]] },
      { icon: "⚡", tag: "Compute", title: "Lambda Prompt", sub: "Orchestration Layer",
        role: "Assembles the full prompt by injecting session memory into the system context before calling Bedrock. Updates the session record after the response is generated.",
        facts: [["Runtime","Node.js 20"],["Token Budget","2,048 context + 512 response"],["Memory Injection","System prompt prefix"],["Latency","< 300 ms excl. Bedrock"]] },
      { icon: "🗄️", tag: "Memory", title: "DynamoDB", sub: "Session Store · 30-day TTL",
        role: "Stores structured session facts per customer: tier, previous issue category, and last resolution. TTL-based expiry keeps storage cost proportional to active sessions.",
        facts: [["Schema","SessionId, Facts, UpdatedAt, TTL"],["TTL","30 days after last interaction"],["Access","GetItem per request"],["Token Cost","~150 vs ~800 raw transcript"]] },
      { icon: "🤖", tag: "AI", title: "Bedrock Model", sub: "Claude via AWS",
        role: "Claude model invoked with the assembled prompt. System context includes session memory, support policy, and response format instructions.",
        facts: [["Model","Claude 3 Haiku (cost-optimized)"],["Max Tokens","512 response"],["Temperature","0.3 (factual, grounded)"],["Region","us-east-1"]] },
      { icon: "✉️", tag: "Output", title: "Response", sub: "Context-Aware Answer",
        role: "Response returned to the customer and session memory updated with any new resolved facts. Memory extraction runs asynchronously to avoid adding latency.",
        facts: [["Format","Plain text, < 200 words"],["Latency","< 2 s end-to-end"],["Memory Update","Async post-response"],["Delivery","API Gateway JSON response"]] }
    ],
    caseStudy: "#",
    github: "#"
  }
};

// DOM references
const gallery          = document.getElementById("gallery");
const items            = Array.from(document.querySelectorAll(".gallery-item"));
const indicator        = document.querySelector(".indicator");
const popup            = document.getElementById("projectPopup");
const popupBg          = document.getElementById("popupBg");
const popupTag         = document.getElementById("popupTag");
const popupTitle       = document.getElementById("popupTitle");
const popupSummary     = document.getElementById("popupSummary");
const popupRole        = document.getElementById("popupRole");
const popupFocus       = document.getElementById("popupFocus");
const popupStackShort  = document.getElementById("popupStackShort");
const popupProblem     = document.getElementById("popupProblem");
const popupSetupFacts  = document.getElementById("popupSetupFacts");
const popupWhatIDid    = document.getElementById("popupWhatIDid");
const popupSkills      = document.getElementById("popupSkills");
const impactRow        = document.getElementById("impactRow");
const wireframe        = document.getElementById("wireframe");
const popupDecisions   = document.getElementById("popupDecisions");
const popupOutcomeStats = document.getElementById("popupOutcomeStats");
const popupLearned     = document.getElementById("popupLearned");
const popupDifferently = document.getElementById("popupDifferently");
const caseStudyLink    = document.getElementById("caseStudyLink");
const githubLink       = document.getElementById("githubLink");
const viewRecruiter    = document.getElementById("popupViewRecruiter");
const viewTechnical    = document.getElementById("popupViewTechnical");
const ptoggleBtns      = document.querySelectorAll(".ptoggle-btn");
const ptogglePill      = document.getElementById("ptogglePill");
const nodeCard         = document.getElementById("nodeCard");
const ncTag            = document.getElementById("ncTag");
const ncTitle          = document.getElementById("ncTitle");
const ncRole           = document.getElementById("ncRole");
const ncFacts          = document.getElementById("ncFacts");
const ncClose          = document.getElementById("ncClose");

// Toggle logic
let currentView = "recruiter";

function positionPill(activeBtn) {
  const bar = document.querySelector(".ptoggle-bar");
  const barRect = bar.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  ptogglePill.style.width = btnRect.width + "px";
  ptogglePill.style.transform = `translateX(${btnRect.left - barRect.left - 3}px)`;
}

function triggerArchAnimation() {
  const flow = wireframe.querySelector(".flow");
  if (!flow) return;
  flow.classList.remove("flow--animated");
  void flow.getBoundingClientRect();
  flow.classList.add("flow--animated");
}

function switchView(view) {
  if (view === currentView) return;
  currentView = view;
  const leaving  = view === "recruiter" ? viewTechnical : viewRecruiter;
  const entering = view === "recruiter" ? viewRecruiter : viewTechnical;
  leaving.classList.remove("visible");
  setTimeout(() => {
    leaving.classList.remove("active");
    entering.classList.add("active");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      entering.classList.add("visible");
      if (view === "technical") triggerArchAnimation();
    }));
  }, 180);
}

ptoggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    ptoggleBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    positionPill(btn);
    switchView(btn.dataset.view);
  });
});

window.addEventListener("resize", () => {
  const activeBtn = document.querySelector(".ptoggle-btn.active");
  if (activeBtn) positionPill(activeBtn);
});

// Architecture flow builder
function flattenArchNodes(archNodes) {
  const flat = [];
  archNodes.forEach(entry => {
    if (entry.type === "split") {
      entry.nodes.forEach(n => flat.push(n));
    } else {
      flat.push(entry);
    }
  });
  return flat;
}

function buildArchFlow(project) {
  const entries = project.archNodes;
  const nodeStagger = 0.38;
  let nodeIdx = 0;

  let html = '<div class="flow">';

  entries.forEach((entry, i) => {
    const isLast     = i === entries.length - 1;
    const nextIsSplit = !isLast && entries[i + 1]?.type === "split";

    if (entry.type === "split") {
      const pulseDelay = (nodeIdx * nodeStagger).toFixed(2);
      html += `<div class="flow-split">
        <div class="split-line-down" style="--pulse-delay:${pulseDelay}s"></div>
        <div class="split-row">`;
      entry.nodes.forEach((node) => {
        const delay = (nodeIdx * nodeStagger + 0.08).toFixed(2);
        html += `<div class="split-branch">
          <div class="branch-line"></div>
          <div class="branch-arrow"></div>
          <div class="flow-node" data-idx="${nodeIdx}" style="animation-delay:${delay}s">
            <div class="node-icon">${node.icon}</div>
            <div class="node-label">
              <span class="node-name">${node.title}</span>
              <span class="node-role">${node.sub}</span>
            </div>
          </div>
        </div>`;
        nodeIdx++;
      });
      html += `</div></div>`;
    } else {
      const delay      = (nodeIdx * nodeStagger + 0.08).toFixed(2);
      const pulseDelay = (nodeIdx * nodeStagger).toFixed(2);
      const isRoot     = nodeIdx === 0 ? " is-root" : "";

      html += `<div class="flow-node" data-idx="${nodeIdx}" style="animation-delay:${delay}s">
        <div class="node-icon${isRoot}">${entry.icon}</div>
        <div class="node-label">
          <span class="node-name">${entry.title}</span>
          <span class="node-role">${entry.sub}</span>
        </div>
      </div>`;
      nodeIdx++;

      if (!isLast && !nextIsSplit) {
        html += `<div class="flow-connector">
          <div class="connector-line" style="--pulse-delay:${pulseDelay}s"></div>
          <div class="connector-arrow"></div>
        </div>`;
      }
    }
  });

  html += "</div>";
  return html;
}

// Node card
let activeNodeEl = null;

function showNodeCard(project, idx) {
  const node = flattenArchNodes(project.archNodes)[idx];
  if (!node) return;
  ncTag.textContent   = node.tag;
  ncTitle.textContent = node.title;
  ncRole.textContent  = node.role;
  ncFacts.innerHTML   = node.facts.map(([k, v]) =>
    `<span class="ncf-k">${k}</span><span class="ncf-v">${v}</span>`
  ).join("");
  nodeCard.classList.add("visible");
}

function hideNodeCard() {
  nodeCard.classList.remove("visible");
  if (activeNodeEl) {
    activeNodeEl.classList.remove("active");
    activeNodeEl = null;
  }
}

ncClose.addEventListener("click", hideNodeCard);

function wireNodeClicks(project) {
  wireframe.querySelectorAll(".flow-node").forEach((node) => {
    node.addEventListener("click", () => {
      const idx = parseInt(node.dataset.idx, 10);
      if (activeNodeEl === node && nodeCard.classList.contains("visible")) {
        hideNodeCard();
        return;
      }
      if (activeNodeEl) activeNodeEl.classList.remove("active");
      activeNodeEl = node;
      node.classList.add("active");
      showNodeCard(project, idx);
    });
  });
}

// Key Decisions accordion
function buildDecisions(project) {
  popupDecisions.innerHTML = "";
  project.decisions.forEach((d, i) => {
    const card = document.createElement("div");
    card.className = "d-card";
    card.innerHTML = `
      <div class="d-card__head">
        <span class="d-card__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="d-card__title">${d.title}</span>
        <span class="d-card__tag">${d.tag}</span>
        <span class="d-card__chevron">▾</span>
      </div>
      <div class="d-card__body">
        <div class="d-card__inner">
          <p class="d-card__detail">${d.detail}</p>
          <div class="d-card__tradeoff">${d.tradeoff}</div>
        </div>
      </div>`;

    const head  = card.querySelector(".d-card__head");
    const body  = card.querySelector(".d-card__body");
    const inner = card.querySelector(".d-card__inner");

    head.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");
      popupDecisions.querySelectorAll(".d-card.open").forEach((other) => {
        if (other === card) return;
        other.classList.remove("open");
        other.querySelector(".d-card__body").style.height = "0";
      });
      if (isOpen) {
        card.classList.remove("open");
        body.style.height = "0";
      } else {
        card.classList.add("open");
        body.style.height = inner.getBoundingClientRect().height + "px";
      }
    });

    popupDecisions.appendChild(card);
  });
}

// Floating skill animation
let floatAnimId = null;

function cancelFloatAnimation() {
  if (floatAnimId) { cancelAnimationFrame(floatAnimId); floatAnimId = null; }
}

function startFloatAnimation() {
  cancelFloatAnimation();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const container = popupSkills;
    const sidebar   = container.closest(".rec-sidebar");
    if (!sidebar) return;
    const items = Array.from(container.querySelectorAll(".rec-skill-item"));
    if (!items.length) return;

    const containerH = sidebar.clientHeight - 32;
    container.style.height = containerH + "px";

    const itemH   = items[0].offsetHeight || 22;
    const gap     = 2;
    const spacing = Math.max((containerH - items.length * itemH) / (items.length + 1), gap);

    const states = items.map((el, i) => {
      const maxY = Math.max(containerH - itemH, 0);
      const y    = Math.min(spacing * (i + 1) + itemH * i, maxY);
      el.style.transform = `translateY(${y}px)`;
      const speed = 0.3 + Math.random() * 0.5;
      return { el, y, vy: speed * (Math.random() > 0.5 ? 1 : -1), maxY, h: itemH };
    });

    function tick() {
      // Move each item
      states.forEach((s) => {
        s.y += s.vy;
        if (s.y <= 0)      { s.y = 0;      s.vy =  Math.abs(s.vy); }
        if (s.y >= s.maxY) { s.y = s.maxY; s.vy = -Math.abs(s.vy); }
      });

      // Collision: sort by Y, resolve adjacent overlaps
      const sorted = [...states].sort((a, b) => a.y - b.y);
      for (let i = 0; i < sorted.length - 1; i++) {
        const a = sorted[i];
        const b = sorted[i + 1];
        const overlap = (a.y + a.h + gap) - b.y;
        if (overlap > 0) {
          a.y -= overlap / 2;
          b.y += overlap / 2;
          a.y = Math.max(0, a.y);
          b.y = Math.min(b.maxY, b.y);
          [a.vy, b.vy] = [b.vy, a.vy];
        }
      }

      states.forEach((s) => { s.el.style.transform = `translateY(${s.y}px)`; });
      floatAnimId = requestAnimationFrame(tick);
    }

    floatAnimId = requestAnimationFrame(tick);
  }));
}

function setActive(item) {
  cancelFloatAnimation();
  const project = projects[item.dataset.project];
  if (!project) return;

  items.forEach((candidate) => {
    candidate.classList.toggle("active", candidate === item);
  });

  popup.classList.add("visible");

  // Reset to recruiter view on every project switch
  hideNodeCard();
  currentView = "recruiter";
  ptoggleBtns.forEach((b) => b.classList.toggle("active", b.dataset.view === "recruiter"));
  viewTechnical.classList.remove("visible", "active");
  viewRecruiter.classList.remove("visible");
  viewRecruiter.classList.add("active");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    viewRecruiter.classList.add("visible");
    const activeBtn = document.querySelector(".ptoggle-btn.active");
    if (activeBtn) positionPill(activeBtn);
  }));

  // Shared
  popupBg.src              = project.image;
  popupTag.textContent     = project.tag;
  popupTitle.textContent   = project.title;
  popupSummary.textContent = project.summary;
  popupRole.textContent    = project.role;
  popupFocus.textContent   = project.focus;
  popupStackShort.textContent = project.stackShort;
  caseStudyLink.href       = project.caseStudy;
  githubLink.href          = project.github;

  // Impact row
  impactRow.innerHTML = "";
  project.impact.forEach(([value, label]) => {
    const node = document.createElement("div");
    node.className = "impact-item";
    node.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
    impactRow.appendChild(node);
  });

  // What I Did bullets
  popupWhatIDid.innerHTML = "";
  project.whatIDid.forEach((bullet) => {
    const li = document.createElement("li");
    li.textContent = bullet;
    popupWhatIDid.appendChild(li);
  });

  // Skills sidebar
  popupSkills.innerHTML = "";
  project.skills.forEach((skill) => {
    const item = document.createElement("div");
    item.className = "rec-skill-item";
    item.innerHTML = `<span class="material-icons rsi-icon">${SKILL_ICONS[skill] ?? "build"}</span><span class="rsi-name">${skill}</span>`;
    popupSkills.appendChild(item);
  });
  startFloatAnimation();

  // Setup — problem + fact grid
  popupProblem.textContent = project.problem;
  popupSetupFacts.innerHTML = "";
  project.setupFacts.forEach(({ k, v }) => {
    const fact = document.createElement("div");
    fact.className = "t-fact";
    fact.innerHTML = `<span class="tf-k">${k}</span><span class="tf-v">${v}</span>`;
    popupSetupFacts.appendChild(fact);
  });

  // Architecture flow
  wireframe.innerHTML = buildArchFlow(project);
  wireNodeClicks(project);

  // Key Decisions accordion
  buildDecisions(project);

  // Outcome stats
  popupOutcomeStats.innerHTML = "";
  project.impact.forEach(([value, label]) => {
    const stat = document.createElement("div");
    stat.className = "t-ostat";
    stat.innerHTML = `<span class="tos-v">${value}</span><span class="tos-l">${label}</span>`;
    popupOutcomeStats.appendChild(stat);
  });

  // What I Learned
  popupLearned.innerHTML = "";
  project.learned.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    popupLearned.appendChild(li);
  });

  // What I'd Do Differently
  popupDifferently.textContent = project.differently;
}

items.forEach((item) => {
  item.addEventListener("mouseenter", () => setActive(item));
  item.addEventListener("focus",      () => setActive(item));
  item.addEventListener("click",      () => setActive(item));
});

if (gallery && indicator) {
  gallery.addEventListener("mousemove", (event) => {
    const bounds = gallery.getBoundingClientRect();
    indicator.style.top = `${event.clientY - bounds.top + 28}px`;
  });
}

setActive(items[0]);
