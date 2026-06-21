---
title: "Designing and Implementing a Progressive Web App"
module: PFW
lesson: "13.4"
kind: lesson
supplementary: supplementary.md
---

NARRATOR: Recap first. Last episode was performance and page-load management. The professional habit: measure before you optimise — profile with developer tools, fix the real bottleneck. The toolkit was C-C-C-L: Caching stores data closer for reuse; Compression with gzip shrinks bytes; a content delivery network serves static assets from a nearby edge server; and Lazy loading defers non-critical resources. Hold onto Caching especially, because today it grows up into something bigger. And cast back to episode one: we named three application types, I-E-P, and the third — the progressive web app — we deferred, promising "we cover P-W-As properly in thirteen-four". This is thirteen-four. Today we build the P-W-A for real, and that caching becomes the engine of offline capability. This is the last teaching lesson of the module, and it ties the front, the back, performance, and accessibility into one artefact.

NARRATOR: You could probably wire up a service worker already. What the H-S-C wants is the precise vocabulary of what *makes* a web app a P-W-A, how the offline mechanism works conceptually, and how to design it accessibly. Today's dot-point: design, develop, and implement a progressive web app, applying U-I and U-X principles — font, colour, audio, video, navigation — and considering accessibility and inclusivity. So the home topic is building a P-W-A, with the design and accessibility lens from chapter twelve applied to it.

NARRATOR: Three objectives: name the components that distinguish a P-W-A from a normal website; explain how a service worker provides offline capability; and apply accessibility to the P-W-A. The first is the classic exam question — "describe the features that distinguish a P-W-A from a standard website" — so we anchor everything on it.

NARRATOR: The mnemonic is one we coined in episode one and have been saving: MISO. Manifest, Installable, Service worker, Offline. Like the soup. Those four turn an ordinary website into a P-W-A. In episode one we just named them; today we explain them.

NARRATOR: M — the Manifest. The web app manifest is a small J-S-O-N file that describes the app to the browser: its name, its icons, its theme colour, and crucially its display mode — "standalone", which means when installed it opens in its own window with no browser address bar, looking like a native app. The manifest is what lets the browser offer to *install* the app and place an icon on the home screen. There's a manifest in Listing 1. So the Manifest gives you the I — Installable: because the manifest declares the name, icons, and standalone display, the browser can install the P-W-A to the device's home screen, where it launches like a native app. The manifest is the *how*; installable is the *what*.

NARRATOR: S — the Service worker. This is the heart of a P-W-A, so slow down. A service worker is a script the browser runs *in the background*, separate from the web page, that sits between the app and the network like a programmable proxy. Every network request the app makes passes through it, and the service worker decides: fetch from the network, or serve a cached copy. That's the key idea — it intercepts requests. And O — Offline — falls right out of it: on first visit, the service worker caches the app's essential files — the "app shell": the H-T-M-L, C-S-S, JavaScript, and icons. Then, when the network is gone, the service worker intercepts the request and serves those files from its cache, so the app still opens and works offline. MISO: Manifest, Installable, Service worker, Offline.

QUESTION: Pause the player — this is the connection that makes it click. How is the service worker's offline trick related to the caching we learned last episode for performance? Work out the link, then play.

NARRATOR: It's the *same mechanism, repurposed*. Last episode, caching stored assets so they didn't have to be re-downloaded — that made repeat visits *faster*. A service worker caches the app shell using the exact same idea, but it serves the cache when there's *no network at all* — turning a performance trick into offline capability. The progression across two episodes: caching for speed, then caching for offline. The mark-earning sentence: a service worker enables offline functionality by intercepting network requests and serving previously cached resources when the network is unavailable. Same caching idea you've now met four times — D-N-S, C-D-N, performance, and now offline.

NARRATOR: Now the centrepiece exam question, and the named trap that's haunted us since episode one. "Describe the features that distinguish a P-W-A from a standard website." The trap: students say a P-W-A is just a responsive or mobile-friendly website. It is not. Responsive — which we did in episode eight — is about *layout adapting to screen size*; that's appearance, and an ordinary website can be responsive. A P-W-A is distinguished by *capability*: it is installable to the device via a manifest, it works offline via a service worker, and it can do app-like things like push notifications. So the mark-earning answer: a P-W-A is distinguished from a standard website by being installable to the device through a web app manifest, by working offline through a service worker that caches resources, and by supporting native-like features such as push notifications — capabilities a standard website lacks. Say MISO, expand it, and contrast capability with mere responsiveness. That single answer is the spine of this dot-point.

NARRATOR: One more technical requirement, because it links to security: a service worker only works over H-T-T-P-S — remember the Tasty in Dogs Take Tasty Hambones, T-L-S, port four-four-three. Because a service worker can intercept all network traffic, browsers require a secure connection so it can't be tampered with. So "a P-W-A must be served over H-T-T-P-S" is a legitimate point, and it ties this final lesson back to the secure transport from episode three.

NARRATOR: Now the design half of the dot-point — applying U-I, U-X, and accessibility, the chapter-twelve material returning. Building a P-W-A doesn't excuse you from good design; it raises the bar, because it *looks* like a native app, so users expect a native-quality experience. So everything from episode eight applies: C-FAN-H — Consistency, Feedback, Accessibility, Navigation, Hierarchy. Feedback matters extra here: because a P-W-A works offline, you must clearly tell the user when they *are* offline and that their changes will sync later — silent failure is terrible U-X. And the named trap: don't forget accessibility in the P-W-A shell. An installable, offline app is worthless to someone who can't use it — so the WCAG principles POUR from episodes five and eight still apply: keyboard operability, sufficient contrast, text alternatives, and announcing state changes like "you are now offline" to screen readers. A P-W-A that isn't accessible has failed inclusivity, full stop.

QUESTION: Let me model the worked example from the plan — pause and attempt. You have an ordinary interactive website, like the comment site from episode one. What three things do you add to turn it into a P-W-A, and how does offline then work? Plan it, then play.

NARRATOR: Here's the mark-earning version. Three additions, straight from MISO. One: add a web app manifest — a J-S-O-N file declaring the app's name, icons, and standalone display mode — so the browser can offer to install it to the home screen. Two: register a service worker — a background script that intercepts the site's network requests. Three: in that service worker, cache the app shell — the core H-T-M-L, C-S-S, JavaScript, and icons — on first load. Then offline works like this: when the user opens the app with no connection, the service worker intercepts each request and serves the cached app shell instead of failing, so the app still loads; any new data the user creates offline is queued and synchronised when the connection returns. And it must be served over H-T-T-P-S. That answer names all three additions, explains the offline mechanism via request interception, and includes the H-T-T-P-S requirement — a full-mark response, and it's literally MISO applied.

NARRATOR: Consolidate the interleaving, because this episode is a convergence point. Episode one: this is the P-W-A we promised, MISO finally built. Episode thirteen-three: the service worker's caching is last episode's performance caching, repurposed for offline — the fourth appearance of "cache closer, reuse". Episodes five and eight: accessibility and U-X, WCAG and POUR and C-FAN-H, applied to the app shell. Episode three: H-T-T-P-S is required. And forward, across modules: a P-W-A is exactly the kind of artefact you design, prototype, and evaluate in the project module, section twenty-five-six — the U-I-slash-U-X evaluation there uses these very criteria. Five genuine links — this lesson sits at the centre of the web they form.

NARRATOR: Lock in today. A progressive web app is distinguished from a standard website by MISO: a Manifest that makes it Installable to the device, and a Service worker that makes it work Offline by intercepting requests and serving cached resources — plus app-like features and a requirement to run over H-T-T-P-S. The service worker's offline caching is the same caching idea you learned for performance, repurposed. And a P-W-A must still apply U-I, U-X, and accessibility — C-FAN-H and POUR — including clearly signalling the offline state. Traps: a P-W-A is not just a responsive website — responsive is appearance, progressive is capability; and never neglect accessibility in the app shell.

NARRATOR: Exam-style finish — five questions, recall to extended. Pause and attempt each, then the model answer.

QUESTION: Question one, recall. What are the four components or characteristics that make a web app a P-W-A? Pause, then play.

NARRATOR: Model answer: a manifest, installability, a service worker, and offline capability — MISO. The manifest describes the app and enables installation; the service worker intercepts requests to provide offline functionality. Naming the four, with MISO, is the mark.

QUESTION: Question two. Explain the role of a service worker in a P-W-A. Pause, then play.

NARRATOR: Model answer: a service worker is a script that runs in the background, separate from the web page, acting as a programmable proxy between the app and the network. It intercepts network requests and can serve cached resources, which enables the app to work offline, and it also supports features like background sync and push notifications. Naming "intercepts requests" and "serves cached resources for offline" is the mark.

QUESTION: Question three. Distinguish between a responsive website and a progressive web app. Pause, then play.

NARRATOR: Model answer: a responsive website adapts its layout to different screen sizes — it is about visual appearance across devices. A progressive web app additionally is installable to the device through a manifest and works offline through a service worker, behaving like a native application — it is about capability, not just appearance. A site can be responsive without being a P-W-A. Stating the appearance-versus-capability contrast is the discriminating mark, and it's the module's most persistent trap.

QUESTION: Question four. Why must a progressive web app be served over H-T-T-P-S? Pause, then play.

NARRATOR: Model answer: a service worker can intercept and modify all network requests made by the app, which is powerful and security-sensitive, so browsers require the app to be served over H-T-T-P-S to ensure the connection and the service worker cannot be tampered with by an attacker. Naming the service worker's interception power and the tamper-protection reason is the mark.

QUESTION: Question five, the extended one. Describe how you would convert an existing interactive website into a progressive web app, and explain how it would provide offline functionality while remaining accessible. Pause, plan a structured response, then play.

NARRATOR: Model answer: to convert the site, I would add three things. First, a web app manifest — a J-S-O-N file declaring the app's name, icons, theme colour, and a standalone display mode — so the browser can install it to the home screen, making it installable. Second, I would register a service worker, a background script that intercepts the app's network requests. Third, in the service worker I would cache the app shell — the core H-T-M-L, C-S-S, JavaScript, and icons — on first load. Offline functionality then works because, when there is no network, the service worker intercepts each request and serves the cached resources instead of failing, so the app still opens; data the user creates while offline is queued and synchronised when connectivity returns. The app must be served over H-T-T-P-S. To remain accessible, the app shell must follow the WCAG principles — keyboard operability, sufficient colour contrast, and text alternatives — and it must clearly communicate the offline state, including announcing it to screen readers, so the experience is inclusive. That response applies MISO, explains offline via interception, includes H-T-T-P-S, and integrates accessibility — a full-mark answer that pulls the whole module together.

NARRATOR: That's the last teaching lesson of Programming for the Web. A P-W-A is MISO: Manifest, Installable, Service worker, Offline; the service worker is repurposed caching; it needs H-T-T-P-S; and it still owes the user good, accessible design. We've gone the full distance — from a single packet on the wire, in episode two, to an installable, offline-capable, accessible application, here. Next episode is the module-ending review: we tie the whole of Programming for the Web together, drill every mnemonic one last time, and build the bridge into Secure Software Architecture, where every security promise this module made gets paid. See you there.

## Appendix

### Listing 1 — Web app manifest (manifest.json)

```json
{
  "name": "Comment Board",
  "short_name": "Comments",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1565c0",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```
