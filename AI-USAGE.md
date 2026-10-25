# AI development and testing disclosure

Substantial generative AI assistance was used to develop this educational example. An AI coding assistant drafted the JavaScript parsing, counting and rendering logic, HTML/CSS interface, synthetic examples, automated logic checks and associated documentation. This is a disclosure about how the source was developed; the calculator itself does not call an AI service.

## Verification and limits

The repository includes `reading-speed.test.cjs`. Run `node reading-speed.test.cjs` with Node.js 20 or later to reproduce the automated logic checks. They cover text counts and cue durations, threshold comparisons, Unicode examples, basic timestamp handling and the documented parser boundaries. These checks do not establish translation quality, audience reading performance, security certification or complete accessibility compliance.

No independent human code review, human-participant study or production evaluation is documented in this project. Do not interpret the automated checks or publication of the source as evidence of any of those activities. No person is represented as having performed an unrecorded review.

This is a small teaching example, not a mature subtitle editing suite or a native Linux binary. The reading-speed threshold is chosen by the user and is illustrative, not an industry standard. Unicode grapheme counting uses `Intl.Segmenter` where available, with a documented code-point fallback. The parser supports basic SRT cues and does not cover every subtitle-format edge case. It does not transcribe, translate, repair or assess the semantic accuracy of subtitles.

The examples are synthetic. There are no customer subtitles, recordings or production records. The calculation code makes no network requests; a hosting service may have its own logs or analytics.

## Provenance and maintenance

An earlier browser demonstration was published on 21 October 2026. The complete eight-file source archive and its MIT licence were deposited on Zenodo on 24 October 2026: https://zenodo.org/records/23628042

Archive SHA-256: `febd8fba93042b1d0b075a84dd43575eb0947524055279016ec365eabc6a4598`.

This repository adds an explicit development-provenance disclosure and a README link to that disclosure. Its computational HTML, CSS, JavaScript and logic-check files are unchanged from the archived example. The documentation clarification is not a new software feature, a new first release or a claim of established production readiness. No support schedule or service-level agreement is promised.

The example is maintained under the group attribution “Scanfile contributors” and provided under the MIT licence without warranty. The related Scanfile translation service is separate; its online service, brand and customer materials are not licensed by this repository. There is no claim of endorsement by GitHub, Zenodo or any directory or publisher.
