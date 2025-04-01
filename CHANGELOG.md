# Change history for stripes-marc-components

## [2.1.0] (IN PROGRESS)

- [UISMRCCOMP-30](https://issues.folio.org/browse/UISMRCCOMP-30) MarcView - accept a new `paneProps` prop.
- [UISMRCCOMP-31](https://issues.folio.org/browse/UISMRCCOMP-31) MarcVersionHistory - add a new `isSharedFromLocalRecord` prop.
- [UISMRCCOMP-32](https://issues.folio.org/browse/UISMRCCOMP-32) Use central tenant id in useUsersBatch to retrieve all users.

## [2.0.1] (IN PROGRESS)

- [UISMRCCOMP-31](https://issues.folio.org/browse/UISMRCCOMP-31) MarcVersionHistory - add a new `isSharedFromLocalRecord` prop.

## [2.0.0] (https://github.com/folio-org/stripes-marc-components/tree/v2.0.0) (2025-03-13)

- [UISMRCCOMP-19](https://issues.folio.org/browse/UISMRCCOMP-19) *BREAKING* migrate stripes dependencies to their Sunflower versions.
- [UISMRCCOMP-20](https://issues.folio.org/browse/UISMRCCOMP-20) *BREAKING* migrate react-intl to v7.
- [UISMRCCOMP-23](https://issues.folio.org/browse/UISMRCCOMP-23) Add a `wrapperClass` prop to `<MarcView>` component
- [UISMRCCOMP-13](https://issues.folio.org/browse/UISMRCCOMP-13) React v19: refactor away from default props for functional components.
- [UISMRCCOMP-26](https://issues.folio.org/browse/UISMRCCOMP-26) *BREAKING* Added `<MarcVersionHistory>` and `useMarcAuditDataQuery`.
- [UISMRCCOMP-27](https://issues.folio.org/browse/UISMRCCOMP-27) Pass `showUserLink` prop for `AuditLogPane`.
- [UISMRCCOMP-28](https://issues.folio.org/browse/UISMRCCOMP-28) Use `tenantId` in `useMarcAuditDataQuery`, pass `totalRecords` and `columnWidths` to `AuditLogPane`.

## [1.1.0] (https://github.com/folio-org/stripes-marc-components/tree/v1.1.0) (2024-10-31)

- [UISMRCCOMP-14](https://issues.folio.org/browse/UISMRCCOMP-14) Provide the `firstMenu` property for the `MarcView` component.
- [UISMRCCOMP-15](https://issues.folio.org/browse/UISMRCCOMP-15) Provide the `actionMenu` property for the `MarcView` component.
- [UISMRCCOMP-17](https://issues.folio.org/browse/UISMRCCOMP-17) Migrate to shared UI workflows.

## [1.0.1] (https://github.com/folio-org/stripes-marc-components/tree/v1.0.1) (2024-04-16)

- [UISMRCCOMP-10](https://issues.folio.org/browse/UISMRCCOMP-10) MarcView - do not re-order 00X fields to be shown first.

## [1.0.0] (https://github.com/folio-org/stripes-marc-components/tree/v1.0.0) (2024-03-21)

- [UISMRCCOMP-1](https://issues.folio.org/browse/UISMRCCOMP-1) Module setup.
- [UISMRCCOMP-6](https://issues.folio.org/browse/UISMRCCOMP-6) Change delimiter symbol in source view to match quickMARC.
- [UISMRCCOMP-7](https://issues.folio.org/browse/UISMRCCOMP-7) Use `null` instead of empty string as an empty tenantId value.
