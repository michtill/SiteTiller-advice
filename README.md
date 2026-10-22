# SiteTiller advice

Advice for the [SiteTiller](https://github.com/michtill/SiteTiller) application – today the recommended AI models.

- Each topic has its own folder; the file is named after the version of its structure: [`models/v1.json`](models/v1.json), [`images/v1.json`](images/v1.json).
- A change of the structure means a new file (`v2.json`); existing files keep their structure, so older installations keep working.
- Every change of a file's content needs a later `date` than the previous one (and than the copy bundled with the latest app release); CI checks it with `scripts/check.mjs`.
- Data only. The application validates every file strictly before it uses it.

## License

[MIT](LICENSE) © 2026 Michal Tiller
