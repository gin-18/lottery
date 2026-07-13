# Separate daisyUI Component Tokens from Tailwind Layout Scale

## Status

Accepted

The project uses `daisyui@4.12.22`, which provides shape semantics such as `--rounded-box` and `--rounded-btn`, but does not provide a general page-spacing token system. We decided to keep component shape under daisyUI defaults and express spacing with a constrained Tailwind whitelist instead of project-owned layout classes. This avoids redundant root overrides of daisyUI shape tokens, keeps AI-generated markup close to the actual layout being rendered, and prevents drift into generic wrapper classes such as `page-section` or `content-panel-block` that merely hide `grid`, `gap`, `p`, and `rounded-box` combinations. The project therefore treats `spacing` and `rounded` as writing constraints for template classes, not as a reason to introduce a second layer of reusable layout CSS.
