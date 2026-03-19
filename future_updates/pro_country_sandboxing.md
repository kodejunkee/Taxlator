# Pro Feature Plan: Country-Sandboxed Profiles (Multi-Region Tracking)

## Objective
To seamlessly manage multiple tax profiles without forcing destructive data resets when users switch regions. Instead of wiping a user's stored incomes and savings when moving from `Nigeria` to `Singapore` or the `UK`, the application will isolate and group these records into segregated "sandboxes."

When a user switches to a new region, they load into a completely fresh dashboard relevant only to that region. Returning to a previous region securely restores their archived fiscal records for that country. 

This feature will be pitched as an advanced **Taxlator Pro** capability specifically engineered for digital nomads, expats, and cross-border freelancers who balance multi-national incomes.

## Proposed Architecture

### 1. Data Model Overhaul (`AppContext`)
Currently, `AppContext` tracks monolithic memory arrays:
```typescript
interface AppState {
  incomes: Income[];
  savings: SavedTax[];
  settings: AppSettings;
}
```

**Pro Architecture (The Sandbox Map):**
We will transform the root `incomes` and `savings` arrays into robust dictionary maps indexed directly by the `countryId`:
```typescript
interface ProAppState {
  incomesByRegion: Record<string, Income[]>;
  savingsByRegion: Record<string, SavedTax[]>;
  settings: AppSettings;
}
```

*Example State Map:*
```json
{
  "incomesByRegion": {
    "NG": [{ "id": "1", "amountBase": 1500000 }],
    "UK": [{ "id": "2", "amountBase": 45000 }],
    "SG": []
  }
}
```

### 2. Dynamic Component Resolution Logic
When the application mounts or the `settings.country` configuration changes:
- Core UI components (`HomeScreen`, `ReportScreen`, `IncomeTrackerScreen`) will dynamically resolve their data feeds by indexing into `incomesByRegion[settings.country] || []`.
- If a user configures the `SettingsScreen` and shifts the active profile from Nigeria to Singapore, the dashboard will instantly clear because `incomesByRegion['SG']` is empty, natively acting as a pristine workspace. The `NG` array safely persists in parallel storage.

### 3. Monetization Gateway (The Pro Wall)
- **Free Tier Configuration**: Users are hard-restricted to a single active country context. Seeking to switch countries triggers a mandatory destruction prompt: *"Switching regions will result in the localized recalculation and reset of your existing records. Upgrade to Taxlator Pro to unlock infinitely sandboxed Multi-Region Tracking workspaces."*
- **Pro Tier Configuration**: The application intercepts the selector state change and seamlessly mounts their secondary workspace without executing or requesting destructive array wipes.

### 4. Required Migration Pathway
When ready to build this, here is the technical sequence:
1. **State Database Migration Array**: On the initial silent boot after deploying the Pro update, loop through the user's legacy `incomes` and `savings` arrays and inject them into `incomesByRegion[settings.country]` to gracefully hydrate the new dictionary structures without losing the user's current standard records.
2. **Mutation Routing**: Update the global dispatch reducers (`addIncome`, `addTaxSavings`, `deleteIncome`) to target `state.incomesByRegion[countryId]` rather than pushing to the flat legacy arrays.
3. **UI Aggregation (Optional)**: Build a master "Global Wealth" `ReportScreen` for Pro users that iterables over every map key and resolves a unified cross-region summation using the `exchangeRates` context to bring everything back to a unified global baseline.
