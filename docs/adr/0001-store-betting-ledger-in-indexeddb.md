# Store Betting Ledger in IndexedDB

The first version of the betting ledger stores records in the current browser's IndexedDB because the application is a frontend-only Happy 8 analysis tool and does not manage real accounts or real orders. The implementation uses Dexie.js as the IndexedDB access layer instead of hand-written IndexedDB wrappers. This keeps record entry, settlement, and monthly statistics available without introducing a backend, while accepting that future multi-device sync will require a migration path.
