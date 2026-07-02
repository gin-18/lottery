# Frontend Style Guide

This guide is an AI-facing writing rule set for frontend class names. It constrains `spacing` and `rounded` only. `border`, `background`, and `shadow` are out of scope for this version.

## Ownership

- `daisyUI` owns component-semantic shape tokens such as `rounded-box` and control radius on `btn`, `input`, `select`, `textarea`, and `tab`.
- Tailwind utilities own page spacing.
- Project code should constrain AI output by rule, not by prebuilding generic layout classes in `@layer components`.

## Hard Rules

### 1. Write atomic classes by default

- AI should write classes directly in templates.
- Do not add generic project classes such as `page-section`, `section-stack`, `toolbar-row`, or `content-panel-block` to package layout decisions.
- Only introduce a project class when it represents a stable business surface or stable interaction contract.

### 2. Spacing values are whitelisted

Allowed spacing values:

- `0`
- `2`
- `4`
- `6`
- `8`
- `12`

This whitelist applies to:

- `gap-*`
- `gap-x-*`
- `gap-y-*`
- `space-x-*`
- `space-y-*`
- `p*`
- `m*`

Including axis and side variants such as `px-*`, `py-*`, `pt-*`, `mt-*`, `mb-*`, and `mx-*`.

### 3. Spacing exceptions must be named

- `gap-px` is allowed for border seam layouts.
- `pb-[env(safe-area-inset-bottom)]` is allowed for device safe-area handling.
- Do not invent new arbitrary spacing exceptions without documenting the reason in the change.

### 4. Rounded must use daisyUI semantics first

- Interactive controls should rely on daisyUI component classes such as `btn`, `input`, `select`, `textarea`, and `tab`.
- Non-control containers should prefer `rounded-box`.
- Only true circles should use `rounded-full`.
- Do not override `--rounded-box`, `--rounded-btn`, `--rounded-badge`, or `--tab-radius` at the project root unless there is a deliberate theme change.

### 5. Tailwind rounded utilities are banned by default

- Do not use `rounded`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, or similar Tailwind radius utilities as normal project practice.
- If daisyUI semantics cannot express a real UI constraint, keep the exception narrow and explain why in the change note or review.

## Examples

Correct:

```html
<section class="grid gap-4">
  <div class="rounded-box border border-base-300 p-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-base-content/70">本地个人台账</p>
      <button class="btn btn-sm btn-primary">新增</button>
    </div>
  </div>
</section>
```

Incorrect: generic layout class

```html
<section class="page-section">
  <div class="content-panel-block">...</div>
</section>
```

Incorrect: unapproved spacing and rounded values

```html
<div class="gap-3 rounded-lg p-5">...</div>
```

## Review Checklist

Every new or modified frontend file should be checked for:

- spacing outside `0/2/4/6/8/12`
- unnamed spacing exceptions
- raw Tailwind `rounded-*` on containers
- newly added generic layout classes in project CSS

## Migration Strategy

- Apply these rules to all new code.
- When touching old files, normalize nearby classes opportunistically.
- Do not block feature work on a one-time full rewrite of historical templates.
