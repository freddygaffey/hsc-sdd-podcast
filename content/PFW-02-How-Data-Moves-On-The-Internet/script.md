---
title: "How Data Moves on the Internet — Packets, IP and DNS"
module: PFW
lesson: "11.2"
kind: lesson
supplementary: supplementary.md
---

NARRATOR: Quick recap first — spaced repetition is half of why these episodes work. Last episode was the first of the course: the applications of web programming. We named three types, and the hook to never lose them was I-E-P — "I Eat Pizza" — Interactive, E-commerce, progressive web app. Interactive sites are dynamic, client-side content that updates without a full page reload. E-commerce is defined by secure financial transactions and protection of sensitive data — security is its distinguishing requirement, because the asset is money and identity. A progressive web app, a P-W-A, is installable and works offline through a service worker — captured by MISO: Manifest, Installable, Service worker, Offline. The big trap: a P-W-A is about install-and-offline capability, not about looking nice on a phone — responsive is appearance, progressive is capability. If you take one thing into the exam, it's I-E-P, in the margin in the first ten seconds.

NARRATOR: Here's the bridge into today. Every one of those three application types — the interactive blog, the online store, the offline-capable field app — is useless until data can actually travel between a browser and a server. Last episode was *what we build*. Today is *how the bytes get there* — the plumbing underneath all of it, and the exam asks about it because it's concrete and easy to mark.

NARRATOR: Today's dot-point, in the syllabus's exact words: investigate and practise how data is transferred on the internet, including data packets, internet protocol addresses — I-P addresses, including I-P version four — and the domain name system, D-N-S. Three things — packets, I-P addresses, and D-N-S — and how they cooperate to move one web request. By the end you'll be able to do three exam things. One: explain why data is broken into packets. Two: describe what an I-P address is and what I-P version four looks like. Three, the big one: describe the role of D-N-S in retrieving a web page. Those objectives again, because at five times speed they go past fast: explain packets, describe I-P and I-P version four, describe the role of D-N-S. They map almost word-for-word onto past exam questions.

NARRATOR: Let me set up the whole journey end to end, then zoom into each piece. You type a web address — let's use a shop, https colon slash slash shop dot example dot com slash cart — and hit enter. Four things happen in order, and here's the memory hook we're coining now and reusing all year. The four steps: D-N-S, then T-C-P, then T-L-S, then H-T-T-P. D-N-S to look up the address. T-C-P to open a connection. T-L-S to secure it. H-T-T-P to ask for the page. Remember the order as "Dogs Take Tasty Hambones" — Dogs for D-N-S, Take for T-C-P, Tasty for T-L-S, Hambones for H-T-T-P. Dogs Take Tasty Hambones. Today we teach the first step properly — D-N-S — plus the packets and I-P addressing everything rides on. The T-L-S and H-T-T-P steps, the securing and the requesting, get their own episode next. But you learn the order as a unit now, because that ordered list is itself a mark-earning answer to "trace a web request".

QUESTION: Before we go deeper — why even break data into packets at all? If I want to send a whole web page, why not just send it as one continuous stream? Pause the player, think it through like the engineer you are, then play.

NARRATOR: Here's the answer, in exam language, because "explain why data is broken into packets" is a real four-mark question. Data is broken into small, numbered units called packets so it can be sent across a shared network efficiently and reliably. Three reasons — name all three for full marks. First, sharing: many conversations interleave over the same links, because no single transfer hogs the line. Second, resilience and routing: each packet can take a different path and route around congestion or a failed link, because each one carries the destination address. Third, error recovery: if one packet is lost or corrupted, only that small packet is resent, not the entire file. A weak answer says "to make it faster". A strong answer names efficiency through sharing, resilience through independent routing, and reliable delivery through resending only the lost packet. The HSC just wants those three justifications spelled out.

NARRATOR: Now a classic trap. Because each packet can take a different route, packets do not necessarily arrive in the order they were sent — some take a slower path, some get held up. So each packet carries a sequence number, and the receiving end uses those numbers to reassemble the data in order and notice if one is missing. Putting packets back in order and requesting any that went missing is the job of T-C-P — the Take in Dogs Take Tasty Hambones — which we meet properly next episode. Lock in the trap: packets do not arrive in order, and that's exactly why they're numbered. An exam answer that assumes packets arrive in sequence is a marking pitfall. There's a tiny piece of pseudocode for that reassembly loop in Listing 2 if you want to see the shape of it — order the packets by sequence number, and flag any gaps.

NARRATOR: Onto addressing. Every device on the internet that sends or receives data needs an address — the internet protocol address, the I-P address. Think of it as a postal address for a machine: a packet carries a destination I-P address the way an envelope carries a street address, and that's how routers know where to forward it. The version you must know by name is I-P version four — I-P-v-four. Here's the shape and the memory hook: four numbers, zero to two-five-five, with dots between. Four numbers, each from zero to two hundred and fifty-five, separated by dots — so something like one-nine-two dot one-six-eight dot zero dot one. That's the whole format. It caps at two-fifty-five because each of those four numbers is eight bits — one byte — and eight bits represent two hundred and fifty-six values, zero through two hundred and fifty-five. You know that from binary; the HSC just wants you to recognise and name the I-P-v-four format. There's a newer one, I-P version six, with vastly more addresses because we ran out of the four-billion-ish that I-P-v-four allows — you only need to know it exists and that it solves I-P-v-four's address-exhaustion problem.

QUESTION: So if every machine already has an I-P address, why do we need anything else? Why not just type the numbers?

NARRATOR: Because nobody can remember that one shop is at some string of four numbers and another is at a different string — and worse, those numbers change when a company moves servers and gets a new I-P address. So we want stable, human-friendly names like shop dot example dot com, and a system that translates a name into the current I-P address. That system is the domain name system — D-N-S — the single most exam-heavy idea in this episode, so we'll do it properly.

NARRATOR: D-N-S, in one sentence, is the system that translates human-readable domain names into the I-P addresses that machines use to locate each other. The standard analogy, and a perfectly good exam line, is that D-N-S is the phone book of the internet: you know the name, D-N-S gives you the number. Markers like that analogy as long as you also use the real term — translates domain names to I-P addresses. Let me walk the resolution, because "describe the role of D-N-S in retrieving a web page" is a three-to-four mark question and the marks come from naming the steps.

NARRATOR: You type shop dot example dot com. Your computer first checks its own cache — looked this up recently? If yes, done, no network needed. If not, it asks a recursive resolver, usually run by your internet provider or a public service. If the resolver doesn't already know, it walks a hierarchy: it asks a root server "who handles dot com?", the root refers it to the dot com servers, those refer it to the servers authoritative for example dot com, and the authoritative server returns the actual I-P address. The resolver hands that I-P back to your computer, which can now open a connection. Crucially, every step caches the answer for a period controlled by a value called T-T-L — time to live. That's why the second visit to a site is faster: the name-to-address mapping is cached and the whole hierarchy walk is skipped until the T-T-L expires. So a mark-earning answer to "describe the role of D-N-S": D-N-S resolves a human-readable domain name into the I-P address of the server hosting the site, by querying a hierarchy of name servers — checking caches first and respecting a time-to-live — so the browser can then connect to the correct server. Name the translation, the hierarchy, and the caching, and you've got the marks.

NARRATOR: Let me interleave hard, because D-N-S connects to the rest of the course in two directions. Forward first: D-N-S is a single point everything depends on — if you can't resolve the name, you can't reach the site, even though the site itself is perfectly healthy. That's exactly the setup for one of the great internet outages, the Dyn D-N-S attack of twenty-sixteen, where a flood of traffic from hijacked smart devices knocked out a major D-N-S provider and took down a huge slice of the U-S web — Twitter, Netflix, Reddit — at once. We tell that story properly in its own case study, and you'll see it cashed in when we cover availability in Secure Software Architecture and insecure smart devices in Software Automation. File it now: D-N-S is critical infrastructure, and a single point of failure. Second link, sideways: the routing and caching ideas here — answers cached close to the user, content served from many places — are the same ideas that scale up into content delivery networks and big-data architecture, episode four of this module. The internet's whole performance story is "cache things closer to the user", and you're meeting it first, right here, with D-N-S.

NARRATOR: Now the full worked example, because tracing one request end-to-end is the spine of a four-to-six mark question and you want to narrate it cold. The request: https colon slash slash shop dot example dot com slash cart. Step one, D-N-S — Dogs: the browser resolves shop dot example dot com to an I-P address, checking caches, then a recursive resolver walking the root, then dot com, then the authoritative server, which returns the I-P, cached under its time-to-live. Step two, T-C-P — Take: the browser opens a reliable connection to that I-P address, on port four-four-three for secure web traffic, using a handshake. Step three, T-L-S — Tasty: that connection is secured — encrypted — so nobody between you and the shop can read your cart or your card details. Step four, H-T-T-P — Hambones: over that secure connection the browser sends the actual request, "get me slash cart", and the server responds with the page, which travels back as a stream of numbered packets your machine reassembles in order. Five steps, in order, each named: that's Dogs Take Tasty Hambones plus packets, and it's a complete answer. Today owns the D-N-S, the packets, and the I-P addressing; next episode owns the T-C-P, T-L-S, H-T-T-P and the ports. But you can already say the whole journey.

NARRATOR: Now the weak-versus-strong contrast, because it's where marks leak. A weak answer to "trace what happens when you enter a U-R-L" says: "the browser sends a request to the server and gets the page back". That's one mark if you're lucky — it skips everything. The strong answer names the sequence: D-N-S resolves the domain name to an I-P address; a T-C-P connection is established to that address; it's secured with T-L-S; then an H-T-T-P request is sent and the response returns as packets reassembled in order. Hear the difference — the strong answer is a *named sequence of protocols*, each named step worth a mark. The exam isn't testing whether you understand that the internet works; it's testing whether you can name the machinery in order. Dogs Take Tasty Hambones is literally the mark scheme.

QUESTION: What's the single most common way students lose marks on this topic?

NARRATOR: Confusing the I-P address with the D-N-S name — treating them as the same thing, or saying "D-N-S is the address". They're opposites in role: the domain name is the human-friendly label, the I-P address is the machine's actual numeric location, and D-N-S is the *translation service* between them. Keep those three straight — name, number, and the translator in the middle — and you won't lose those marks. Say it as a unit: name, number, translator. Domain name, I-P address, D-N-S. The second trap, which we covered, is assuming packets arrive in order — they don't, they're numbered and reassembled.

NARRATOR: Let's lock in today before the exam questions. Data crossing the internet is broken into numbered packets — for efficient sharing of the network, resilient routing around failures, and resending only what's lost — and because they take different paths, they arrive out of order and are reassembled by sequence number. Every machine has an I-P address; I-P version four is four numbers, zero to two-five-five, dots between. D-N-S is the phone book of the internet: it translates a human-readable domain name into the server's I-P address by walking a hierarchy of name servers and caching the answer under a time-to-live. The order of the whole request journey is Dogs Take Tasty Hambones: D-N-S, T-C-P, T-L-S, H-T-T-P. Keep name, number, and translator straight, and remember packets don't arrive in order.

NARRATOR: Now the exam-style finish — five questions, recall up to extended, phrased the way the HSC actually does. Pause and attempt each before the model answer.

QUESTION: Question one, recall. What does D-N-S stand for, and in one sentence, what does it do? Pause, then play.

NARRATOR: D-N-S stands for the domain name system, and it translates human-readable domain names into the I-P addresses that computers use to locate each other on the network. One sentence, both halves — the name and the function. That's the mark.

QUESTION: Question two. Describe the format of an I-P version four address. Pause, then play.

NARRATOR: Model answer: an I-P version four address consists of four numbers, each between zero and two hundred and fifty-five, separated by full stops — for example, one-nine-two dot one-six-eight dot zero dot one. Each number is eight bits, giving two hundred and fifty-six possible values. Naming the four-numbers-zero-to-two-fifty-five-with-dots format is the mark; the eight-bits detail is the bonus that shows you understand why.

QUESTION: Question three, four marks. Explain why data is broken into packets for transmission over the internet. Pause, give a real attempt, then play.

NARRATOR: Model answer: data is divided into small numbered units called packets so it can be transmitted efficiently and reliably over a shared network. First, packets from many users interleave over the same links, so no single transfer monopolises the connection. Second, each packet is routed independently and carries its destination address, so packets can take different paths and route around congestion or failed links. Third, if a packet is lost or corrupted, only that packet is resent rather than the whole file. Each packet carries a sequence number so the receiver can reassemble them in order. Three named benefits plus the sequence-number point — four marks comfortably.

QUESTION: Question four. Describe the role of D-N-S in retrieving a web page. Three marks. Pause, then play.

NARRATOR: Model answer: when a user enters a domain name, D-N-S resolves that name into the I-P address of the server hosting the website. It does this by querying a hierarchy of name servers — checking local and resolver caches first, then root, top-level-domain, and authoritative servers if needed — and the answer is cached under a time-to-live to speed up later requests. The browser then uses the returned I-P address to connect to the correct server. The three marks: it translates name to I-P address, it queries a hierarchy with caching, and the result enables the connection. Notice it does not fetch the page itself — that's H-T-T-P's job, and saying D-N-S "loads the page" is a trap.

QUESTION: Question five, the harder one. A user enters a secure web address into their browser and the page loads. Outline the sequence of steps, naming the protocols involved, from entering the address to the page being displayed. Pause, plan a sequence, then play.

NARRATOR: Model answer: first, D-N-S resolves the domain name to the server's I-P address. Second, the browser establishes a T-C-P connection to that I-P address — for a secure site, on port four-four-three. Third, a T-L-S handshake secures the connection, encrypting the data in transit. Fourth, the browser sends an H-T-T-P request over that secure connection asking for the page. Fifth, the server responds, and the response travels back as numbered packets that the browser reassembles in order and renders. The marks are in naming each protocol in the correct order — D-N-S, T-C-P, T-L-S, H-T-T-P — which is exactly Dogs Take Tasty Hambones. A response that just says "it connects and downloads the page" misses every protocol mark.

NARRATOR: That's episode two. You can trace a request now: packets numbered and reassembled, I-P version four as four numbers with dots, and D-N-S as the translator from name to address — name, number, translator. And the order of the whole journey is locked as Dogs Take Tasty Hambones. Next episode picks up steps two, three and four of that chant — the web protocols and their ports, and how T-L-S turns plain text into cipher text to secure the connection. That's where "eighty plain, four-four-three safe" comes in. See you there.

## Appendix

The narration is self-contained; these listings are for reading only and are never spoken.

Listing 1 — the shape of an I-P version four address (four eight-bit numbers, zero to two hundred and fifty-five, dot-separated):

```text
192.168.0.1
└┬┘ └┬┘ │ │
 │   │  │ └── 0–255  (8 bits / 1 byte)
 │   │  └──── 0–255  (8 bits / 1 byte)
 │   └─────── 0–255  (8 bits / 1 byte)
 └─────────── 0–255  (8 bits / 1 byte)
```

Listing 2 — packet reassembly in NESA standard pseudocode. Packets arrive out of order; order them by sequence number and flag any gaps so they can be re-requested:

```text
BEGIN Reassemble(received_packets, expected_count)
    Sort received_packets by sequence_number ascending
    next_expected ← 0
    FOR each packet IN received_packets
        WHILE packet.sequence_number > next_expected
            Record missing packet next_expected   // gap → request resend
            next_expected ← next_expected + 1
        ENDWHILE
        Append packet.payload TO output_stream
        next_expected ← next_expected + 1
    NEXT packet
    IF next_expected < expected_count THEN
        Record packets next_expected to expected_count − 1 as missing
    ENDIF
    RETURN output_stream
END
```
