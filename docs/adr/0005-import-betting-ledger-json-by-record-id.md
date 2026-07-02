# Import betting ledger JSON by record id

We added import support for the betting ledger export JSON. Imported records are normalized through the ledger model, and when an imported record shares the same `id` as a local record, the imported version replaces the local one so the export can act as a restore format rather than a duplicate-append dump.
