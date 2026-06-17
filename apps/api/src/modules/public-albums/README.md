# Public Albums Module

Owns public album discovery, featured album reads, direct-link unlisted album detail, authenticated album search, wishes, reactions, reaction symbol settings, and social audit events.

Privacy rules:

- `public`: can appear on public home, featured sections, and authenticated search.
- `unlisted`: can be opened by direct album link only.
- `private`: not returned by public discovery or public detail endpoints.

Current social duplicate rules:

- One active wish per user per album.
- One active reaction per user per symbol per album.

OAuth account linking and admin moderation/curation UI remain follow-up work.
